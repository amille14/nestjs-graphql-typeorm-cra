import { ApolloCache } from 'apollo-cache'
import { onError } from 'apollo-link-error'
import { logout, refreshAccessToken, setAccessToken } from '../../utils/auth'
import { promiseToObservable } from '../../utils/helpers'
import { OPERATION_COLORS } from './logger.link'

export const createErrorLink = (cache: ApolloCache<any>) => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    const { operationName, query } = operation
    const opType = (query.definitions[0] as any).operation
    const errorType = networkError ? 'NETWORK ERROR' : 'GRAPHQL ERROR'

    if (graphQLErrors) {
      for (let error of graphQLErrors) {
        switch (error.message) {
          case 'NOT_AUTHENTICATED':
            // Attempt to refresh auth token
            console.info('%c[Re-authenticating...]', 'color: lightskyblue;')
            const promise = refreshAccessToken(cache)
            const observable = promiseToObservable(promise)
            return observable.flatMap((newToken: any) => {
              setAccessToken(cache, newToken)
              return forward(operation)
            })
          case 'INVALID_REFRESH_TOKEN':
            logout(cache)
            break
          default:
            break
        }
      }
    }

    if (networkError) {
      console.log('NETWORK ERROR', networkError)
      switch ((networkError as any).statusCode) {
        case 401:
          logout(cache)
          break
        default:
          break
      }
    }

    // Log errors
    console.error(
      `%c[RES] %c${opType.toUpperCase()} ${operationName} %c(${errorType})`,
      'color: red;',
      `color: ${OPERATION_COLORS[opType]}`,
      'color: indianRed;',
      networkError ? networkError : graphQLErrors!.map(e => e.message),
      graphQLErrors && graphQLErrors[0] ? graphQLErrors[0].extensions!.exception.data : ''
    )
  })
}
