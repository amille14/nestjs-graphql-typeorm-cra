import { ApolloCache } from 'apollo-cache'
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

export const setAccessToken = (cache: ApolloCache<any>, accessToken: string) => {
  // Use client.writeQuery instead of cache.writeQuery to ensure UI updates
  cache.writeQuery({ query: GetAccessTokenDocument, data: { accessToken } })
  return accessToken
}

export const logoutRequest = (): Promise<any> => {
  console.info('%c[Logging out...]', 'color: lightskyblue;')
  return fetch(`http://${HOST}:${PORT}/auth/logout`, { method: 'POST', credentials: 'include' })
}

export const handleLogout = (cache: ApolloCache<any>, res: Response) => {
  setAccessToken(cache, '')
  console.info('%c[Logged out!]', 'color: lightgreen;')
  return res
}

export const refreshAccessTokenRequest = (): Promise<any> => {
  console.info('%c[Re-authenticating...]', 'color: lightskyblue;')
  return fetch(`http://${HOST}:${PORT}/auth/refresh_access`, { method: 'POST', credentials: 'include' })
}

export const handleRefreshAccessToken = (cache: ApolloCache<any>, res: Response) => {
  return res.json().then(json => {
    switch (res.status) {
      case 200:
      case 201:
        const { accessToken } = json
        setAccessToken(cache, accessToken)
        console.info('%c[Authenticated!]', 'color: lightgreen;')
        break
      case 401:
        const { message } = json
        logoutRequest().then(res => handleLogout(cache, res))
        break
      default:
        throw new Error(res.statusText)
    }

    return res
  })
}
