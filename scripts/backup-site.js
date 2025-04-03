const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  siteUrl: process.env.SITE_URL,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  backupDir: path.join(__dirname, '../backups'),
  retentionDays: 7
};

// Ensure backup directory exists
if (!fs.existsSync(config.backupDir)) {
  fs.mkdirSync(config.backupDir, { recursive: true });
}

// Helper function to execute WP-CLI commands
function wp(command, options = {}) {
  const { url } = options;
  const baseCommand = `wp ${command}`;
  const fullCommand = url ? `${baseCommand} --url=${url}` : baseCommand;
  
  try {
    return execSync(fullCommand, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Error executing WP-CLI command: ${fullCommand}`);
    console.error(error.message);
    throw error;
  }
}

// Helper function to clean old backups
function cleanOldBackups() {
  const files = fs.readdirSync(config.backupDir);
  const now = Date.now();
  
  files.forEach(file => {
    const filePath = path.join(config.backupDir, file);
    const stats = fs.statSync(filePath);
    const daysOld = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysOld > config.retentionDays) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old backup: ${file}`);
    }
  });
}

// Main backup function
async function backupSite() {
  console.log('Starting WordPress site backup process...');
  
  // Create timestamp for backup files
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // 1. Export database
  console.log('Exporting database...');
  const dbBackupFile = path.join(config.backupDir, `db_backup_${timestamp}.sql`);
  wp(`db export ${dbBackupFile}`, { url: config.siteUrl });
  
  // 2. Export files
  console.log('Exporting files...');
  const filesBackupDir = path.join(config.backupDir, `files_backup_${timestamp}`);
  wp('export --all', { url: config.siteUrl });
  
  // 3. Create backup manifest
  console.log('Creating backup manifest...');
  const manifest = {
    timestamp: new Date().toISOString(),
    siteUrl: config.siteUrl,
    files: {
      database: dbBackupFile,
      content: filesBackupDir
    },
    version: wp('core version', { url: config.siteUrl }).trim()
  };
  
  fs.writeFileSync(
    path.join(config.backupDir, `manifest_${timestamp}.json`),
    JSON.stringify(manifest, null, 2)
  );
  
  // 4. Clean old backups
  console.log('Cleaning old backups...');
  cleanOldBackups();
  
  console.log('WordPress site backup completed successfully!');
}

// Execute the backup process
backupSite().catch(error => {
  console.error('Error during site backup:', error);
  process.exit(1);
}); 