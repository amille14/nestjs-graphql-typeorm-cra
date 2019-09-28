import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { GqlContext } from '../types/gqlContext.type'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

const SALT_ROUNDS = 12
const ACCESS_TOKEN_EXPIRATION_TIME = '15m' // 15 minutes
const REFRESH_TOKEN_EXPIRATION_TIME = '30d' // 30 days
const REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days
const REFRESH_COOKIE_NAME = 'rid'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwtService: JwtService
  ) {}

  // EMAIL + PASSWORD
  // ================

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = this.users.repo.create({
      email: email.toLowerCase(),
      password: hashedPassword
    })
    return this.users.repo.save(user)
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.users.repo.findOne({ email })
    if (!user) throw new UnauthorizedException('INCORRECT_EMAIL_OR_PASSWORD')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('INCORRECT_EMAIL_OR_PASSWORD')
    }
    return user
  }

  // ACCESS TOKEN
  // ============

  generateAccessToken(user: User) {
    const payload = { userId: user.id }
    return this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRATION_TIME
    })
  }

  validateAccessToken(token: string) {
    try {
      const data = this.jwtService.verify(token)
      if (!data.userId) throw new UnauthorizedException('INVALID_ACCESS_TOKEN')
      return data
    } catch (err) {
      throw new UnauthorizedException('INVALID_ACCESS_TOKEN')
    }
  }

  getAccessTokenFromContext({ req, conn }: GqlContext) {
    if (conn) return conn.accessToken || ''
    const authHeader = req.headers.authorization || req.headers.Authorization
    return authHeader && typeof authHeader === 'string'
      ? authHeader.replace('Bearer ', '')
      : ''
  }

  getUserFromToken(accessToken: string) {
    try {
      const { userId } = this.jwtService.verify(accessToken)
      return { id: userId }
    } catch (err) {
      return null
    }
  }

  // REFRESH TOKEN
  // =============

  generateRefreshToken(user: User) {
    const payload = { userId: user.id, tokenVersion: user.tokenVersion }
    return this.jwtService.sign(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRATION_TIME
    })
  }

  async validateRefreshToken(token: string) {
    const data = this.jwtService.verify(token)
    if (!data) throw new UnauthorizedException('INVALID_REFRESH_TOKEN')

    const { userId, tokenVersion } = data
    const user = await this.users.repo.findOneOrFail({ id: userId })
    if (!user || tokenVersion !== user.tokenVersion) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN')
    }

    return user
  }

  invalidateRefreshTokensForUser(user: User) {
    return this.users.repo.increment(user, 'tokenVersion', 1)
  }

  getRefreshCookie(req: Request) {
    return req.cookies[REFRESH_COOKIE_NAME]
  }

  setRefreshCookie(token, res: Response) {
    return res.cookie(REFRESH_COOKIE_NAME, token, {
      maxAge: REFRESH_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' // Require HTTPS only in production
    })
  }

  clearRefreshCookie(res: Response) {
    return res.clearCookie(REFRESH_COOKIE_NAME)
  }
}
