import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Subscription
  } from '@nestjs/graphql'
import { string } from 'prop-types'
import { Arg } from 'type-graphql'
import { CurrentUser } from '../../api/decorators/current-user.decorator'
import { IsAuthenticated } from '../../auth/is-authenticated.guard'
import { RedisPubSubService } from '../../db/redis/redis-pubsub.service'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly pubsub: RedisPubSubService
  ) {}

  @Query(returns => User)
  @UseGuards(IsAuthenticated)
  async me(@CurrentUser() user: User): Promise<User> {
    return await this.userService.findOne(user)
  }

  @Mutation(returns => User)
  @UseGuards(IsAuthenticated)
  async delete(@CurrentUser() user: User) {
    return await this.userService.delete(user)
  }

  @Mutation(returns => User)
  @UseGuards(IsAuthenticated)
  async updateUserEmail(
    @CurrentUser() user: User,
    @Args('email') email: string
  ): Promise<User> {
    return await this.userService.update(user, { email })
  }

  @Subscription(returns => User, {
    resolve: payload => payload.node
  })
  userCreated() {
    return this.pubsub.asyncIterator('User_created')
  }

  @Subscription(returns => User, {
    resolve: payload => payload.node
  })
  userUpdated() {
    return this.pubsub.asyncIterator('User_updated')
  }

  @Subscription(returns => User, {
    resolve: payload => payload.node
  })
  userDeleted() {
    return this.pubsub.asyncIterator('User_deleted')
  }
}
