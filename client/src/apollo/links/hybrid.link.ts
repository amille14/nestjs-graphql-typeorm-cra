import { split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { OperationDefinitionNode } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'

const SERVER_HOST = process.env.REACT_APP_SERVER_HOST
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT
const API_ENDPOINT = `${window.location.protocol}//${SERVER_HOST}:${SERVER_PORT}/api`

export const createHybridLink = (subscriptionClient: SubscriptionClient) => {
  // Handle http requests
  const httpLink = createHttpLink({
    uri: API_ENDPOINT,
    credentials: 'include'
  })

  // Handle websocket connection
  const wsLink = new WebSocketLink(subscriptionClient)

  // Handle subscriptions via websocket link, queries/mutations via http link
  return split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )
}
