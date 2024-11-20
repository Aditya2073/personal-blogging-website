import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const startServer = () => {
  const server = spawn('node', ['index.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

  server.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(`Server process exited with code ${code}`);
      process.exit(1);
    }
  });

  process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
};

startServer();
