import { ApolloCache } from 'apollo-cache'
import { GetAccessTokenDocument, GetClientIdDocument } from '../graphql/generated'
import { logInfo } from './log'

const HOST = process.env.REACT_APP_SERVER_HOST
const PORT = process.env.REACT_APP_SERVER_PORT

export const getClientId = (cache: ApolloCache<any>) => {
  const data: any = cache.readQuery({ query: GetClientIdDocument })
  return data ? data.clientId : null
}

export const getAccessToken = (cache: ApolloCache<any>) => {
  const data: any = cache.readQuery({ query: GetAccessTokenDocument })
  return data ? data.accessToken : null
}

export const setAccessToken = (cache: ApolloCache<any>, accessToken: string) => {
  // Use client.writeQuery instead of cache.writeQuery to ensure UI updates
  cache.writeQuery({ query: GetAccessTokenDocument, data: { accessToken } })
  return accessToken
}

export const refreshAccessTokenRequest = (): Promise<any> => {
  logInfo('Re-authenticating...')
  return fetch(`http://${HOST}:${PORT}/auth/refresh_access`, {
    method: 'POST',
    credentials: 'include'
  })
}

export const logoutRequest = (): Promise<any> => {
  logInfo('Logging out...')
  return fetch(`http://${HOST}:${PORT}/auth/logout`, { method: 'POST', credentials: 'include' })
}
