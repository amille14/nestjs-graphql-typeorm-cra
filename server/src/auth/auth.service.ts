import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { GqlContext } from '../types/gqlContext.type'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  static SALT_ROUNDS = 12
  static ACCESS_TOKEN_EXPIRATION_TIME = '15m' // 15 minutes
  static REFRESH_TOKEN_EXPIRATION_TIME = '14d' // 14 days
  static REFRESH_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 14 // 14 days
  static REFRESH_COOKIE_NAME = 'rid'
  static REFRESH_COOKIE_PATH = '/refresh_access'

  constructor(private readonly users: UserService) {}

  // EMAIL + PASSWORD
  // ================

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, AuthService.SALT_ROUNDS)
    const user = this.users.repo.create({
      email: email.toLowerCase(),
      password: hashedPassword
    })
    return this.users.repo.save(user)
  }

  async validateUser(email: string, password: string): Promise<User> {
    const incorrectEmailOrPassword = (err?) =>
      new UnauthorizedException('INCORRECT_EMAIL_OR_PASSWORD', err)

    // Ensure user with email exists
    const user = await this.users.repo.findOne({ where: { email } })
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
    return sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: AuthService.ACCESS_TOKEN_EXPIRATION_TIME
    })
  }

  validateAccessToken(token: string, ignoreExpiration: boolean = false) {
    const invalidAccessToken = (err?) =>
      new UnauthorizedException('INVALID_ACCESS_TOKEN', err)

    try {
      // Verify jwt and get payload
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET, {
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
    const authHeader = (req.headers.authorization ||
      req.headers.Authorization) as string
    return authHeader ? authHeader.replace('Bearer ', '') : ''
  }

  // Get access token from socket connection metadata
  getAccessTokenFromConnection(conn: any): string {
    return conn.accessToken || ''
  }

  // Get access token from graphql context
  getAccessTokenFromContext({ req, conn }: GqlContext): string {
    return conn
      ? this.getAccessTokenFromConnection(conn)
      : this.getAccessTokenFromRequest(req)
  }

  getUserFromToken(accessToken: string): User | null {
    try {
      const { userId }: any = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      )
      return this.users.repo.create({ id: userId })
    } catch (err) {
      return null
    }
  }

  // REFRESH TOKEN
  // =============

  generateRefreshToken(user: User) {
    const payload = { userId: user.id, tokenVersion: user.tokenVersion }
    return sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: AuthService.REFRESH_TOKEN_EXPIRATION_TIME
    })
  }

  async validateRefreshToken(token: string): Promise<User> {
    const invalidRefreshToken = (err?) =>
      new UnauthorizedException('INVALID_REFRESH_TOKEN', err)

    try {
      // Verify jwt
      const payload: any = verify(token, process.env.REFRESH_TOKEN_SECRET)
      if (!payload) throw invalidRefreshToken()

      // Ensure user exists and token versions match
      const { userId, tokenVersion } = payload
      const user = await this.users.repo.findOne({ where: { id: userId } })
      if (!user || tokenVersion !== user.tokenVersion) {
        throw invalidRefreshToken()
      }

      return user
    } catch (err) {
      throw invalidRefreshToken(err)
    }
  }

  // Invalidates all refresh tokens for the user, preventing all clients associated with that user from
  // acquiring a new access token until they re-authenticate.
  // Note that existing access tokens will continue to work until they expire (at most 15 minutes).
  invalidateRefreshTokensForUser(user: User) {
    return this.users.repo.increment(user, 'tokenVersion', 1)
  }

  getRefreshCookie(req: Request) {
    return req.cookies[AuthService.REFRESH_COOKIE_NAME]
  }

  setRefreshCookie(token, res: Response) {
    return res.cookie(AuthService.REFRESH_COOKIE_NAME, token, {
      maxAge: AuthService.REFRESH_COOKIE_MAX_AGE,
      path: `/auth${AuthService.REFRESH_COOKIE_PATH}`,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' // Require HTTPS only in production
    })
  }

  clearRefreshCookie(res: Response) {
    return res.clearCookie(AuthService.REFRESH_COOKIE_NAME)
  }
}
