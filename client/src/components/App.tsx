import { useApolloClient } from '@apollo/react-hooks'
import React from 'react'
import { useGetAccessTokenQuery, useMeQuery, UserPartial } from '../graphql/generated'
import '../styles/app.scss'
import { logoutRequest } from '../utils/auth'
import ErrorPage from './ErrorPage/ErrorPage'
import Routes from './Routes'

const App: React.FC = () => {
  const client = useApolloClient()
  const { data, loading, error } = useMeQuery()
  useGetAccessTokenQuery() // Listen for logouts
  const logout = () => logoutRequest().then(res => client.resetStore())
  const loggedIn = !!(data && data.me)

  if (loading) return <div>Loading...</div>
  if (error) return <ErrorPage />
  return (
    <div className="App">
      {loggedIn ? (
        <div>
          Logged in as {data!.me!.email}
          <button onClick={logout}>Log out</button>
        </div>
      ) : (
        <div>Not logged in</div>
      )}
      <Routes loggedIn={loggedIn} />
    </div>
  )
}

export default App
