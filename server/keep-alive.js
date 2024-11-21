import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(dirname(__dirname), '.env') });

const RENDER_URL = process.env.BACKEND_URL || 'https://personal-blogging-website.onrender.com';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (just under Render's 15-minute limit)

async function pingServer() {
  try {
    const response = await fetch(`${RENDER_URL}/api/health`);
    const data = await response.json();
    console.log(`Server pinged successfully at ${new Date().toISOString()}:`, data);
  } catch (error) {
    console.error(`Failed to ping server at ${new Date().toISOString()}:`, error.message);
  }
}

// Initial ping
pingServer();

// Schedule regular pings
setInterval(pingServer, PING_INTERVAL);

console.log(`Keep-alive script started. Pinging ${RENDER_URL} every ${PING_INTERVAL / 1000 / 60} minutes.`);
