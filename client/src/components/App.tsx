import { useApolloClient } from '@apollo/react-hooks'
import React, { useEffect, useState } from 'react'
import { useGetAccessTokenQuery, useSetAccessTokenMutation } from '../graphql/generated'
import '../styles/app.scss'
import { refreshAccessToken } from '../utils/auth'
import Me from './Me'

const App: React.FC = () => {
  const { cache } = useApolloClient()
  const [loading, setLoading] = useState(true)
  const [setAccessToken] = useSetAccessTokenMutation()
  const {
    data: { accessToken }
  } = useGetAccessTokenQuery() as any

  useEffect(() => {
    refreshAccessToken(cache).then(async res => {
      const { accessToken: newToken } = await res.json()
      await setAccessToken({ variables: { token: newToken } })
      setLoading(false)
    })
  }, [cache])

  if (loading) return <div>Loading...</div>
  return (
    <div className="App">
      Access Token: {accessToken}
      <Me />
    </div>
  )
}

export default App
