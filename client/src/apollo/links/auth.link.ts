import { Context } from '@apollo/react-common'
import { ApolloLink } from 'apollo-link'
import { getAccessToken, getClientId } from '../../utils/auth'

export const createAuthLink = () => {
  return new ApolloLink((operation, forward) => {
    operation.setContext((context: Context) => {
      const { cache } = context
      const accessToken = getAccessToken(cache)
      console.log('OP', operation)
      console.log(accessToken)
      console.log(cache)
      return {
        ...context,
        headers: {
          ...context.headers,
          clientId: getClientId(cache),
          Authorization: accessToken ? `Bearer ${accessToken}` : ''
        }
      }
    })

    return forward(operation)
  })
}
