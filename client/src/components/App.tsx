import { useApolloClient } from '@apollo/react-hooks'
import React, { useLayoutEffect, useState } from 'react'
import { useGetAccessTokenQuery } from '../graphql/generated'
import '../styles/app.scss'
import { logout, refreshAccessToken } from '../utils/auth'
import Me from './Me'

const App: React.FC = () => {
  const client = useApolloClient()
  const [loading, setLoading] = useState(false)
  const {
    data: { accessToken }
  } = useGetAccessTokenQuery() as any

  useLayoutEffect(() => {
    if (accessToken) {
      setLoading(true)
      refreshAccessToken(client)
        .then(res => setLoading(false))
        .catch(err => {
          // TODO: Show error page
          console.error(err)
        })
    }
  }, [client])

  if (loading) return <div>Loading...</div>
  return (
    <div className="App">
      Access Token: {accessToken}
      <Me />
      {accessToken && (
        <a href="#" onClick={() => logout(client)}>
          logout
        </a>
      )}
    </div>
  )
}

export default App
