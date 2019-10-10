import { onError } from 'apollo-link-error'
import { promiseToObservable } from '../../utils/helpers'
import {
  // handleLogout,
  // handleRefreshAccessToken,
  logoutRequest,
  refreshAccessTokenRequest,
  setAccessToken
} from './../../utils/auth'

export const createErrorLink = () => {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    // const { cache } = operation.getContext()
    // if (graphQLErrors) {
    //   for (let error of graphQLErrors) {
    //     switch ((error.message as any).message) {
    //       case 'INVALID_ACCESS_TOKEN':
    //         // Attempt to refresh auth token
    //         const promise = refreshAccessTokenRequest()
    //         const observable = promiseToObservable(promise)
    //         return observable.flatMap((res: any): any => {
    //           return res.json().then(({ accessToken }) => {
    //             setAccessToken(cache, accessToken)
    //             return forward(operation)
    //           })
    //         })
    //       case 'INVALID_REFRESH_TOKEN':
    //         logoutRequest().then(res => handleLogout(cache, res))
    //         break
    //       default:
    //         break
    //     }
    //   }
    // }
    // if (networkError) {
    //   switch ((networkError as any).statusCode) {
    //     case 401:
    //       logoutRequest().then(res => handleLogout(cache, res))
    //       break
    //     default:
    //       break
    //   }
    // }
  })
}
