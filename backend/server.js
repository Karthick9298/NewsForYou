import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';

// Start the BullMQ email worker (runs in same process, non-blocking)
import './src/queues/emailWorker.js';

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
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
