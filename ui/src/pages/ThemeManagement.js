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
  Palette as ThemeIcon,
} from '@mui/icons-material';

function ThemeManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [sites] = useState([
    {
      id: 1,
      name: 'Production Site',
      url: 'https://example.com',
      themes: [
        {
          name: 'Astra',
          currentVersion: '4.6.1',
          latestVersion: '4.7.0',
          status: 'update-available',
          lastUpdate: '2024-03-19 10:00 AM',
          nextUpdate: '2024-03-21 10:00 AM',
          isActive: true,
        },
        {
          name: 'Twenty Twenty-Four',
          currentVersion: '1.1',
          latestVersion: '1.1',
          status: 'up-to-date',
          lastUpdate: '2024-03-20 02:00 PM',
          nextUpdate: '2024-03-22 02:00 PM',
          isActive: false,
        },
      ],
    },
  ]);

  const [selectedSite, setSelectedSite] = useState('');
  const [updateSchedule, setUpdateSchedule] = useState('daily');
  const [selectedThemes, setSelectedThemes] = useState([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSite('');
    setUpdateSchedule('daily');
    setSelectedThemes([]);
  };

  const handleSiteChange = (event) => {
    setSelectedSite(event.target.value);
    setSelectedThemes([]);
  };

  const handleScheduleChange = (event) => {
    setUpdateSchedule(event.target.value);
  };

  const handleThemeToggle = (themeName) => {
    setSelectedThemes((prev) =>
      prev.includes(themeName)
        ? prev.filter((name) => name !== themeName)
        : [...prev, themeName]
    );
  };

  const handleSubmit = () => {
    // TODO: Configure GitHub workflow for theme updates
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
        <Typography variant="h4">Theme Update Workflows</Typography>
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
              <TableCell>Theme</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Version</TableCell>
              <TableCell>Latest Version</TableCell>
              <TableCell>Last Update</TableCell>
              <TableCell>Next Update</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sites.map((site) =>
              site.themes.map((theme) => (
                <TableRow key={`${site.id}-${theme.name}`}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThemeIcon sx={{ mr: 1 }} />
                      {theme.name}
                      {theme.isActive && (
                        <Chip
                          label="Active"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={theme.status}
                      color={getStatusColor(theme.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{theme.currentVersion}</TableCell>
                  <TableCell>{theme.latestVersion}</TableCell>
                  <TableCell>{theme.lastUpdate}</TableCell>
                  <TableCell>{theme.nextUpdate}</TableCell>
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
        <DialogTitle>Configure Theme Update Workflow</DialogTitle>
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
            Select Themes to Update
          </Typography>
          <List>
            {selectedSite &&
              sites
                .find((site) => site.id === selectedSite)
                ?.themes.map((theme) => (
                  <React.Fragment key={theme.name}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ThemeIcon sx={{ mr: 1 }} />
                            {theme.name}
                            {theme.isActive && (
                              <Chip
                                label="Active"
                                size="small"
                                color="primary"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={`Current: ${theme.currentVersion} | Latest: ${theme.latestVersion}`}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          edge="end"
                          checked={selectedThemes.includes(theme.name)}
                          onChange={() => handleThemeToggle(theme.name)}
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
            disabled={!selectedSite || selectedThemes.length === 0}
          >
            Configure Workflow
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ThemeManagement; 