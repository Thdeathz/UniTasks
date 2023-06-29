import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useBoardStore from '~/stores/BoardStore'
import useProjectStore from '~/stores/ProjectStore'
import useCredentialStore from '~/stores/CredentialStore'

const Prefetch = () => {
  const [getBoard] = useBoardStore(state => [state.getBoard])
  const [getProjects] = useProjectStore(state => [state.getProjects])
  const [credential, getAllUsers, getUserPlan] = useCredentialStore(state => [
    state.credential,
    state.getAllUsers,
    state.getUserPlan
  ])

  useEffect(() => {
    getBoard()
    getProjects(credential.uid)
    getAllUsers()
    getUserPlan(credential.uid)
  }, [getBoard, getProjects, getAllUsers, getUserPlan])

  return <Outlet />
}
export default Prefetch
