import { ApolloCache } from 'apollo-cache'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { getAccessToken, getClientId } from '../utils/auth'
import { logFailure, logInfo, logSuccess } from '../utils/log'

const PROTOCOL = window.location.protocol === 'https:' ? 'wss' : 'ws'
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT
const API_SUBSCRIPTIONS_ENDPOINT = `${PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api`

export const createSubscriptionsClient = (cache: ApolloCache<any>): SubscriptionClient => {
  const getConnectionParams = () => ({
    accessToken: getAccessToken(cache),
    clientId: getClientId(cache)
  })

  const subscriptionsClient: any = new SubscriptionClient(API_SUBSCRIPTIONS_ENDPOINT, {
    reconnect: true,
    lazy: true,
    connectionParams: getConnectionParams,
    connectionCallback: error => {
      if (error) {
        logFailure('Websocket connection error.', error)
      } else {
        logSuccess('Websocket connected!')
      }
    }
  })
  subscriptionsClient.onDisconnected(() => logFailure('Websocket disconnected! Retrying...'))
  subscriptionsClient.onConnecting(() => logInfo('Websocket connecting...'))
  subscriptionsClient.onReconnecting(() => logInfo('Websocket reconnecting...'))

  // Fix for https://github.com/apollographql/subscriptions-transport-ws/issues/377
  subscriptionsClient.maxConnectTimeGenerator.duration = () =>
    subscriptionsClient.maxConnectTimeGenerator.max

  // Middleware to send access token on each operation so we know if it changes.
  // See https://github.com/apollographql/apollo-server/issues/1505
  subscriptionsClient.use([
    {
      applyMiddleware: (options, next) => {
        Object.assign(options, getConnectionParams())
        next()
      }
    }
  ])

  return subscriptionsClient
}
