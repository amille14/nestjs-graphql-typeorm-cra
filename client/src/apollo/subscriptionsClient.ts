import { ApolloCache } from 'apollo-cache'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getAccessToken, getClientId } from '../utils/auth'

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT
const API_SUBSCRIPTIONS_ENDPOINT = `ws://${SERVER_HOST}:${SERVER_PORT}/api`

export const createSubscriptionsClient = (cache: ApolloCache<any>): SubscriptionClient => {
  const client: any = new SubscriptionClient(API_SUBSCRIPTIONS_ENDPOINT, {
    reconnect: true,
    // lazy: true,
    connectionParams: () => ({
      accessToken: getAccessToken(cache),
      clientId: getClientId(cache)
    }),
    connectionCallback: error => {
      if (error) {
        console.error('[Websocket connection error]', error)
      } else {
        console.info('%c[Websocket connected!]', 'color: lightgreen;')
      }
    }
  })
  client.onDisconnected(() => console.info('%c[Websocket disconnected! Retrying...]', 'color: indianRed;'))
  client.onConnecting(() => console.info('%c[Websocket connecting...]', 'color: lightskyblue;'))
  client.onReconnecting(() => console.info('%c[Websocket reconnecting...]', 'color: lightskyblue;'))

  // Fix for https://github.com/apollographql/subscriptions-transport-ws/issues/377
  client.maxConnectTimeGenerator.duration = () => client.maxConnectTimeGenerator.max

  return client
}
