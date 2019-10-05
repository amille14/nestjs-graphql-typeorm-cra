import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntityValidatorSubscriber } from '../../entities/shared/subscribers/entity-validator.subscriber'
import { MutationPublisherSubscriber } from '../../entities/shared/subscribers/mutation-publisher.subscriber'
import { RedisModule } from './../redis/redis.module'

@Module({
  imports: [
    // Setup postgres connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['./src/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true
    }),
    RedisModule
  ],
  providers: [EntityValidatorSubscriber, MutationPublisherSubscriber]
})
export class PostgresModule {}
