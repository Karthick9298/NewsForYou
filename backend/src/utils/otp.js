import crypto from 'crypto';
import redis from '../config/redis.js';

const OTP_TTL_SECONDS = 10 * 60; // 10 minutes
const OTP_KEY_PREFIX  = 'otp:';

/**
 * Generates a 6-digit numeric OTP string.
 */
function generateOTP() {
  const buffer = crypto.randomBytes(3);
  const num = buffer.readUIntBE(0, 3) % 1000000;
  return String(num).padStart(6, '0');
}

/** SHA-256 hash of the OTP */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/** Compares a plain OTP against a stored hash (timing-safe) */
function verifyOTP(plain, hash) {
  const a = Buffer.from(hashOTP(plain));
  const b = Buffer.from(hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Store hashed OTP in Redis with TTL */
async function storeOTP(email, otp) {
  const key = OTP_KEY_PREFIX + email.toLowerCase();
  await redis.set(key, hashOTP(otp), 'EX', OTP_TTL_SECONDS);
}

/** Retrieve stored OTP hash from Redis. Returns null if missing/expired. */
async function getStoredOTPHash(email) {
  return redis.get(OTP_KEY_PREFIX + email.toLowerCase());
}

/** Delete OTP from Redis (invalidate after use) */
async function deleteOTP(email) {
  return redis.del(OTP_KEY_PREFIX + email.toLowerCase());
}

export { generateOTP, hashOTP, verifyOTP, storeOTP, getStoredOTPHash, deleteOTP };
