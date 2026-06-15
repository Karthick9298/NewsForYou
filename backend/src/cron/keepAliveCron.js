/**
 * keepAliveCron.js
 *
 * Pings the backend's own /api/health endpoint every 10 minutes to prevent
 * Render's free tier from spinning the service down due to inactivity.
 *
 * The backend URL is read from the BACKEND_URL environment variable.
 * Set it in your .env / Render environment variables:
 *   BACKEND_URL=https://your-app.onrender.com
 *
 * Cron expression: '* /10 * * * *'  (every 10 minutes)
 */

import cron from 'node-cron';

export function startKeepAliveCron() {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    console.warn('[KeepAlive] ⚠️  BACKEND_URL is not set — keep-alive ping disabled.');
    return;
  }

  const pingUrl = `${backendUrl}/api/health`;

  cron.schedule('*/10 * * * *', async () => {
    try {
      const res = await fetch(pingUrl);
      console.log(`[KeepAlive] ✅ Pinged ${pingUrl} → ${res.status}`);
    } catch (err) {
      console.error(`[KeepAlive] ❌ Ping failed: ${err.message}`);
    }
  });

  console.log(`🏓 Keep-alive cron active — pinging ${pingUrl} every 10 minutes`);
}
