import { Context } from '@apollo/react-common'
import { ApolloCache } from 'apollo-cache'
import { ApolloLink } from 'apollo-link'
import { getAccessToken, getClientId } from '../../utils/auth'

export const createAuthLink = (cache: ApolloCache<any>) => {
  return new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken(cache)

    operation.setContext((context: Context) => ({
      ...context,
      headers: {
        ...context.headers,
        clientId: getClientId(cache),
        Authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    }))

    return forward(operation)
  })
}
