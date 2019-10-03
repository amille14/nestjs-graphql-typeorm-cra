import { UseGuards } from '@nestjs/common'
import { Context } from '@nestjs/graphql'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '../api/decorators/current-user.decorator'
import { GqlContext } from '../api/types/gql-context.type'
import { User } from '../entities/user/user.entity'
import { AuthService } from './auth.service'
import { IsAuthenticated } from './is-authenticated.guard'
import { LoginArgs, LoginPayload } from './types/login.types'
import { RegisterArgs } from './types/register.types'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(returns => LoginPayload)
  async register(
    @Args() { email, password }: RegisterArgs,
    @Context() { res }: GqlContext
  ): Promise<LoginPayload> {
    const user = await this.authService.register(email, password)
    const accessToken = this.authService.generateAccessToken(user)
    const refreshToken = this.authService.generateRefreshToken(user)
    this.authService.setRefreshCookie(refreshToken, res)

    return {
      user,
      accessToken
    }
  }

  @Mutation(returns => LoginPayload)
  async login(
    @Args() { email, password }: LoginArgs,
    @Context() { res }: GqlContext
  ): Promise<LoginPayload> {
    const user = await this.authService.validateUser(email, password)
    const accessToken = this.authService.generateAccessToken(user)
    const refreshToken = this.authService.generateRefreshToken(user)
    this.authService.setRefreshCookie(refreshToken, res)

    return {
      user,
      accessToken
    }
  }

  @Mutation(returns => Boolean)
  @UseGuards(IsAuthenticated)
  logout(@Context() { res }: GqlContext) {
    this.authService.clearRefreshCookie(res)
    return true
  }

  @Mutation(returns => Boolean)
  @UseGuards(IsAuthenticated)
  async logoutOtherClients(
    @CurrentUser() user: User,
    @Context() { res }: GqlContext
  ) {
    // Invalidate all refresh tokens for the current user
    await this.authService.invalidateRefreshTokensForUser(user)

    // Create a new valid refresh token for the current client
    const newRefreshToken = this.authService.generateRefreshToken(user)
    this.authService.setRefreshCookie(newRefreshToken, res)
    return true
  }
}
