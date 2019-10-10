import { useApolloClient } from '@apollo/react-hooks'
import React from 'react'
import { useGetAccessTokenQuery, useMeQuery } from '../graphql/generated'
import '../styles/app.scss'
import { logoutRequest } from '../utils/auth'

const App: React.FC = () => {
  const client = useApolloClient()
  const { data, loading, error } = useMeQuery()
  useGetAccessTokenQuery() // Listen for logouts
  const logout = () => logoutRequest().then(res => client.resetStore())

  if (loading) return <div>Loading...</div>

  if (error) {
    // TODO: Show error page
    return <div>{error}</div>
  }

  // TODO: Add routes for login/register

  return (
    <div className="App">
      {data && data.me ? (
        <div>
          Logged in as {data.me.email}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  )
}

export default App
