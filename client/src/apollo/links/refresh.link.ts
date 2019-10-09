import ApolloClient from 'apollo-client'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { getAccessToken, logout, refreshAccessToken } from '../../utils/auth'

export const createRefreshLink = (client: ApolloClient<any>) => {
  return new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const accessToken = getAccessToken(client.cache)
      console.log('TOKEN', accessToken)
      return !accessToken
    },
    fetchAccessToken: () => {
      console.log('FETCH')
      return refreshAccessToken(client)
    },
    handleFetch: accessToken => {
      console.log(accessToken)
    },
    handleError: err => {
      console.log(err)
      logout(client)
    }
  })
}
