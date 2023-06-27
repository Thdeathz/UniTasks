import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useBoardStore from '~/stores/BoardStore'
import useProjectStore from '~/stores/ProjectStore'
import useCredentialStore from '~/stores/CredentialStore'

const Prefetch = () => {
  const [getBoard] = useBoardStore(state => [state.getBoard])
  const [getProjects] = useProjectStore(state => [state.getProjects])
  const [credential, getAllUsers] = useCredentialStore(state => [
    state.credential,
    state.getAllUsers
  ])

  useEffect(() => {
    getBoard()
    getProjects(credential.uid)
    getAllUsers()
  }, [getBoard, getProjects, getAllUsers])

  return <Outlet />
}
export default Prefetch
