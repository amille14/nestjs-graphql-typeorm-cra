import { Injectable } from '@nestjs/common'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import * as Redis from 'ioredis'
import { redisConfig } from './redis.config'

@Injectable()
export class RedisPubSubService extends RedisPubSub {
  constructor() {
    super({
      publisher: new Redis(redisConfig),
      subscriber: new Redis(redisConfig)
    })
  }
}
