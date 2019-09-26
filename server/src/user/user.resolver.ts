import { Resolver, Query } from '@nestjs/graphql'

@Resolver('User')
export class UserResolver {
  @Query(returns => String)
  hello() {
    return 'Hello world!'
  }
}
