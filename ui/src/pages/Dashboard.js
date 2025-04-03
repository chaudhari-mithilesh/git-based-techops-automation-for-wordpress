import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Extension as ExtensionIcon,
  Palette as PaletteIcon,
  PlayArrow as PlayIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [workflows] = useState([
    {
      id: 1,
      name: 'Site Cloning',
      status: 'scheduled',
      lastRun: '2024-03-20 10:00 AM',
      nextRun: '2024-03-21 10:00 AM',
      sites: ['site1.com', 'site2.com'],
    },
    {
      id: 2,
      name: 'Plugin Updates',
      status: 'success',
      lastRun: '2024-03-19 02:00 PM',
      nextRun: '2024-03-26 02:00 PM',
      updated: 5,
      total: 10,
    },
    {
      id: 3,
      name: 'Theme Updates',
      status: 'running',
      lastRun: '2024-03-20 03:00 PM',
      nextRun: '2024-03-27 03:00 PM',
      updated: 2,
      total: 3,
    },
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'clone',
      site: 'site1.com',
      status: 'success',
      timestamp: '2024-03-20 10:15 AM',
    },
    {
      id: 2,
      type: 'plugin',
      plugin: 'WooCommerce',
      status: 'success',
      timestamp: '2024-03-19 02:30 PM',
    },
    {
      id: 3,
      type: 'theme',
      theme: 'Twenty Twenty-Four',
      status: 'running',
      timestamp: '2024-03-20 03:15 PM',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'running':
        return 'primary';
      case 'scheduled':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleRunWorkflow = (workflowId) => {
    // TODO: Trigger GitHub workflow
    console.log('Running workflow:', workflowId);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Automation Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Workflow Status */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Automated Workflows
          </Typography>
          <Grid container spacing={2}>
            {workflows.map((workflow) => (
              <Grid item xs={12} md={4} key={workflow.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }}>
                        {workflow.name === 'Site Cloning' && <LanguageIcon />}
                        {workflow.name === 'Plugin Updates' && <ExtensionIcon />}
                        {workflow.name === 'Theme Updates' && <PaletteIcon />}
                      </Box>
                      <Typography variant="h6">{workflow.name}</Typography>
                    </Box>
                    <Chip
                      label={workflow.status}
                      color={getStatusColor(workflow.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Last Run: {workflow.lastRun}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Next Run: {workflow.nextRun}
                    </Typography>
                    {workflow.updated && (
                      <Typography variant="body2" color="text.secondary">
                        Progress: {workflow.updated}/{workflow.total}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      startIcon={<PlayIcon />}
                      onClick={() => handleRunWorkflow(workflow.id)}
                      color="primary"
                    >
                      Run Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      {activity.status === 'success' && <SuccessIcon color="success" />}
                      {activity.status === 'running' && <ScheduleIcon color="primary" />}
                      {activity.status === 'error' && <ErrorIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        activity.type === 'clone'
                          ? `Site Cloned: ${activity.site}`
                          : activity.type === 'plugin'
                          ? `Plugin Updated: ${activity.plugin}`
                          : `Theme Updated: ${activity.theme}`
                      }
                      secondary={activity.timestamp}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 