import IORedis from 'ioredis';

const redis = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password:process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => console.error('[Redis] Connection error:', err.message));

export default redis;
