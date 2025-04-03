import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class WorkflowService {
  async triggerClone(sourceUrl, targetRepo, targetBranch) {
    try {
      const response = await axios.post(`${API_URL}/api/workflows/clone`, {
        sourceUrl,
        targetRepo,
        targetBranch
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to trigger clone workflow');
    }
  }

  async triggerPluginUpdate(siteUrl, plugins) {
    try {
      const response = await axios.post(`${API_URL}/api/workflows/update-plugins`, {
        siteUrl,
        plugins
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to trigger plugin update workflow');
    }
  }

  async triggerThemeUpdate(siteUrl, themes) {
    try {
      const response = await axios.post(`${API_URL}/api/workflows/update-themes`, {
        siteUrl,
        themes
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to trigger theme update workflow');
    }
  }

  async getWorkflowStatus(runId) {
    try {
      const response = await axios.get(`${API_URL}/api/workflows/status/${runId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get workflow status');
    }
  }

  async getWorkflowRuns(workflowName) {
    try {
      const response = await axios.get(`${API_URL}/api/workflows/runs/${workflowName}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get workflow runs');
    }
  }
}

const workflowService = new WorkflowService();
export default workflowService; 