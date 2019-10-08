import { Observable } from 'apollo-link'

// Convert a Promise object into an Observable that emits once
// https://github.com/apollographql/apollo-link/issues/646#issuecomment-423279220
export const promiseToObservable = (promise: Promise<any>) => {
  return new Observable(subscriber => {
    promise
      .then(value => {
        if (!subscriber.closed) {
          subscriber.next(value)
          subscriber.complete()
        }
      })
      .catch(err => subscriber.error(err))
  })
}
