import React from 'react'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
  } from 'react-router-dom'
import { UserPartial } from '../graphql/generated'
import MainPage from './MainPage/MainPage'

interface Props {
  loggedIn: Boolean
}

const Routes: React.FC<Props> = ({ loggedIn }) => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={MainPage} />
      </Switch>
    </Router>
  )
}

export default Routes
