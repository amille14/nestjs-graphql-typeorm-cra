import { ApolloCache } from 'apollo-cache'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { decode } from 'jsonwebtoken'
import {
  getAccessToken,
  logoutRequest,
  refreshAccessTokenRequest,
  setAccessToken
  } from '../../utils/auth'
import { logFailure, logSuccess } from '../../utils/log'

export const createRefreshLink = (cache: ApolloCache<any>, getClient: Function) => {
  return new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const accessToken = getAccessToken(cache)
      if (!accessToken) return true
      const decoded: any = decode(accessToken)
      const isValid = decoded && decoded.userId && decoded.exp * 1000 > Date.now()
      return isValid
    },
    fetchAccessToken: () => {
      return refreshAccessTokenRequest()
    },
    handleFetch: (accessToken: string) => {
      logSuccess('Authenticated!')
      setAccessToken(cache, accessToken)
    },
    handleError: (err: any) => {
      logFailure('Authentication failed.')
      if (err.statusCode === 401) {
        return logoutRequest().then(res => getClient().resetStore())
      }
    }
  })
}
