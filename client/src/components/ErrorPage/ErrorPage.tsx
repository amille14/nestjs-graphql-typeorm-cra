import React from 'react'

interface Props {
  error: any
}

const ErrorPage: React.FC<Props> = ({ error }) => {
  // TODO: Display various error pages (404, 500, etc.)
  console.error(error)
  return <div className="ErrorPage">Something went wrong...</div>
}

ErrorPage.defaultProps = {}

export default ErrorPage
