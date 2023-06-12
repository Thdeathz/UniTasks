import React, { useState } from 'react'
import { useEffectOnce } from 'usehooks-ts'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '~/firebase/config'
import useCredentialBoard from '~/stores/CredentialStore'
import { Outlet, useNavigate } from 'react-router-dom'
import Loading from '~/components/Loading'

const PersistLogin = () => {
  const navigate = useNavigate()
  const [setCredential] = useCredentialBoard(state => [state.setCredential])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffectOnce(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        const { uid, email, displayName, photoURL } = user
        if (!uid || !email || !displayName) return
        setCredential({ uid, email, displayName, avatar: photoURL as string })
        setIsLoading(false)
      } else {
        setIsLoading(false)
        navigate('/login')
      }
    })
  })

  return <>{isLoading ? <Loading title="Loading..." /> : <Outlet />}</>
}

export default PersistLogin
