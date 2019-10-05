import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { UserModule } from '../entities/user/user.module'
import { AuthController } from './auth.controller'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
  imports: [forwardRef(() => UserModule), ConfigModule],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService, AuthResolver]
})
export class AuthModule {}
