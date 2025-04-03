const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  sourceUrl: process.env.SOURCE_URL,
  targetRepo: process.env.TARGET_REPO,
  targetBranch: process.env.TARGET_BRANCH,
  backupDir: path.join(__dirname, '../backups'),
  tempDir: path.join(__dirname, '../temp')
};

// Ensure directories exist
[config.backupDir, config.tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

// Main cloning function
async function cloneSite() {
  console.log('Starting WordPress site cloning process...');
  
  // 1. Export source database
  console.log('Exporting source database...');
  const dbBackupFile = path.join(config.backupDir, `db_backup_${Date.now()}.sql`);
  wp(`db export ${dbBackupFile}`, { url: config.sourceUrl });

  // 2. Export source files
  console.log('Exporting source files...');
  const filesBackupDir = path.join(config.backupDir, `files_backup_${Date.now()}`);
  wp('export --all', { url: config.sourceUrl });
  
  // 3. Create manifest file
  console.log('Creating manifest...');
  const manifest = {
    sourceUrl: config.sourceUrl,
    targetRepo: config.targetRepo,
    targetBranch: config.targetBranch,
    timestamp: new Date().toISOString(),
    files: {
      database: dbBackupFile,
      content: filesBackupDir
    }
  };
  
  fs.writeFileSync(
    path.join(config.backupDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('WordPress site cloning completed successfully!');
  console.log('Files are ready to be pushed to the WordPress Site Repository.');
}

// Execute the cloning process
cloneSite().catch(error => {
  console.error('Error during site cloning:', error);
  process.exit(1);
}); 