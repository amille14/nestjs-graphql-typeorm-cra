import { ApolloCache } from 'apollo-cache'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { decode } from 'jsonwebtoken'
import { getAccessToken, refreshAccessTokenRequest, setAccessToken } from '../../utils/auth'
import { handleLogout, logoutRequest } from './../../utils/auth'

export const createRefreshLink = (cache: ApolloCache<any>) => {
  return new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const accessToken = getAccessToken(cache)

      if (accessToken !== undefined) {
        const decoded: any = decode(accessToken)
        if (decoded && decoded.exp <= Date.now()) return true
      }

      return false
    },
    fetchAccessToken: () => refreshAccessTokenRequest(),
    handleFetch: (accessToken: string) => {
      setAccessToken(cache, accessToken)
      console.info('%c[Authenticated!]', 'color: lightgreen;')
    },
    handleError: (err: any) => {
      if (err.statusCode === 401) {
        return logoutRequest().then(res => handleLogout(cache, res))
      }
    }
  })
}
