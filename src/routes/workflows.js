const express = require('express');
const router = express.Router();
const githubService = require('../services/github');

// Trigger site clone workflow
router.post('/clone', async (req, res) => {
  try {
    const { sourceUrl, targetRepo, targetBranch } = req.body;
    const result = await githubService.triggerWorkflow('clone-site.yml', {
      source_url: sourceUrl,
      target_repo: targetRepo,
      target_branch: targetBranch
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to trigger clone workflow',
      message: error.message
    });
  }
});

// Trigger plugin update workflow
router.post('/update-plugins', async (req, res) => {
  try {
    const { siteUrl, plugins } = req.body;
    const result = await githubService.triggerWorkflow('update-plugins.yml', {
      site_url: siteUrl,
      plugins: plugins.join(',')
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to trigger plugin update workflow',
      message: error.message
    });
  }
});

// Trigger theme update workflow
router.post('/update-themes', async (req, res) => {
  try {
    const { siteUrl, themes } = req.body;
    const result = await githubService.triggerWorkflow('update-themes.yml', {
      site_url: siteUrl,
      themes: themes.join(',')
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to trigger theme update workflow',
      message: error.message
    });
  }
});

// Get workflow status
router.get('/status/:runId', async (req, res) => {
  try {
    const status = await githubService.getWorkflowStatus(req.params.runId);
    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get workflow status',
      message: error.message
    });
  }
});

// Get recent workflow runs
router.get('/runs/:workflowName', async (req, res) => {
  try {
    const runs = await githubService.getWorkflowRuns(req.params.workflowName);
    res.json(runs);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get workflow runs',
      message: error.message
    });
  }
});

module.exports = router; 