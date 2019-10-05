import { Injectable } from '@nestjs/common'
import * as Redis from 'ioredis'
import { ConfigService } from './../../config/config.service'

@Injectable()
export class RedisService extends Redis {
  constructor(private readonly configService: ConfigService) {
    super(configService.getRedisConfig())
  }
}
