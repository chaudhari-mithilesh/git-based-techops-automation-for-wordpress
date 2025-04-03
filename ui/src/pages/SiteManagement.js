import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import workflowService from '../services/workflowService';

const SiteManagement = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [cloneConfig, setCloneConfig] = useState({
    sourceUrl: 'http://localhost:8080',
    targetRepo: 'demo-wordpress-site-for-techops',
    targetBranch: 'main'
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);
      // For now, we'll keep using static data until we implement site listing API
      const demoSites = [
        {
          id: 1,
          name: 'Demo Site',
          url: 'http://localhost:8080',
          status: 'active',
          cloneStatus: 'not_cloned',
          lastUpdate: new Date().toISOString()
        }
      ];
      setSites(demoSites);
    } catch (err) {
      setError('Failed to load sites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneSubmit = async () => {
    try {
      setLoading(true);
      const result = await workflowService.triggerClone(
        cloneConfig.sourceUrl,
        cloneConfig.targetRepo,
        cloneConfig.targetBranch
      );
      setSuccess('Site cloning initiated successfully');
      setCloneDialogOpen(false);
      // Update the site status to reflect cloning is in progress
      setSites(prevSites =>
        prevSites.map(site => ({
          ...site,
          cloneStatus: 'cloning'
        }))
      );
      // Start polling for status
      pollCloneStatus(result.id);
    } catch (err) {
      setError(err.message || 'Failed to initiate site cloning');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pollCloneStatus = async (runId) => {
    try {
      const status = await workflowService.getWorkflowStatus(runId);
      if (status.status === 'completed') {
        setSites(prevSites =>
          prevSites.map(site => ({
            ...site,
            cloneStatus: 'cloned',
            lastUpdate: new Date().toISOString()
          }))
        );
      } else if (status.status === 'failed') {
        setError('Clone operation failed');
        setSites(prevSites =>
          prevSites.map(site => ({
            ...site,
            cloneStatus: 'failed'
          }))
        );
      } else {
        // Still running, poll again after 5 seconds
        setTimeout(() => pollCloneStatus(runId), 5000);
      }
    } catch (err) {
      console.error('Error polling status:', err);
    }
  };

  const handleCloneConfigChange = (field) => (event) => {
    setCloneConfig(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'cloned':
        return 'success';
      case 'cloning':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Site Cloning Workflows</Typography>
        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={() => setCloneDialogOpen(true)}
          disabled={loading}
        >
          Configure Clone Workflow
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site Name</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Clone</TableCell>
              <TableCell>Clone Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) => (
              <TableRow key={site.id}>
                <TableCell>{site.name}</TableCell>
                <TableCell>{site.url}</TableCell>
                <TableCell>
                  <Chip
                    label={site.status}
                    color={getStatusColor(site.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{site.lastUpdate}</TableCell>
                <TableCell>
                  <Chip
                    label={site.cloneStatus}
                    color={getStatusColor(site.cloneStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={() => handleCloneSubmit()}
                    disabled={loading || site.cloneStatus === 'cloning'}
                  >
                    Clone Again
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={cloneDialogOpen} onClose={() => setCloneDialogOpen(false)}>
        <DialogTitle>Configure Clone Workflow</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Source URL"
              value={cloneConfig.sourceUrl}
              onChange={handleCloneConfigChange('sourceUrl')}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Target Repository"
              value={cloneConfig.targetRepo}
              onChange={handleCloneConfigChange('targetRepo')}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Target Branch"
              value={cloneConfig.targetBranch}
              onChange={handleCloneConfigChange('targetBranch')}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloneDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCloneSubmit}
            variant="contained"
            disabled={loading}
          >
            Start Clone
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SiteManagement; 