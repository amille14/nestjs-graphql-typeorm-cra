import React from 'react'
import { Link } from 'react-router-dom'
import { useUsersSubscription } from '../../graphql/generated'

const MainPage: React.FC = () => {
  const test = useUsersSubscription() as any

  console.log(test)

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
    </div>
  )
}

export default MainPage
