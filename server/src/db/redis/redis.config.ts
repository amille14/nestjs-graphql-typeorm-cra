import { RedisOptions } from 'ioredis'

export const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  showFriendlyErrorStack: true,
  retryStrategy: (attempt: number) => Math.max(attempt * 100, 3000)
}
