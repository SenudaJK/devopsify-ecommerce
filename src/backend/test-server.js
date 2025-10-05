const { spawn } = require('child_process');
const path = require('path');

console.log('Starting backend server test...');

const serverPath = path.join(__dirname, 'dist', 'server.js');
console.log('Server path:', serverPath);

const server = spawn('node', [serverPath], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'pipe']
});

server.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString());
});

server.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Server process error:', error);
});

// Kill server after 10 seconds for testing
setTimeout(() => {
  console.log('Killing server for test...');
  server.kill();
}, 10000);
