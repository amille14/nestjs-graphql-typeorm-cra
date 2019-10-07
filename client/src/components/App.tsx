import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { Suspense } from 'react'
import '../styles/app.scss'

const ME_QUERY = gql`
  {
    me {
      id
      email
    }
  }
`

const App: React.FC = () => {
  const { data } = useQuery(ME_QUERY)

  return (
    <div className="App">
      <Suspense fallback="Loading...">ME: {data && data.me ? data.me.email : 'who dis'}</Suspense>
    </div>
  )
}

export default App
