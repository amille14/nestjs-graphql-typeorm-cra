import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../../config/config.module'
import { ConfigService } from '../../config/config.service'
import { EntityValidatorSubscriber } from '../../entities/shared/subscribers/entity-validator.subscriber'
import { MutationPublisherSubscriber } from '../../entities/shared/subscribers/mutation-publisher.subscriber'
import { RedisModule } from './../redis/redis.module'

@Module({
  imports: [
    // Setup postgres connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.getSchemaConfig('typeOrm')
        return {
          type: config.DATABASE_TYPE,
          host: config.DATABASE_HOST,
          port: config.DATABASE_PORT,
          database: config.DATABASE_NAME,
          username: config.DATABASE_USERNAME,
          password: config.DATABASE_PASSWORD,
          entities: ['./src/**/*.entity{.ts,.js}'],
          logging: true,
          synchronize: configService.isDev()
        } as any
      }
    }),
    RedisModule
  ],
  providers: [EntityValidatorSubscriber, MutationPublisherSubscriber]
})
export class PostgresModule {}
