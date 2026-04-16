import { Worker } from 'bullmq';
import { createRedisConnection } from '../config/redis.js';
import { BrevoClient } from '@getbrevo/brevo';

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

/* ─── Reminder email ────────────────────────────────────────────────────────── */

function buildReminderEmailHTML(greeting) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Your News is Waiting — NewsForYou</title>
</head>
<body style="margin:0;padding:0;background:#060608;font-family:'Segoe UI',Arial,sans-serif;color:#e5e7eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060608;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#0c0c10;border-radius:16px;overflow:hidden;border:1px solid #1a1a2a;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f0f14,#18181f);padding:28px 32px;border-bottom:2px solid #F59E0B;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:26px;font-weight:800;color:#F59E0B;letter-spacing:0.3px;">NewsForYou</span>
                    <div style="font-size:12px;color:#6b7280;margin-top:3px;">Your daily news reminder</div>
                  </td>
                  <td align="right" style="font-size:12px;color:#4b5563;vertical-align:bottom;">${today}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px 32px;text-align:center;">
              <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#f9fafb;">${greeting}! 👋</h1>
              <p style="margin:0 0 28px;font-size:15px;color:#9ca3af;line-height:1.65;">
                Fresh news stories are waiting for you.<br/>
                Catch up on today's top headlines across tech, sports, business, and more.
              </p>
              <a href="${frontendUrl}"
                 style="display:inline-block;background:#F59E0B;color:#0f0f0f;font-size:15px;font-weight:700;
                        text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.3px;">
                Read Today's News →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#07070b;border-top:1px solid #1a1a2a;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 5px;font-size:12px;color:#4b5563;line-height:1.7;">
                &copy; 2026 NewsForYou &mdash; Personalised news, delivered daily.
              </p>
              <p style="margin:0;font-size:11px;color:#374151;">
                You're receiving this because you opted in to daily digest emails during registration.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Worker gets its own dedicated connection — separate from the Queue connection.
const worker = new Worker(
  'email',
  async (job) => {
    if (job.name === 'send-otp') {
      const { email, otp } = job.data;

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[EmailWorker] Dev mode — OTP for ${email}: ${otp}`);
        return;
      }

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

    if (job.name === 'send-digest') {
      const { email, timePref } = job.data;

      const greeting = timePref === 'morning' ? 'Good morning' : 'Good evening';
      const subject  = timePref === 'morning'
        ? '☀️ Good morning! Your news is waiting'
        : '🌙 Good evening! Your news is waiting';

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[EmailWorker] Dev mode — reminder email for ${email} (${timePref})`);
        return;
      }

      await getBrevo().transactionalEmails.sendTransacEmail({
        subject,
        htmlContent: buildReminderEmailHTML(greeting),
        sender: {
          name: process.env.BREVO_SENDER_NAME || 'NewsForYou',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
      });

      console.log(`[EmailWorker] Reminder email sent to ${email}`);
    }
  },
  { connection: createRedisConnection() }
);

worker.on('completed', (job) => {
  console.log(`[EmailWorker] Job ${job.id} (${job.name}) completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[EmailWorker] Job ${job?.id} failed:`, err.message);
  if (err.cause) console.error('[EmailWorker] Cause:', err.cause);
});

worker.on('error', (err) => {
  console.error('[EmailWorker] Worker error:', err);
});

export { worker };
