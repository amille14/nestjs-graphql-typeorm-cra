import { Module } from '@nestjs/common'
import { ConfigModule } from '../../config/config.module'
import { RedisPubSubService } from './redis-pubsub.service'
import { RedisService } from './redis.service'

@Module({
  imports: [ConfigModule],
  providers: [RedisService, RedisPubSubService],
  exports: [RedisService, RedisPubSubService]
})
export class RedisModule {}
