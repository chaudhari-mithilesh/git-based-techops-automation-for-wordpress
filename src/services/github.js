const { Octokit } = require('@octokit/rest');
const { retry } = require('@octokit/plugin-retry');
const { throttling } = require('@octokit/plugin-throttling');
const winston = require('winston');

// Configure Octokit with plugins
const MyOctokit = Octokit.plugin(retry, throttling);

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

class GitHubService {
  constructor() {
    this.validateConfig();
    
    this.octokit = new MyOctokit({
      auth: process.env.GITHUB_TOKEN,
      throttle: {
        onRateLimit: (retryAfter, options, octokit) => {
          logger.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
          if (options.request.retryCount <= 2) {
            logger.info(`Retrying after ${retryAfter} seconds!`);
            return true;
          }
        },
        onSecondaryRateLimit: (retryAfter, options, octokit) => {
          logger.warn(`Secondary rate limit hit for ${options.method} ${options.url}`);
          if (options.request.retryCount <= 2) {
            return true;
          }
        }
      },
      retry: {
        doNotRetry: ['429'],
      },
    });

    this.owner = process.env.GITHUB_OWNER;
    this.repo = process.env.GITHUB_REPO;
    
    // Map of operations to their workflow files
    this.workflowFiles = {
      clone: 'site-clone.yml',
      localClone: 'local-clone.yml',
      backup: 'backup.yml',
      updatePlugins: 'update-plugins.yml',
      updateThemes: 'update-themes.yml'
    };
  }

  validateConfig() {
    const requiredEnvVars = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  async validateRepository() {
    try {
      await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo
      });
      return true;
    } catch (error) {
      logger.error('Repository validation failed:', error);
      throw new Error(`Repository validation failed: ${error.message}`);
    }
  }

  async validateWorkflowFile(workflowFile) {
    try {
      await this.octokit.rest.actions.getWorkflow({
        owner: this.owner,
        repo: this.repo,
        workflow_id: workflowFile
      });
      return true;
    } catch (error) {
      logger.error(`Workflow file validation failed for ${workflowFile}:`, error);
      throw new Error(`Workflow ${workflowFile} not found or inaccessible`);
    }
  }

  async triggerWorkflow(operation, inputs) {
    try {
      const workflowFile = this.workflowFiles[operation];
      if (!workflowFile) {
        throw new Error(`Unknown operation: ${operation}. Valid operations are: ${Object.keys(this.workflowFiles).join(', ')}`);
      }

      // Validate repository and workflow file access
      await this.validateRepository();
      await this.validateWorkflowFile(workflowFile);

      logger.info(`Triggering workflow ${workflowFile} for operation ${operation} with inputs:`, inputs);
      
      const response = await this.octokit.rest.actions.createWorkflowDispatch({
        owner: this.owner,
        repo: this.repo,
        workflow_id: workflowFile,
        ref: inputs.targetBranch || 'main',
        inputs: {
          sourceUrl: inputs.sourceUrl,
          targetRepo: inputs.targetRepo,
          targetBranch: inputs.targetBranch
        }
      });

      logger.info(`Workflow ${workflowFile} triggered successfully`);
      return {
        id: response.data.id,
        status: 'pending',
        message: 'Workflow triggered successfully',
        html_url: response.data.html_url,
        workflow: workflowFile,
        operation
      };
    } catch (error) {
      logger.error(`Error triggering workflow for operation ${operation}:`, error);
      
      let errorMessage = error.message;
      if (error.status === 404) {
        errorMessage = `Workflow file not found. Please check if ${this.workflowFiles[operation]} exists in the .github/workflows directory`;
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please check your GITHUB_TOKEN permissions';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden. Please check repository permissions';
      } else if (error.status === 422) {
        errorMessage = 'Invalid workflow inputs provided';
      }
      
      throw new Error(`Failed to trigger workflow: ${errorMessage}`);
    }
  }

  async getWorkflowStatus(runId) {
    try {
      const response = await this.octokit.rest.actions.getWorkflowRun({
        owner: this.owner,
        repo: this.repo,
        run_id: runId
      });

      const run = response.data;
      return {
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        message: this.getStatusMessage(run.status, run.conclusion),
        html_url: run.html_url,
        created_at: run.created_at,
        updated_at: run.updated_at,
        logs_url: run.logs_url
      };
    } catch (error) {
      logger.error(`Error getting workflow status for run ${runId}:`, error);
      throw new Error(`Failed to get workflow status: ${error.message}`);
    }
  }

  getStatusMessage(status, conclusion) {
    if (status === 'completed') {
      switch (conclusion) {
        case 'success': return 'Workflow completed successfully';
        case 'failure': return 'Workflow failed';
        case 'cancelled': return 'Workflow was cancelled';
        case 'skipped': return 'Workflow was skipped';
        default: return `Workflow completed with conclusion: ${conclusion}`;
      }
    }
    return status === 'in_progress' ? 'Workflow is running' : `Workflow is ${status}`;
  }

  async getWorkflowRuns(operation) {
    try {
      const workflowFile = this.workflowFiles[operation];
      if (!workflowFile) {
        throw new Error(`Unknown operation: ${operation}`);
      }

      const response = await this.octokit.rest.actions.listWorkflowRuns({
        owner: this.owner,
        repo: this.repo,
        workflow_id: workflowFile,
        per_page: 10
      });

      return response.data.workflow_runs.map(run => ({
        id: run.id,
        status: run.status,
        conclusion: run.conclusion,
        message: this.getStatusMessage(run.status, run.conclusion),
        created_at: run.created_at,
        updated_at: run.updated_at,
        html_url: run.html_url,
        logs_url: run.logs_url,
        head_branch: run.head_branch
      }));
    } catch (error) {
      logger.error(`Error getting workflow runs for operation ${operation}:`, error);
      throw new Error(`Failed to get workflow runs: ${error.message}`);
    }
  }
}

const githubService = new GitHubService();
module.exports = githubService; 