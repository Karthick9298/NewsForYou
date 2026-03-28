import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import { BrevoClient } from '@getbrevo/brevo';

const connection = redis;

let brevo;
function getBrevo() {
  if (!brevo) {
    brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  }
  return brevo;
}

function buildOTPEmailHTML(otp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f0f; color: #e5e7eb; margin: 0; padding: 0; }
    .wrapper { max-width: 480px; margin: 40px auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #2a2a2a; }
    .header { background: linear-gradient(135deg, #1a1a1a, #2a2a2a); padding: 32px 40px; border-bottom: 2px solid #F59E0B; }
    .logo { font-size: 22px; font-weight: 700; color: #F59E0B; letter-spacing: 0.5px; }
    .body { padding: 36px 40px; }
    h2 { margin: 0 0 12px; font-size: 20px; color: #f9fafb; }
    p { color: #9ca3af; line-height: 1.6; margin: 0 0 24px; }
    .otp-box { background: #0f0f0f; border: 1px solid #F59E0B; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 10px; color: #F59E0B; font-family: monospace; }
    .note { font-size: 13px; color: #6b7280; }
    .footer { padding: 20px 40px; border-top: 1px solid #2a2a2a; background: #111; text-align: center; font-size: 12px; color: #4b5563; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><span class="logo">NewsForYou</span></div>
    <div class="body">
      <h2>Your One-Time Password</h2>
      <p>Use the OTP below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p class="note">If you didn&apos;t request this, you can safely ignore this email. Do not share this code with anyone.</p>
    </div>
    <div class="footer">&copy; 2026 NewsForYou &mdash; Personalized news, delivered.</div>
  </div>
</body>
</html>`;
}

const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'send-otp') {
      const { email, otp } = job.data;

      await getBrevo().transactionalEmails.sendTransacEmail({
        subject: `${otp} is your NewsForYou verification code`,
        htmlContent: buildOTPEmailHTML(otp),
        sender: {
          name: process.env.BREVO_SENDER_NAME || 'NewsForYou',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
      });

      console.log(`[EmailWorker] OTP email sent to ${email}`);
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`[EmailWorker] Job ${job.id} (${job.name}) completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[EmailWorker] Job ${job?.id} failed:`, err.message);
  if (err.cause) console.error('[EmailWorker] Cause:', err.cause);
});

export { worker };
