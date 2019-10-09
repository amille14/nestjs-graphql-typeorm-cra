import React from 'react'
import { useMeQuery } from '../graphql/generated'

const Me: React.FC = () => {
  const { data, loading, error } = useMeQuery()

  if (loading) return <div>Loading me...</div>

  if (error) {
    return null
  }

  return <div>I am {data!.me.email}</div>
}

export default Me
