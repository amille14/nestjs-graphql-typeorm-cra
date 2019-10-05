import { Injectable } from '@nestjs/common'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import * as Redis from 'ioredis'
import { ConfigService } from './../../config/config.service'

@Injectable()
export class RedisPubSubService extends RedisPubSub {
  constructor(private readonly configService: ConfigService) {
    super({
      publisher: new Redis(configService.getRedisConfig()),
      subscriber: new Redis(configService.getRedisConfig())
    })
  }
}
