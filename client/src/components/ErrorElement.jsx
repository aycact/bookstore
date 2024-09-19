import React from 'react'
import {useRouteError} from 'react-router-dom'

const ErrorElement = () => {
    const error = useRouteError()
  return <h4>there was an error...</h4>
}

export default ErrorElement
