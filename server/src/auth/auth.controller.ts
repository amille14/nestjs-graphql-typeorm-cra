import {
  Controller,
  Post,
  Req,
  Res
  } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AuthService.REFRESH_COOKIE_PATH)
  async refreshAccess(@Req() req: Request, @Res() res: Response) {
    // Validate refresh token
    const refreshToken = this.authService.getRefreshCookie(req)
    const user = await this.authService.validateRefreshToken(refreshToken)

    // Create new access token
    const accessToken = this.authService.generateAccessToken(user)

    // Create new refresh token and set cookie
    const newRefreshToken = this.authService.generateRefreshToken(user)
    this.authService.setRefreshCookie(newRefreshToken, res)
    return res.send({ ok: true, accessToken })
  }
}
