import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../../config/config.module'
import { ConfigService } from '../../config/config.service'
import { EntityValidatorSubscriber } from '../../entities/shared/subscribers/entity-validator.subscriber'
import { MutationPublisherSubscriber } from '../../entities/shared/subscribers/mutation-publisher.subscriber'
import { RedisModule } from '../redis/redis.module'

@Module({
  imports: [
    // Setup postgres connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return configService.getTypeOrmConfig()
      }
    }),
    RedisModule
  ],
  providers: [EntityValidatorSubscriber, MutationPublisherSubscriber]
})
export class PostgresModule {}
