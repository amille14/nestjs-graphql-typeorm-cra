import { ApolloCache } from 'apollo-cache'
import { GetAccessTokenDocument, GetClientIdDocument } from '../graphql/generated'

export const getClientId = (cache: ApolloCache<any>) => {
  const data: any = cache.readQuery({ query: GetClientIdDocument })
  return data ? data.clientId : null
}

export const getAccessToken = (cache: ApolloCache<any>) => {
  const data: any = cache.readQuery({ query: GetAccessTokenDocument })
  return data ? data.accessToken : null
}

export const setAccessToken = (cache: ApolloCache<any>, accessToken: string) => {
  cache.writeData({ data: { accessToken } })
  return accessToken
}

export const refreshAccessToken = (cache: ApolloCache<any>): Promise<any> => {
  const HOST = process.env.REACT_APP_SERVER_HOST
  const PORT = process.env.REACT_APP_SERVER_PORT
  console.log('Refreshing access token...')
  return fetch(`http://${HOST}:${PORT}/auth/refresh_access`, { method: 'POST', credentials: 'include' })
}

export const logout = async (cache: ApolloCache<any>): Promise<any> => {
  // TODO: Logout current user
  console.log('LOGOUT')
}
