import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createAuthLink } from './links/auth.link'
import { createErrorLink } from './links/error.link'
import { createHybridLink } from './links/hybrid.link'
import { createLoggerLink } from './links/logger.link'
import { createRefreshLink } from './links/refresh.link'
import { defaults, resolvers } from './state'

export const initLocalStore = (client: ApolloClient<InMemoryCache>) => {
  return client.writeData({ data: defaults })
}

export const createApolloClient = () => {
  // Setup cache
  const cache = new InMemoryCache()

  // Setup Apollo client
  let client
  client = new ApolloClient({
    cache,
    resolvers,
    link: ApolloLink.from([
      createLoggerLink(),
      createRefreshLink(cache, client),
      createAuthLink(),
      createErrorLink(),
      createHybridLink(cache)
    ]),
    connectToDevTools: true
  })

  // Setup local state
  initLocalStore(client)
  client.onResetStore(async () => initLocalStore(client))

  return client
}
