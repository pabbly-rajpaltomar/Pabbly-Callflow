// Simple script to start backend
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting CallFlow Backend Server...');
console.log('Location:', __dirname);

// Start the backend server
const backend = spawn('node', ['src/server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => {
  console.error('Failed to start backend:', err);
  process.exit(1);
});

backend.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
  process.exit(code);
});

console.log('Backend server starting...');
console.log('Press Ctrl+C to stop');
