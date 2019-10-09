import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createAuthLink } from './links/auth.link'
import { createErrorLink } from './links/error.link'
import { createHybridLink } from './links/hybrid.link'
import { createLoggerLink } from './links/logger.link'
import { createRefreshLink } from './links/refresh.link'
import { defaults, resolvers } from './state'

const initLocalStore = (cache: InMemoryCache) => {
  return cache.writeData({ data: defaults })
}

export const createApolloClient = () => {
  // Setup cache
  const cache = new InMemoryCache()

  // Setup Apollo client
  let client
  const links = [
    createLoggerLink(),
    createAuthLink(),
    createRefreshLink(client),
    createErrorLink(client),
    createHybridLink(client)
  ]
  client = new ApolloClient({
    cache,
    resolvers,
    link: ApolloLink.from(links),
    connectToDevTools: true
  })

  // Setup local state
  initLocalStore(cache)
  client.onResetStore(async () => initLocalStore(cache))

  return client
}
