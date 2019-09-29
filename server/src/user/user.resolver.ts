import { UseGuards, UseInterceptors } from '@nestjs/common'
import {
  Args,
  Mutation,
  Query,
  Resolver
  } from '@nestjs/graphql'
import { IsAuthenticated } from '../auth/isAuthenticated.guard'
import { CurrentUser } from '../decorators/currentUser.decorator'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly users: UserService) {}

  @Query(returns => User)
  @UseGuards(IsAuthenticated)
  me(@CurrentUser() user: User) {
    return this.users.repo.findOne({ where: user })
  }
}
