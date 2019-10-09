import { ApolloCache } from 'apollo-cache'
import { ApolloClient } from 'apollo-client'
import { GetAccessTokenDocument, GetClientIdDocument } from '../graphql/generated'

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

export const setAccessToken = (client: ApolloClient<any>, accessToken: string) => {
  // Use client.writeQuery instead of cache.writeQuery to ensure UI updates
  client.writeQuery({ query: GetAccessTokenDocument, data: { accessToken } })
  return accessToken
}

export const refreshAccessToken = (client: ApolloClient<any>): Promise<any> => {
  console.info('%c[Re-authenticating...]', 'color: lightskyblue;')
  return fetch(`http://${HOST}:${PORT}/auth/refresh_access`, { method: 'POST', credentials: 'include' }).then(res => {
    return res.json().then(({ statusCode, accessToken }) => {
      switch (statusCode) {
        case 200:
          setAccessToken(client, accessToken)
          console.info('%c[Authenticated!]', 'color: lightgreen;')
          break
        case 401:
          logout(client)
          break
        default:
          throw new Error(res.statusText)
      }

      return res
    })
  })
}

export const logout = (client: ApolloClient<any>): Promise<any> => {
  console.info('%c[Logging out...]', 'color: lightskyblue;')
  return fetch(`http://${HOST}:${PORT}/auth/logout`, { method: 'POST', credentials: 'include' }).then(res => {
    setAccessToken(client, '')
    console.info('%c[Logged out!]', 'color: lightgreen;')
    return res
  })
}
