import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import { startNewsCron } from './src/cron/newsCron.js';
import { startDigestCron } from './src/cron/digestCron.js';
import { startKeepAliveCron } from './src/cron/keepAliveCron.js';



// ── Process-level crash guards ─────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException] Unhandled exception — shutting down:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection] Unhandled promise rejection:', reason);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  // Start the daily 7 AM news fetch cron job
  startNewsCron();

  // Start the morning (06:05 AM) and night (09:00 PM) digest email cron jobs
  startDigestCron();

  // Ping own /api/health every 10 min to prevent Render free tier sleep
  startKeepAliveCron();

  app.listen(PORT, () => {
    console.log(`\n🚀  NewsForYou API running on http://localhost:${PORT}`);
    console.log(`📧  Email worker (BullMQ) is active`);
    console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
