import {
  Mutation,
  Query,
  Resolver,
  Subscription
  } from '@nestjs/graphql'
import {} from 'type-graphql'

// Graphql cannot have empty Query, Mutation, and Subscription types
// so we need to create defaults.

@Resolver()
export class DefaultResolver {
  @Query(returns => String, { name: 'default' })
  defaultQuery() {
    return ''
  }

  @Mutation(returns => String, { name: 'default' })
  defaultMutation() {
    return ''
  }

  @Subscription(returns => String, { resolve: payload => '' })
  default() {
    return ''
  }
}