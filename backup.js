const fs = require('fs');
const path = require('path');

// -------------------------
// Configuration
// -------------------------
const dbPath = path.join(__dirname, 'prisma', 'dev.db'); // Path to your SQLite DB
const backupDir = path.join(__dirname, 'backups');       // Backup folder
const maxBackups = 10;                                   // Number of backups to keep

// -------------------------
// Ensure backup folder exists
// -------------------------
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// -------------------------
// Create timestamped backup
// -------------------------
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `dev-${timestamp}.db`);
fs.copyFileSync(dbPath, backupPath);
console.log(`Backup created: ${backupPath}`);

// -------------------------
// Clean up old backups
// -------------------------
const backups = fs.readdirSync(backupDir)
  .filter(file => file.endsWith('.db'))
  .map(file => ({
    name: file,
    time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
  }))
  .sort((a, b) => b.time - a.time); // Newest first

if (backups.length > maxBackups) {
  const oldBackups = backups.slice(maxBackups);
  oldBackups.forEach(backup => {
    const filePath = path.join(backupDir, backup.name);
    fs.unlinkSync(filePath);
    console.log(`Old backup deleted: ${filePath}`);
  });
}
