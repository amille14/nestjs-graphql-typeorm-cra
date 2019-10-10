import { ApolloCache } from 'apollo-cache'
import ApolloClient from 'apollo-client'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { decode } from 'jsonwebtoken'
import {
  getAccessToken,
  logoutRequest,
  refreshAccessTokenRequest,
  setAccessToken
  } from '../../utils/auth'

export const createRefreshLink = (cache: ApolloCache<any>, client: ApolloClient<any>) => {
  return new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const accessToken = getAccessToken(cache)
      if (!accessToken) return true
      // Check if token has expired
      const decoded: any = decode(accessToken)
      return decoded && decoded.exp <= Date.now()
    },
    fetchAccessToken: () => refreshAccessTokenRequest(),
    handleFetch: (accessToken: string) => {
      setAccessToken(cache, accessToken)
      console.info('%c[Authenticated!]', 'color: lightgreen;')
    },
    handleError: (err: any) => {
      console.info('%c[Authentication failed.]', 'color: indianred;')
      if (err.statusCode === 401) {
        return logoutRequest().then(res => client.resetStore())
      }
    }
  })
}
