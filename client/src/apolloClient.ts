import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { defaults, resolvers } from './state'

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT
// TODO: Use https/wss
const API_ENDPOINT = `http://${SERVER_HOST}:${SERVER_PORT}/api`
const API_SUBSCRIPTIONS_ENDPOINT = `ws://${SERVER_HOST}:${SERVER_PORT}/api/ws`

export const initSubscriptionsClient = () => {
  const client = new SubscriptionClient(API_SUBSCRIPTIONS_ENDPOINT, {
    reconnect: true,
    // lazy: true,
    connectionParams: () => ({
      // accessToken: getAccesToken(),
      // clientId: getClientId()
    }),
    connectionCallback: error => {
      if (error) {
        console.error('[Websocket connection error]', error)
      } else {
        console.info('%c[Websocket connected!]', 'color: lightskyblue;')
      }
    }
  })
  client.onDisconnected(() => console.info('%c[Websocket disconnected! Retrying...]', 'color: indianRed;'))
  client.onConnecting(() => console.info('%c[Websocket connecting...]', 'color: lightskyblue;'))
  client.onReconnecting(() => console.info('%c[Websocket reconnecting...]', 'color: lightskyblue;'))

  return client
}

export const initLocalStore = (cache: InMemoryCache) => {
  return cache.writeData({ data: defaults })
}

export const initApolloClient = () => {
  // Setup cache
  // ===========
  const cache = new InMemoryCache()

  // Setup hybrid link
  // =================

  // Handle http requests
  const httpLink = createHttpLink({
    uri: API_ENDPOINT,
    credentials: 'include'
  })

  // Handle websocket connection
  const wsLink = new WebSocketLink(initSubscriptionsClient())

  // Handle subscriptions via websocket link, queries/mutations via http link
  const hybridLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  // Setup Apollo client
  // ===================
  const client = new ApolloClient({
    cache,
    resolvers,
    link: ApolloLink.from([hybridLink])
  })

  // Setup local state
  // =================
  initLocalStore(cache)
  client.onResetStore(async () => initLocalStore(cache))

  return client
}
