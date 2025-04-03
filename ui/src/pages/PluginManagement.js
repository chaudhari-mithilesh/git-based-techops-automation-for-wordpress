import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

function PluginManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [sites] = useState([
    {
      id: 1,
      name: 'Production Site',
      url: 'https://example.com',
      plugins: [
        {
          name: 'WooCommerce',
          currentVersion: '8.5.1',
          latestVersion: '8.6.0',
          status: 'update-available',
          lastUpdate: '2024-03-19 10:00 AM',
          nextUpdate: '2024-03-21 10:00 AM',
        },
        {
          name: 'Yoast SEO',
          currentVersion: '21.7',
          latestVersion: '21.7',
          status: 'up-to-date',
          lastUpdate: '2024-03-20 02:00 PM',
          nextUpdate: '2024-03-22 02:00 PM',
        },
      ],
    },
  ]);

  const [selectedSite, setSelectedSite] = useState('');
  const [updateSchedule, setUpdateSchedule] = useState('daily');
  const [selectedPlugins, setSelectedPlugins] = useState([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSite('');
    setUpdateSchedule('daily');
    setSelectedPlugins([]);
  };

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value);
    setSelectedPlugins([]);
  };

  const handleScheduleChange = (event) => {
    setUpdateSchedule(event.target.value);
  };

  const handlePluginToggle = (pluginName) => {
    setSelectedPlugins((prev) =>
      prev.includes(pluginName)
        ? prev.filter((name) => name !== pluginName)
        : [...prev, pluginName]
    );
  };

  const handleSubmit = () => {
    // TODO: Configure GitHub workflow for plugin updates
    handleCloseDialog();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'update-available':
        return 'warning';
      case 'up-to-date':
        return 'success';
      case 'update-failed':
        return 'error';
      case 'updating':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Plugin Update Workflows</Typography>
        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={handleOpenDialog}
        >
          Configure Update Workflow
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Site</TableCell>
              <TableCell>Plugin</TableCell>
              <TableCell>Current Version</TableCell>
              <TableCell>Latest Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Update</TableCell>
              <TableCell>Next Update</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) =>
              site.plugins.map((plugin) => (
                <TableRow key={`${site.id}-${plugin.name}`}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{plugin.name}</TableCell>
                  <TableCell>{plugin.currentVersion}</TableCell>
                  <TableCell>{plugin.latestVersion}</TableCell>
                  <TableCell>
                    <Chip
                      label={plugin.status}
                      color={getStatusColor(plugin.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{plugin.lastUpdate}</TableCell>
                  <TableCell>{plugin.nextUpdate}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<HistoryIcon />}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      History
                    </Button>
                    <Button
                      startIcon={<SettingsIcon />}
                      size="small"
                    >
                      Settings
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Plugin Update Workflow</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Site</InputLabel>
            <Select
              value={selectedSite}
              label="Select Site"
              onChange={handleSiteChange}
            >
              {sites.map((site) => (
                <MenuItem key={site.id} value={site.id}>
                  {site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Update Schedule</InputLabel>
            <Select
              value={updateSchedule}
              label="Update Schedule"
              onChange={handleScheduleChange}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Select Plugins to Update
          </Typography>
          <List>
            {selectedSite &&
              sites
                .find((site) => site.id === selectedSite)
                ?.plugins.map((plugin) => (
                  <React.Fragment key={plugin.name}>
                    <ListItem>
                      <ListItemText
                        primary={plugin.name}
                        secondary={`Current: ${plugin.currentVersion} | Latest: ${plugin.latestVersion}`}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={selectedPlugins.includes(plugin.name)}
                          onChange={() => handlePluginToggle(plugin.name)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!selectedSite || selectedPlugins.length === 0}
          >
            Configure Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PluginManagement; 