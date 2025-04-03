import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

function Settings() {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [settings] = useState({
    github: {
      enabled: true,
      organization: 'example-org',
      repository: 'wordpress-automation',
      branch: 'main',
      token: '********',
      lastSync: '2024-03-20 10:00 AM',
      nextSync: '2024-03-21 10:00 AM',
    },
    notifications: {
      enabled: true,
      slack: {
        enabled: true,
        channel: '#wordpress-updates',
        lastNotification: '2024-03-20 02:00 PM',
      },
      email: {
        enabled: true,
        recipients: ['admin@example.com'],
        lastNotification: '2024-03-20 02:00 PM',
      },
    },
    security: {
      enabled: true,
      backupEnabled: true,
      backupSchedule: 'daily',
      lastBackup: '2024-03-20 12:00 AM',
      nextBackup: '2024-03-21 12:00 AM',
    },
    storage: {
      enabled: true,
      provider: 's3',
      bucket: 'wordpress-backups',
      region: 'us-east-1',
      lastCleanup: '2024-03-19 12:00 AM',
      nextCleanup: '2024-03-26 12:00 AM',
    },
  });

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
  };

  const handleSubmit = () => {
    // TODO: Update settings and configure workflows
    handleCloseDialog();
  };

  const renderGitHubSettings = () => (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Organization</InputLabel>
        <Select
          value={settings.github.organization}
          label="Organization"
          disabled
        >
          <MenuItem value={settings.github.organization}>
            {settings.github.organization}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Repository</InputLabel>
        <Select
          value={settings.github.repository}
          label="Repository"
          disabled
        >
          <MenuItem value={settings.github.repository}>
            {settings.github.repository}
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Branch</InputLabel>
        <Select
          value={settings.github.branch}
          label="Branch"
          disabled
        >
          <MenuItem value={settings.github.branch}>
            {settings.github.branch}
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Access Token"
        type="password"
        value={settings.github.token}
        disabled
      />
    </Box>
  );

  const renderNotificationSettings = () => (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.slack.enabled}
            disabled
          />
        }
        label="Enable Slack Notifications"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Slack Channel"
        value={settings.notifications.slack.channel}
        disabled
      />
      <FormControlLabel
        control={
          <Switch
            checked={settings.notifications.email.enabled}
            disabled
          />
        }
        label="Enable Email Notifications"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email Recipients"
        value={settings.notifications.email.recipients.join(', ')}
        disabled
      />
    </Box>
  );

  const renderSecuritySettings = () => (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={settings.security.backupEnabled}
            disabled
          />
        }
        label="Enable Automated Backups"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Backup Schedule</InputLabel>
        <Select
          value={settings.security.backupSchedule}
          label="Backup Schedule"
          disabled
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderStorageSettings = () => (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Storage Provider</InputLabel>
        <Select
          value={settings.storage.provider}
          label="Storage Provider"
          disabled
        >
          <MenuItem value="s3">Amazon S3</MenuItem>
          <MenuItem value="gcs">Google Cloud Storage</MenuItem>
          <MenuItem value="azure">Azure Blob Storage</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Bucket Name"
        value={settings.storage.bucket}
        disabled
      />
      <TextField
        fullWidth
        margin="normal"
        label="Region"
        value={settings.storage.region}
        disabled
      />
    </Box>
  );

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'github':
        return renderGitHubSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'storage':
        return renderStorageSettings();
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Workflow Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GitHubIcon sx={{ mr: 1 }} />
                <Typography variant="h6">GitHub Integration</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Organization"
                    secondary={settings.github.organization}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Repository"
                    secondary={settings.github.repository}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Branch"
                    secondary={settings.github.branch}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Sync"
                    secondary={settings.github.lastSync}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label="Next: 24h"
                      color="primary"
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<GitHubIcon />}
                onClick={() => handleOpenDialog('github')}
              >
                Configure
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Slack"
                    secondary={settings.notifications.slack.channel}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={settings.notifications.slack.enabled ? 'Enabled' : 'Disabled'}
                      color={settings.notifications.slack.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={settings.notifications.email.recipients.join(', ')}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={settings.notifications.email.enabled ? 'Enabled' : 'Disabled'}
                      color={settings.notifications.email.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<NotificationsIcon />}
                onClick={() => handleOpenDialog('notifications')}
              >
                Configure
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Security</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Automated Backups"
                    secondary={`Schedule: ${settings.security.backupSchedule}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={settings.security.backupEnabled ? 'Enabled' : 'Disabled'}
                      color={settings.security.backupEnabled ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Backup"
                    secondary={settings.security.lastBackup}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label="Next: 24h"
                      color="primary"
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<SecurityIcon />}
                onClick={() => handleOpenDialog('security')}
              >
                Configure
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Storage</Typography>
              </Box>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Provider"
                    secondary={settings.storage.provider.toUpperCase()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Bucket"
                    secondary={settings.storage.bucket}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Cleanup"
                    secondary={settings.storage.lastCleanup}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label="Next: 7d"
                      color="primary"
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button
                startIcon={<StorageIcon />}
                onClick={() => handleOpenDialog('storage')}
              >
                Configure
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'github' && 'GitHub Integration Settings'}
          {dialogType === 'notifications' && 'Notification Settings'}
          {dialogType === 'security' && 'Security Settings'}
          {dialogType === 'storage' && 'Storage Settings'}
        </DialogTitle>
        <DialogContent>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings; 