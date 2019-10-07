import { ApolloProvider } from '@apollo/react-hooks'
import React from 'react'
import ReactDOM from 'react-dom'
import { initApolloClient } from './apolloClient'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

console.log(process.env)

const client = initApolloClient()

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(<ApolloApp />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
