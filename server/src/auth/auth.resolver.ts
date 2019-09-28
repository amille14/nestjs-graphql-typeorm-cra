import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Context } from '@nestjs/graphql'
import { CurrentUser } from '../decorators/currentUser.decorator'
import { GqlContext } from '../types/gqlContext.type'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { LoginArgs, LoginPayload } from './dto/login.dto'
import { RegisterArgs } from './dto/register.dto'
import { IsAuthenticated } from './isAuthenticated.guard'

@Resolver(of => User)
export class AuthResolver {
  constructor(
    private readonly users: UserService,
    private readonly authService: AuthService
  ) {}

  @Mutation(returns => User)
  register(@Args() { email, password }: RegisterArgs): Promise<User> {
    return this.authService.register(email, password)
  }

  @Mutation(returns => LoginPayload)
  async login(
    @Args() { email, password }: LoginArgs,
    @Context() ctx: GqlContext
  ): Promise<LoginPayload> {
    const user = await this.authService.validateUser(email, password)
    const accessToken = this.authService.generateAccessToken(user)
    const refreshToken = this.authService.generateRefreshToken(user)
    this.authService.setRefreshCookie(refreshToken, ctx.res)
    ctx.user = { id: user.id }
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
