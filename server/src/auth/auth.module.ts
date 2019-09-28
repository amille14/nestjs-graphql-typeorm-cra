import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { IsAuthenticated } from './isAuthenticated.guard'

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_AUTH_SECRET }),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, AuthResolver, IsAuthenticated],
  exports: [AuthService, AuthResolver, IsAuthenticated]
})
export class AuthModule {}
