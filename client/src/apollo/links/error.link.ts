import { onError } from 'apollo-link-error'
import { logFailure, logSuccess } from '../../utils/log'
import { logoutRequest, refreshAccessTokenRequest, setAccessToken } from './../../utils/auth'

export const createErrorLink = () => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    const { cache, getClient } = operation.getContext()

    // Logout user, then redirect to login page
    const logout = () => {
      logFailure('Authentication failed.')
      return logoutRequest().then(async res => {
        await getClient().resetStore()
        // window.location.replace('/login')
      })
    }

    // Handle all graphql errors
    if (graphQLErrors) {
      graphQLErrors.forEach(async error => {
        const {
          message: { statusCode, message }
        } = error as any

        switch (statusCode) {
          case 401:
            // Attempt to refresh access token
            if (message === 'INVALID_ACCESS_TOKEN') {
              const res = await refreshAccessTokenRequest()

              if (res.ok) {
                logSuccess('Authenticated!')
                const { accessToken } = await res.json()
                setAccessToken(cache, accessToken)
                return forward(operation)
              }
            }

            // If refresh fails, logout user
            logout()
            break
          default:
            return forward(operation)
        }
      })
    }
  })
}
