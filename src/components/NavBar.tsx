import React from 'react'
import {
  AppstoreOutlined,
  BellOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PieChartOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

type NavItemProps = {
  icon: React.ReactNode
  text: string
  path: string
}

const NavItem = ({ icon, text, path }: NavItemProps) => {
  const navigate = useNavigate()

  const isActive = useLocation().pathname.includes(path)

  let navigatePath = path

  return (
    <div className="relative">
      <button
        className={
          isActive
            ? 'font-semibold text-textHover gap-2 transition-colors flex justify-center items-center px-4 py-3'
            : 'text-noneSelected font-medium hover:text-textHover gap-2 transition-colors flex justify-center items-center px-4 py-3'
        }
      >
        {icon}
        <span>{text}</span>
      </button>
      <>
        {isActive && (
          <div className="w-4/5 h-[2px] bg-textHover absolute bottom-0 right-[10%]"></div>
        )}
      </>
    </div>
  )
}

const NavBar = () => {
  const currentPath = useLocation().pathname

  const isCreatePage = currentPath.includes('/create')
  const isMyTaskPage = currentPath === '/'

  let rightContent = (
    <>
      {!isMyTaskPage && <NavItem icon={<PieChartOutlined />} text="Overview" path="overview" />}
      <NavItem icon={<FileTextOutlined />} text="Tasks" path="tasks" />
      <NavItem icon={<CalendarOutlined />} text="Calendar" path="calendar" />
    </>
  )

  if (isCreatePage) {
    rightContent = <p className="pl-4 py-3 font-semibold text-xl">Create Project</p>
  }

  return (
    <div className="flex h-[7vh] justify-between items-center border-b-2 border-borderLine pr-4 w-full">
      <div className="flex justify-center items-center">{rightContent}</div>
      <div className="flex justify-center items-center gap-3">
        <div className="flex justify-center items-center px-3 py-1 gap-1 border border-disabled rounded-full">
          <SearchOutlined className="text-textHover" />
          <input className="grow outline-none text-base" placeholder="Search something..." />
        </div>

        <Tooltip placement="bottom" title="Notifications">
          <BellOutlined className="text-2xl flex justify-center items-center text-noneSelected cursor-pointer hover:text-textHover transition-colors" />
        </Tooltip>

        <Avatar
          className="flex justify-center items-center cursor-pointer"
          size={32}
          icon={<UserOutlined />}
        />
      </div>
    </div>
  )
}

export default NavBar
