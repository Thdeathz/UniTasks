import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useBoardStore from '~/stores/BoardStore'
import useProjectStore from '~/stores/ProjectStore'

const Prefectch = () => {
  const [getBoard] = useBoardStore(state => [state.getBoard])
  const [getProjects] = useProjectStore(state => [state.getProjects])

  useEffect(() => {
    getBoard()
    getProjects()
  }, [getBoard, getProjects])

  return <Outlet />
}
export default Prefectch
