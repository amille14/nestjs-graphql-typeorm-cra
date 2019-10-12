import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { CookieOptions, Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { GqlContext } from '../api/types/gql-context.type'
import { ConfigService } from '../config/config.service'
import { User } from '../entities/user/user.entity'
import { UserService } from '../entities/user/user.service'

@Injectable()
export class AuthService {
  static ACCESS_TOKEN_EXPIRATION_TIME = '5s' // 15 minutes
  static REFRESH_TOKEN_EXPIRATION_TIME = '14d' // 14 days
  static REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 14 // 14 days
  static REFRESH_COOKIE_NAME = 'rid'
  static REFRESH_COOKIE_PATH = '/refresh_access'
  private readonly REFRESH_COOKIE_OPTIONS: CookieOptions

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    this.REFRESH_COOKIE_OPTIONS = {
      maxAge: AuthService.REFRESH_COOKIE_MAX_AGE,
      path: `/auth${AuthService.REFRESH_COOKIE_PATH}`,
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.isProduction() // Require HTTPS only in production
    }
  }

  // EMAIL + PASSWORD
  // ================

  async register(email: string, password: string): Promise<User> {
    return this.userService.createOrUpdate({
      email: email.toLowerCase(),
      password
    })
  }

  async validateUser(email: string, password: string): Promise<User> {
    const incorrectEmailOrPassword = (err?) =>
      new UnauthorizedException('INCORRECT_EMAIL_OR_PASSWORD', err)

    // Ensure user with email exists
    const user = await this.userService.findOne({ email })
    if (!user) throw incorrectEmailOrPassword()

    // Ensure passwords match
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) throw incorrectEmailOrPassword()

    return user
  }

  // ACCESS TOKEN
  // ============

  generateAccessToken(user: User) {
    const payload = { userId: user.id }
    return sign(payload, this.configService.get('ACCESS_TOKEN_SECRET'), {
      expiresIn: AuthService.ACCESS_TOKEN_EXPIRATION_TIME
    })
  }

  validateAccessToken(token: string, ignoreExpiration: boolean = false) {
    const invalidAccessToken = () => new UnauthorizedException('INVALID_ACCESS_TOKEN')

    try {
      // Verify jwt and get payload
      const payload: any = verify(token, this.configService.get('ACCESS_TOKEN_SECRET'), {
        ignoreExpiration
      })
      // Ensure payload contains a userId
      if (!payload.userId) throw invalidAccessToken()
      return payload
    } catch (err) {
      throw invalidAccessToken()
    }
  }

  // Get bearer token from request's Authorization header
  getAccessTokenFromRequest(req: Request): string {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string
    return authHeader ? authHeader.replace('Bearer ', '') : ''
  }

  // Get access token from socket connection metadata
  getAccessTokenFromConnection(conn: any): string {
    return conn.accessToken || ''
  }

  // Get access token from graphql context
  getAccessTokenFromContext({ req, conn }: GqlContext): string {
    return conn ? this.getAccessTokenFromConnection(conn) : this.getAccessTokenFromRequest(req)
  }

  getUserFromToken(accessToken: string) {
    try {
      const { userId }: any = verify(accessToken, this.configService.get('ACCESS_TOKEN_SECRET'))
      return this.userService.build({ id: userId })
    } catch (err) {
      return null
    }
  }

  // REFRESH TOKEN
  // =============

  generateRefreshToken(user: User) {
    const payload = { userId: user.id, tokenVersion: user.tokenVersion }
    return sign(payload, this.configService.get('REFRESH_TOKEN_SECRET'), {
      expiresIn: AuthService.REFRESH_TOKEN_EXPIRATION_TIME
    })
  }

  async validateRefreshToken(token: string): Promise<User> {
    const invalidRefreshToken = (err?) => new UnauthorizedException('INVALID_REFRESH_TOKEN', err)

    // Verify jwt
    let payload: any
    try {
      payload = verify(token, this.configService.get('REFRESH_TOKEN_SECRET'))
    } catch (err) {
      throw invalidRefreshToken(err)
    }

    // Ensure user exists and token versions match
    if (!payload) throw invalidRefreshToken()
    const { userId, tokenVersion } = payload
    const user = await this.userService.findOne({ id: userId })
    if (!user || tokenVersion !== user.tokenVersion) {
      throw invalidRefreshToken()
    }

    return user
  }

  // Invalidates all refresh tokens for the user, preventing all clients associated with that user from
  // acquiring a new access token until they re-authenticate.
  // Note that existing access tokens will continue to work until they expire (at most 15 minutes).
  invalidateRefreshTokensForUser(user: User) {
    return this.userService.incrementTokenVersion(user)
  }

  getRefreshCookie(req: Request) {
    return req.cookies[AuthService.REFRESH_COOKIE_NAME]
  }

  setRefreshCookie(token, res: Response) {
    return res.cookie(AuthService.REFRESH_COOKIE_NAME, token, this.REFRESH_COOKIE_OPTIONS)
  }

  clearRefreshCookie(res: Response) {
    return res.clearCookie(AuthService.REFRESH_COOKIE_NAME, {
      ...this.REFRESH_COOKIE_OPTIONS,
      maxAge: -1
    })
  }
}
