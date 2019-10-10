import { useState } from 'react'

export const useForceUpdate = () => {
  const [update, setUpdate] = useState(true)
  return () => setUpdate(!update)
}
