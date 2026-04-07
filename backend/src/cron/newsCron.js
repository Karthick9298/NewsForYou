/**
 * newsCron.js
 *
 * Schedules the NewsAPI article fetch pipeline to run every day at 7:00 AM
 * server local time.  Import this file once in server.js to activate the job.
 *
 * Cron expression: '0 7 * * *'
 *   ┌──────── minute  (0)
 *   │ ┌────── hour    (7)
 *   │ │ ┌──── day of month (*)
 *   │ │ │ ┌── month (*)
 *   │ │ │ │ ┌ day of week (*)
 *   0 7 * * *
 */

import cron from 'node-cron';
import { fetchAndStoreAllArticles } from '../services/newsFetcher.service.js';

// Schedule: every day at 07:00 AM
// const CRON_EXPRESSION = '0 8 * * *';

const CRON_EXPRESSION = '0 5 * * *';

export function startNewsCron() {
  if (!cron.validate(CRON_EXPRESSION)) {
    console.error('[NewsCron] Invalid cron expression — job NOT scheduled.');
    return;
  }

  cron.schedule(CRON_EXPRESSION, async () => {
    console.log(`[NewsCron] 🗞  Daily fetch triggered at ${new Date().toISOString()}`);
    try {
      const summary = await fetchAndStoreAllArticles();
      console.log('[NewsCron] Daily fetch complete:', JSON.stringify(summary));
    } catch (err) {
      console.error('[NewsCron] Daily fetch failed:', err.message);
    }
  });

  console.log(`📰  News cron job scheduled — runs daily at 05:00 AM (${CRON_EXPRESSION})`);
}
