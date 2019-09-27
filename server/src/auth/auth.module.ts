import { JwtStrategy } from './jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { Module, forwardRef } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserModule } from './../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' }
    }),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
