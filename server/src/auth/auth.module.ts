import { forwardRef, Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService, AuthResolver]
})
export class AuthModule {}
