import React, { useEffect, useState } from 'react'
import { useSetAccessTokenMutation } from '../graphql/generated'
import '../styles/app.scss'
import { refreshAccessTokenRequest } from '../utils/auth'
import { logFailure, logSuccess } from '../utils/log'
import ErrorPage from './ErrorPage/ErrorPage'
import Routes from './Routes'

const App: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [setAccessToken] = useSetAccessTokenMutation()

  // On initial page load, attempt to fetch a valid access token
  useEffect(() => {
    refreshAccessTokenRequest()
      .then(async res => {
        switch (res.status) {
          case 200:
          case 201:
            const { accessToken } = await res.json()
            await setAccessToken({ variables: { accessToken } })
            logSuccess('Authenticated!')
            break
          case 401:
          default:
            await setAccessToken({ variables: { accessToken: '' } })
            logFailure('Authentication failed. Continuing as unauthenticated user.')
        }
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [setAccessToken])

  return (
    <div className="App">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>{error ? <ErrorPage error={error} /> : <Routes />}</div>
      )}
    </div>
  )
}

export default App
