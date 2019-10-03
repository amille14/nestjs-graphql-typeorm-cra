import * as Redis from 'ioredis'
import { redisConfig } from './redis.config'

export class RedisService extends Redis {
  constructor() {
    super(redisConfig)
  }
}
