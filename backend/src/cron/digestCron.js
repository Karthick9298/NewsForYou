/**
 * digestCron.js
 *
 * Sends a static reminder email to every registered user based on their
 * preferred delivery time:
 *   • 06:05 AM  →  notificationTime: 'morning'
 *   • 09:00 PM  →  notificationTime: 'night'
 */

import cron from 'node-cron';
import User from '../models/User.js';
import { addDigestEmailJob } from '../queues/emailQueue.js';


/**
 * Queue a reminder email for every registered user with a given notificationTime.
 *
 * @param {'morning' | 'night'} timePref
 */
async function sendReminderToUsers(timePref) {
  console.log(`[DigestCron] ▶ ${timePref} reminder triggered at ${new Date().toISOString()}`);

  const users = await User
    .find({ isRegistered: true, notificationTime: timePref }, 'email')
    .lean();

  console.log(`[DigestCron] Queueing reminder for ${users.length} ${timePref} user(s)`);

  for (const user of users) {
    await addDigestEmailJob(user.email, timePref);
  }

  console.log(`[DigestCron] ${timePref} reminder queued for ${users.length} user(s)`);
}


/* ── Schedule two cron jobs ─────────────────────────────────────────────────── */
export function startDigestCron() {
  // Morning — 06:05 AM
  cron.schedule('5 6 * * *', () => {
    sendReminderToUsers('morning').catch((err) =>
      console.error('[DigestCron] Morning job error:', err.message)
    );
  });

  // Night — 09:00 PM
  cron.schedule('0 21 * * *', () => {
    sendReminderToUsers('night').catch((err) =>
      console.error('[DigestCron] Night job error:', err.message)
    );
  });

  console.log('📬  Digest cron jobs scheduled — morning at 06:05 AM, night at 09:00 PM');
}

