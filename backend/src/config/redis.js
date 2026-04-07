import IORedis from 'ioredis';

// Shared config — single source of truth for all Redis connections.
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  // Required by BullMQ: each blocking connection must have this set to null.
  maxRetriesPerRequest: null,
};

/**
 * Creates a fresh IORedis connection using the shared config.
 * BullMQ Queue and Worker MUST each have their own dedicated connection —
 * sharing one causes BLPOP timeouts and dropped jobs.
 * Call this once per Queue/Worker instantiation.
 */
export function createRedisConnection() {
  const conn = new IORedis(redisConfig);
  conn.on('error', (err) => console.error('[Redis] Connection error:', err.message));
  return conn;
}

// Default connection — used for everything outside BullMQ (OTP storage, etc.).
const redis = createRedisConnection();
export default redis;
