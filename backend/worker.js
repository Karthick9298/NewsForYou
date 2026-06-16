
import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import './src/queues/emailWorker.js';  

process.on('uncaughtException', (err) => {
  console.error('[Worker] Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Worker] Unhandled rejection:', reason);
  process.exit(1);
});

async function startWorker() {
  await connectDB();   // worker needs DB if it queries users, etc.
  console.log('⚙️  Email worker process started');
}

startWorker().catch((err) => {
  console.error('Worker failed to start:', err);
  process.exit(1);
});
