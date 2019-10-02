import { UseGuards } from '@nestjs/common'
import { Query, Resolver, Subscription } from '@nestjs/graphql'
import { Arg, Mutation } from 'type-graphql'
import { IsAuthenticated } from '../auth/isAuthenticated.guard'
import { CurrentUser } from '../decorators/current-user.decorator'
import { RedisPubSubService } from '../redis/redis-pubsub.service'
import { User } from './user.entity'
import { UserService } from './user.service'

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly pubsub: RedisPubSubService
  ) {}

  @Query(returns => User)
  @UseGuards(IsAuthenticated)
  me(@CurrentUser() user: User) {
    return this.userService.findOne(user)
  }

  @Mutation(returns => User)
  @UseGuards(IsAuthenticated)
  updateUserEmail(@CurrentUser() user: User, @Arg('email') email: string) {
    return this.userService.update(user, { email })
  }

  @Mutation(returns => User)
  @UseGuards(IsAuthenticated)
  deleteUser(@CurrentUser() user: User) {
    console.log('CURRENT', user)

    return this.userService.delete(user)
  }

  @Subscription(returns => User, {
    resolve: payload => payload.node
  })
  userCreated() {
    return this.pubsub.asyncIterator('user_created')
  }

  @Subscription(returns => User, {
    resolve: payload => payload.node
  })
  userUpdated() {
    return this.pubsub.asyncIterator('user_updated')
  }

  @Subscription(returns => User, {
    resolve: payload => payload.node
  })
  userDeleted() {
    return this.pubsub.asyncIterator('user_deleted')
  }
}
