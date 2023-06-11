import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useCredentialBoard from '~/stores/CredentialStore'

const LoggedIn = () => {
  const location = useLocation()
  const [credential] = useCredentialBoard(state => [state.credential])

  return (
    <>
      {credential.uid !== '' ? <Navigate to="/" state={{ from: location }} replace /> : <Outlet />}
    </>
  )
}

export default LoggedIn
