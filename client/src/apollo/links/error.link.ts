import ApolloClient from 'apollo-client'
import { onError } from 'apollo-link-error'
import { logout, refreshAccessToken, setAccessToken } from '../../utils/auth'
import { promiseToObservable } from '../../utils/helpers'

export const createErrorLink = (client: ApolloClient<any>) => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let error of graphQLErrors) {
        switch (error.message) {
          // case 'INVALID_ACCESS_TOKEN':
          //   // Attempt to refresh auth token
          //   console.info('%c[Re-authenticating...]', 'color: lightskyblue;')
          //   const promise = refreshAccessToken(client)
          //   const observable = promiseToObservable(promise)
          //   return observable.flatMap((newToken: any) => {
          //     return forward(operation)
          //   })
          case 'INVALID_REFRESH_TOKEN':
            logout(client)
            break
          default:
            break
        }
      }
    }

    if (networkError) {
      switch ((networkError as any).statusCode) {
        case 401:
          logout(client)
          break
        default:
          break
      }
    }
  })
}
