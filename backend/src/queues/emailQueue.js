import { Queue } from 'bullmq';
import redis from '../config/redis.js';

const connection = redis;

const emailQueue = new Queue('email', { connection });

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
