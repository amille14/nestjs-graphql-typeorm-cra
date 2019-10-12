import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { createAuthLink } from './links/auth.link'
import { createErrorLink } from './links/error.link'
import { createHybridLink } from './links/hybrid.link'
import { createLoggerLink } from './links/logger.link'
import { createRefreshLink } from './links/refresh.link'
import { setContextLink } from './links/setContext.link'
import { defaults, resolvers } from './state'
import { createSubscriptionsClient } from './subscriptionsClient'

export const initLocalStore = (client: ApolloClient<InMemoryCache>) => {
  return client.writeData({ data: defaults })
}

export const createApolloClient = () => {
  // Setup cache
  const cache = new InMemoryCache()

  // Setup subscriptions client
  const subscriptionsClient = createSubscriptionsClient(cache)

  // Setup Apollo client
  let client
  const getClient = () => client
  client = new ApolloClient({
    cache,
    resolvers,
    link: ApolloLink.from([
      setContextLink(getClient),

      createLoggerLink(),
      createAuthLink(),

      createRefreshLink(cache, getClient),

      createErrorLink(getClient),
      createHybridLink(subscriptionsClient)
    ]),
    connectToDevTools: true
  })

  client.getSubscriptionsClient = () => subscriptionsClient
  // Close and restart the ws connection with new params
  client.restartConnection = () => {
    const sc = subscriptionsClient as any
    sc.close(false, false)
    sc.tryReconnect()
  }

  // Setup local state
  initLocalStore(client)
  client.onResetStore(async () => {
    initLocalStore(client)
    // Force ws connection to reconnect with new access token
    client.restartConnection()
  })

  return client
}
