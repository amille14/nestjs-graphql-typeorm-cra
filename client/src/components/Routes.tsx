import { useApolloClient } from '@apollo/react-hooks'
import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
  } from 'react-router-dom'
import { useMeQuery } from '../graphql/generated'
import { logoutRequest } from '../utils/auth'
import ErrorPage from './ErrorPage/ErrorPage'
import MainPage from './MainPage/MainPage'

interface Props {}

const Routes: React.FC<Props> = () => {
  const client = useApolloClient()
  const { data, loading, error } = useMeQuery()
  const logout = () => logoutRequest().then(res => client.resetStore())
  const isAuthenticated = !!(data && data.me)

  if (loading) return <div>Loading...</div>
  if (error) return <ErrorPage error={error} />

  return (
    <>
      {isAuthenticated ? (
        <div>
          Logged in as {data!.me!.email}
          <button onClick={logout}>Log out</button>
        </div>
      ) : (
        <div>Not logged in</div>
      )}
      <Router>
        <Switch>
          <Route path="/" component={MainPage} />
        </Switch>
      </Router>
    </>
  )
}

export default Routes
