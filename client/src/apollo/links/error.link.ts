import { onError } from 'apollo-link-error'
import { promiseToObservable } from '../../utils/helpers'
import { logFailure, logSuccess } from '../../utils/log'
import { logoutRequest, refreshAccessTokenRequest, setAccessToken } from './../../utils/auth'

export const createErrorLink = (getClient: Function) => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    const { cache } = operation.getContext()

    console.log('gqe', graphQLErrors)
    console.log('ne', networkError)

    if (graphQLErrors) {
      graphQLErrors.forEach(error => {
        const {
          message: { statusCode, message }
        } = error as any

        // Handle authentication errors
        if (statusCode === 401) {
          switch (message) {
            case 'INVALID_ACCESS_TOKEN':
              // Attempt to refresh access token
              const promise = refreshAccessTokenRequest().then(async res => {
                if (res.status === 201) {
                  logSuccess('Authenticated!')
                  const { accessToken } = await res.json()
                  setAccessToken(cache, accessToken)
                  getClient().restartConnection()
                }

                if (res.status === 401) {
                  logFailure('Authentication failed.')
                }

                return res
              })
              const observable = promiseToObservable(promise)
              return observable.flatMap(() => forward(operation))
            case 'INVALID_REFRESH_TOKEN':
              logoutRequest().then(res => getClient().resetStore())
              break
            default:
              break
          }
        }
      })
    }
  })
}
