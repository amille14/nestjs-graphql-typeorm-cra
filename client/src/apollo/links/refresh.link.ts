import { ApolloCache } from 'apollo-cache'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import { getAccessToken, refreshAccessToken, setAccessToken } from '../../utils/auth'

export const createRefreshLink = (cache: ApolloCache<any>) => {
  return new TokenRefreshLink({
    accessTokenField: 'accessToken',
    isTokenValidOrUndefined: () => {
      const accessToken = getAccessToken(cache)
      // TODO: Check if token is expired
      return !!accessToken
    },
    fetchAccessToken: () => refreshAccessToken(cache),
    handleFetch: (accessToken: string) => setAccessToken(cache, accessToken)
  })
}
