/**
 * newsCron.js
 *
 * Schedules the NewsAPI article fetch pipeline to run every day at 7:00 AM
 * server local time.  Import this file once in server.js to activate the job.
 *
 * Cron expression: '30 23 * * *'
 *   ┌──────── minute  (0)
 *   │ ┌────── hour    (7)
 *   │ │ ┌──── day of month (*)
 *   │ │ │ ┌── month (*)
 *   │ │ │ │ ┌ day of week (*)
 *   0 7 * * *
 */

import cron from 'node-cron';
import { fetchAndStoreAllArticles } from '../services/newsFetcher.service.js';

// Schedule: every day at 07:00 AM & 12:00 pm

export function startNewsCron() {
  const runJob = async () => {
    console.log(`[NewsCron] 🗞 Fetch triggered at ${new Date().toISOString()}`);

    try {
      const summary = await fetchAndStoreAllArticles();
      console.log('[NewsCron] Fetch complete:', JSON.stringify(summary));
    } catch (err) {
      console.error('[NewsCron] Fetch failed:', err.message);
    }
  };

  // 6:00 AM IST
  cron.schedule('0 6 * * *', runJob, {
    timezone: 'Asia/Kolkata',
  });

  // 12:00 PM IST (Noon)
  cron.schedule('0 12 * * *', runJob, {
    timezone: 'Asia/Kolkata',
  });

  console.log('📰 News cron jobs scheduled — 06:00 AM IST and 12:00 PM IST');
}
