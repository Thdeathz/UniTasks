import React, { useState } from 'react'
import {
  SnippetsOutlined,
  PlusCircleOutlined,
  LeftOutlined,
  RightOutlined,
  ProjectOutlined,
  PlusSquareOutlined,
  CaretDownOutlined,
  PlusSquareFilled,
  SnippetsFilled,
  CaretUpOutlined,
  DeleteOutlined,
  DeleteFilled,
  ProjectFilled,
  UserOutlined
} from '@ant-design/icons'
import { Divider, Tooltip } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import AppLogo from '~/assets/Logo.png'
import IconOnly from '~/assets/Icon_only.png'
import useBoardStore from '~/stores/BoardStore'
import useProjectStore from '~/stores/ProjectStore'

type SideMenuItemProps = {
  icon: React.ReactNode
  activedIcon: React.ReactNode
  text: string
  isOpen: boolean
  path: string
}

type SubMenuItemProps = {
  project: ProjectType
}

type ProjectMenuProps = {
  isSideBarOpen: boolean
}

const SideMenuItem = ({ icon, activedIcon, text, isOpen, path }: SideMenuItemProps) => {
  const navigate = useNavigate()
  const currentPath = useLocation().pathname

  const isActived =
    currentPath.slice(1) === path.slice(1) ||
    (currentPath === '/' && path === '/') ||
    (currentPath.slice(1) === 'calendar' && path === '/') ||
    (currentPath.slice(1).includes('project') && path === '/project')

  return (
    <Tooltip placement="right" title={!isOpen && text} arrow={false}>
      <button
        className={`
        ${isActived ? 'hover:bg-primary-2 text-primary-5' : 'hover:bg-primary-1'}
        ${isOpen ? 'py-2 px-2' : 'py-2 px-4'}
        ${isOpen && isActived && 'bg-primary-1'} 
        flex w-full justify-start font-medium items-center gap-2 text-noneSelected rounded transition-colors`}
        onClick={() => navigate(path)}
      >
        {isActived ? activedIcon : icon}
        <span className={`${!isOpen && 'hidden'} ${isActived && 'font-semibold'}`}>{text}</span>
      </button>
    </Tooltip>
  )
}

const SubMenuItem = ({ project }: SubMenuItemProps) => {
  const naivgate = useNavigate()

  const isActived = useLocation().pathname.includes(`project/${project.id}`)

  return (
    <button
      className={`
        ${isActived && 'text-primary-5 border-l-2'}
        font-medium pl-3 ml-3 pb-1.5 cursor-pointer text-noneSelected hover:text-borderHover 
      `}
      onClick={() => naivgate(`/project/${project.id}/overview`)}
    >
      {project.name}
    </button>
  )
}

const ProjectMenu = ({ isSideBarOpen }: ProjectMenuProps) => {
  const navigate = useNavigate()
  const [projects] = useProjectStore(state => [state.projects])
  const [isSubMenuOpen, setIsSubMenuOpen] = useBoardStore(state => [
    state.isSubMenuOpen,
    state.setIsSubMenuOpen
  ])

  const isActived = useLocation().pathname.includes('project')

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full text-noneSelected relative">
        <Tooltip placement="right" title={!isSideBarOpen && 'Project'} arrow={false}>
          <button
            className={`
            ${isActived ? 'hover:bg-primary-2 text-primary-5' : 'hover:bg-primary-1'}
            ${isSideBarOpen ? 'py-2 px-2' : 'py-2 px-4'}
            ${isSideBarOpen && isActived && 'bg-primary-1'}
            ${isSubMenuOpen ? 'rounded-t' : 'rounded'}
            flex w-full justify-between font-medium items-center text-noneSelected transition-colors hover:bg-primary-1`}
            onClick={() => navigate('/project')}
          >
            <div className="flex justify-start items-center gap-2">
              {isActived ? (
                <ProjectFilled className="text-xl flex justify-start items-center" />
              ) : (
                <ProjectOutlined className="text-xl flex justify-start items-center" />
              )}
              <span className={`${!isSideBarOpen && 'hidden'} `}>Project</span>
            </div>
          </button>
        </Tooltip>

        {isSideBarOpen && (
          <button
            className="flex justify-center items-center p-1 rounded-full hover:text-primary-4 absolute top-2 right-2"
            onClick={() => {
              if (isSideBarOpen) setIsSubMenuOpen(!isSubMenuOpen)
            }}
          >
            {isSubMenuOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </button>
        )}
      </div>

      {isSideBarOpen && isSubMenuOpen && (
        <div
          className={`${
            isActived && 'bg-primary-1'
          } flex flex-col justify-start items-start rounded-b pb-1`}
        >
          <>
            {Array.from(projects.entries()).map(([id, project], index) => {
              if (project.bookmark)
                return <SubMenuItem key={`each-project-${index}`} project={project} />
            })}
          </>
        </div>
      )}
    </div>
  )
}

const SideBar = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useBoardStore(state => [
    state.isSideBarOpen,
    state.setIsSideBarOpen
  ])

  return (
    <div
      className={`${
        isSideBarOpen ? 'min-w-[13rem] max-w-[13rem]' : 'w-min'
      } flex flex-col justify-between transition-all duration-200 items-start border-r-2 border-borderLine h-full`}
    >
      <div className={`${isSideBarOpen && 'px-2'} gap-2 py-4`}>
        {isSideBarOpen ? (
          <img className="w-2/3 mb-4 px-2" src={AppLogo} alt="app-logo" />
        ) : (
          <img className="mb-4 px-3" src={IconOnly} alt="app-logo" />
        )}

        <div className="flex flex-col justify-start items-start gap-2 w-full">
          <SideMenuItem
            isOpen={isSideBarOpen}
            icon={<SnippetsOutlined className="text-xl flex justify-start items-center" />}
            activedIcon={<SnippetsFilled className="text-xl flex justify-start items-center" />}
            text="My Task"
            path="/"
          />

          <ProjectMenu isSideBarOpen={isSideBarOpen} />

          <Divider className="m-0" />

          <SideMenuItem
            isOpen={isSideBarOpen}
            icon={<UserOutlined className="text-xl flex justify-start items-center" />}
            activedIcon={<UserOutlined className="text-xl flex justify-start items-center" />}
            text="Account"
            path="/account"
          />

          <SideMenuItem
            isOpen={isSideBarOpen}
            icon={<DeleteOutlined className="text-xl flex justify-start items-center" />}
            activedIcon={<DeleteFilled className="text-xl flex justify-start items-center" />}
            text="Trash"
            path="/trash"
          />
        </div>
      </div>

      <button
        className="bg-primary-3 w-full text-bgDefault flex justify-center items-center py-2"
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
      >
        {isSideBarOpen ? <LeftOutlined /> : <RightOutlined />}
      </button>
    </div>
  )
}

export default SideBar
