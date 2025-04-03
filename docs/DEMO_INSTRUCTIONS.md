# Demo Instructions for WordPress Site Management

## Prerequisites
- WordPress site running on `http://localhost:8081`
- React frontend running on `http://localhost:3000`
- Backend API running on `http://localhost:3001`

## Starting the Application

1. **Start WordPress Site**
   ```bash
   cd /home/mithilesh/TECHOPS-GIT-AUTOMATION/wordpress-sites/demo-wordpress-site-for-techops
   docker-compose up -d
   ```

2. **Start Backend API**
   ```bash
   cd /home/mithilesh/TECHOPS-GIT-AUTOMATION/git-based-techops-automation-for-wordpress
   npm install
   npm start
   ```

3. **Start React Frontend**
   ```bash
   cd /home/mithilesh/TECHOPS-GIT-AUTOMATION/git-based-techops-automation-for-wordpress/ui
   npm install
   npm start
   ```

## Demo Flow

### 1. View Sites
- Open browser and navigate to `http://localhost:3000`
- You'll see a demo site listed with:
  - Name: "Demo Site"
  - URL: "http://localhost:8081"
  - Status: "active"
  - Clone Status: "not_cloned"

### 2. Configure Site Cloning
1. Click "Configure Clone Workflow" button
2. In the dialog:
   - Enter Source Site URL: `http://localhost:8081`
   - Enter Target Repository: `your-target-repo`
   - Enter Target Branch: `main`
3. Click "Configure Workflow"
4. Wait for success message

### 3. Update Plugins
1. Click "Update Plugins" button next to demo site
2. Observe loading state
3. Wait for success message (2-second simulation)
4. Check updated last update time

### 4. Update Themes
1. Click "Update Themes" button next to demo site
2. Observe loading state
3. Wait for success message (2-second simulation)
4. Check updated last update time

## Status Indicators
- Green: active, success
- Red: inactive, error
- Blue: running, scheduled
- Gray: default state

## Error Handling
- Failed operations show error message in red snackbar
- Messages auto-dismiss after 6 seconds

## Loading States
During operations, you'll see:
- Loading spinner
- Disabled buttons
- Loading indicators in UI

## Notes
- Demo runs in simulated mode
- 2-second delay for all operations
- No actual changes to WordPress site
- Data resets on page refresh

## Directory Structure
```
/home/mithilesh/TECHOPS-GIT-AUTOMATION/
├── git-based-techops-automation-for-wordpress/  # Main application
│   ├── ui/                                     # React frontend
│   ├── src/                                    # Backend source
│   └── docs/                                   # Documentation
└── wordpress-sites/                            # WordPress sites
    └── demo-wordpress-site-for-techops/        # Demo WordPress site
``` 