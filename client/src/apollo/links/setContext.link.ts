import { setContext } from 'apollo-link-context'

export const setContextLink = (getClient: Function) => {
  return setContext((operation, previousContext) => {
    return { ...previousContext, getClient }
  })
}
