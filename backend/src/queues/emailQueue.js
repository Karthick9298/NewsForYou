import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis.js';

// Queue gets its own dedicated connection — must not be shared with the Worker.
const emailQueue = new Queue('email', { connection: createRedisConnection() });

emailQueue.on('error', (err) => {
  console.error('[EmailQueue] Queue error:', err);
});

/**
 * Add an OTP email job to the queue.
 * @param {string} email  - Recipient email
 * @param {string} otp    - Plain-text OTP (sent inside email body)
 */
async function addOTPEmailJob(email, otp) {
  await emailQueue.add(
    'send-otp',
    { email, otp },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: 50,
    }
  );
}

export { emailQueue, addOTPEmailJob };
