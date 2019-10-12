import React from 'react'
import { Link } from 'react-router-dom'
import { useAllUsersQuery, useMeLazyQuery, UsersDocument } from '../../graphql/generated'
import { useSubscribeToItems } from '../../utils/hooks'
import ErrorPage from '../ErrorPage/ErrorPage'

const MainPage: React.FC = () => {
  const { data, loading, error, subscribeToMore } = useAllUsersQuery({ errorPolicy: 'all' })
  const [me] = useMeLazyQuery({ fetchPolicy: 'network-only' })
  useSubscribeToItems(subscribeToMore, UsersDocument)

  if (error) return <ErrorPage error={error} />

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
          me()
        }}
      >
        Fetch me
      </button>
    </div>
  )
}

export default MainPage
