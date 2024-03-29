import React from 'react'
import {
  BellOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PieChartOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import AccountPopover from './AccountPopover'
import useBoardStore from '~/stores/BoardStore'
import Notifications from './Notifications'
import SearchBar from './Layouts/SearchBar'

type NavItemProps = {
  icon: React.ReactNode
  text: string
  path: string
}

const NavItem = ({ icon, text, path }: NavItemProps) => {
  const navigate = useNavigate()
  const currentPath = useLocation().pathname

  const isMyTaskPage = currentPath === '/'
  const isActive = currentPath.includes(path) || (isMyTaskPage && path === 'tasks')

  let navigatePath = path

  if (currentPath.includes('/project')) {
    const { projectId } = useParams()
    navigatePath = `/project/${projectId}/${path}`
  }

  if ((isMyTaskPage && path === 'tasks') || (currentPath === '/calendar' && path === 'tasks'))
    navigatePath = '/'
  if (isMyTaskPage && path === 'calendar') navigatePath = 'calendar'

  return (
    <div className="relative h-full flex justify-center items-center">
      <button
        className={
          isActive
            ? 'font-semibold text-textHover gap-2 transition-colors flex justify-center items-center px-4'
            : 'text-noneSelected font-medium hover:text-textHover gap-2 transition-colors flex justify-center items-center px-4'
        }
        onClick={() => !isActive && navigate(navigatePath)}
      >
        {icon}
        <span>{text}</span>
      </button>
      <>
        {isActive && (
          <motion.div
            layoutId="underline"
            className="w-4/5 h-[1.5px] bg-textHover absolute bottom-0 right-[10%]"
          ></motion.div>
        )}
      </>
    </div>
  )
}

const NavBar = () => {
  const currentPath = useLocation().pathname

  const isCreatePage = currentPath.includes('/create')
  const isProjectPage = currentPath === '/project'
  const isAccountPage = currentPath === '/account'
  const isTrashPage = currentPath === '/trash'
  const isMyTaskPage = currentPath === '/' || currentPath === '/calendar'

  const [board] = useBoardStore(state => [state.board])

  let rightContent = (
    <>
      {!isMyTaskPage && <NavItem icon={<PieChartOutlined />} text="Overview" path="overview" />}
      <NavItem icon={<FileTextOutlined />} text="Tasks" path="tasks" />
      <NavItem icon={<CalendarOutlined />} text="Calendar" path="calendar" />
    </>
  )

  if (isCreatePage) {
    rightContent = <p className="pl-4 font-semibold text-xl">Create Project</p>
  }

  if (isProjectPage) {
    rightContent = <p className="pl-4 font-semibold text-xl">Projects</p>
  }

  if (isAccountPage) {
    rightContent = <p className="pl-4 font-semibold text-xl">Account</p>
  }

  if (isTrashPage) {
    rightContent = (
      <p className="pl-4 font-semibold text-xl">
        Trash
        {board.columns.get('deleted')?.tasks.length !== 0 && (
          <span className="text-danger ms-2">
            {board.columns.get('deleted')?.tasks.length} items
          </span>
        )}
      </p>
    )
  }

  return (
    <div className="flex min-h-[3rem] max-h-[3rem] justify-between items-center border-b-2 border-borderLine pr-4 w-full sticky top-0 z-50">
      <div className="flex justify-center items-center h-full">{rightContent}</div>
      <div className="flex justify-center items-center gap-3">
        <SearchBar />

        <Notifications />

        <AccountPopover />
      </div>
    </div>
  )
}

export default NavBar
