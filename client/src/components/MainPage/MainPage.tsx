import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  useAllUsersQuery,
  useMeLazyQuery,
  UsersDocument,
  useUsersSubscription
  } from '../../graphql/generated'
import { useSubscribeToItems } from '../../utils/hooks'

const MainPage: React.FC = () => {
  const { data, loading, error, subscribeToMore } = useAllUsersQuery()
  const [me, stuff] = useMeLazyQuery({ fetchPolicy: 'network-only' })
  useSubscribeToItems(subscribeToMore, UsersDocument)

  return (
    <div>
      Main Page
      <ul>
        <li>
          <Link to="/login">/login</Link>
        </li>
        <li>
          <Link to="/signup">/signup</Link>
        </li>
      </ul>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data!.allUsers.map(u => (
            <li key={u.id}>{u.email}</li>
          ))}
        </ul>
      )}
      <button
        onClick={() => {
          console.log('CLICKED')
          me()
        }}
      >
        Fetch me
      </button>
    </div>
  )
}

export default MainPage
