import { Module } from '@nestjs/common'
import { forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../../auth/auth.module'
import { RedisModule } from '../../db/redis/redis.module'
import { IsUnique } from '../shared/validators/is-unique.validator'
import { User } from './user.entity'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { UserSubscriber } from './user.subscriber'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    RedisModule
  ],
  providers: [IsUnique, UserService, UserResolver, UserSubscriber],
  exports: [UserService, UserResolver]
})
export class UserModule {}
