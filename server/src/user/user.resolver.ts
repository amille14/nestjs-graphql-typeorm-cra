import { AuthService } from './../auth/auth.service'
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { User } from './user.entity'
import { UserService } from './user.service'
import { RegisterArgs } from './dto/register.dto'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/gqlAuth.guard'
import { CurrentUser } from '../decorators/currentUser.decorator'
import { LoginPayload, LoginArgs } from './dto/login.dto'

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly users: UserService,
    private readonly authService: AuthService
  ) {}

  @Query(returns => User, { nullable: true })
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return this.users.repo.findOneOrFail(user.id)
  }

  @Mutation(returns => User)
  register(@Args() { email, password }: RegisterArgs): Promise<User> {
    return this.authService.register(email, password)
  }

  @Mutation(returns => LoginPayload)
  async login(@Args() { email, password }: LoginArgs): Promise<LoginPayload> {
    const user = await this.authService.validateUser(email, password)
    const accessToken = await this.authService.getAccessToken(user)

    return {
      user,
      accessToken
    }
  }
}
