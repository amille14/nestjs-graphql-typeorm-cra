import React from 'react'

interface Props {}

const ErrorPage: React.FC<Props> = () => {
  return <div className="ErrorPage">Something went wrong...</div>
}

ErrorPage.defaultProps = {}

export default ErrorPage
