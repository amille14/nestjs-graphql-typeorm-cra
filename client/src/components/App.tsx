import { useApolloClient } from '@apollo/react-hooks'
import React, { useLayoutEffect, useState } from 'react'
import { useGetAccessTokenQuery } from '../graphql/generated'
import '../styles/app.scss'
import {
  handleLogout,
  handleRefreshAccessToken,
  logoutRequest,
  refreshAccessTokenRequest
  } from '../utils/auth'
import Me from './Me'

const App: React.FC = () => {
  const client = useApolloClient()
  const [loading, setLoading] = useState(false)
  const {
    data: { accessToken }
  } = useGetAccessTokenQuery() as any

  console.log('RENDER', accessToken)

  // useLayoutEffect(() => {
  //   if (!accessToken) {
  //     refreshAccessTokenRequest().then(res => handleRefreshAccessToken(client.cache, res).then(() => setLoading(false)))
  //   }
  // }, [])

  if (loading) return <div>Loading...</div>
  return (
    <div className="App">
      Access Token: {accessToken}
      <Me />
      {accessToken && (
        <a
          href="#"
          onClick={() =>
            logoutRequest()
              .then(res => handleLogout(client.cache, res))
              .then(() => client.resetStore())
          }
        >
          logout
        </a>
      )}
    </div>
  )
}

export default App
