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

const SideMenuItem = ({ icon, activedIcon, text, isOpen, path }: SideMenuItemProps) => {
  const navigate = useNavigate()

  const isActived =
    useLocation().pathname.slice(1) === path.slice(1) ||
    (useLocation().pathname === '/' && path === '/') ||
    (useLocation().pathname.slice(1) === 'calendar' && path === '/') ||
    (useLocation().pathname.slice(1).includes('project') && path === '/project')

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
        font-medium pl-3 border-l ml-3 pb-1 cursor-pointer text-noneSelected hover:text-borderHover 
      `}
      onClick={() => naivgate(`/project/${project.id}/overview`)}
    >
      {project.name}
    </button>
  )
}

const SideBar = () => {
  const navigate = useNavigate()
  const [isSideBarOpen, isSubMenuOpen, setIsSideBarOpen, setIsSubMenuOpen] = useBoardStore(
    state => [
      state.isSideBarOpen,
      state.isSubMenuOpen,
      state.setIsSideBarOpen,
      state.setIsSubMenuOpen
    ]
  )

  const [projects] = useProjectStore(state => [state.projects])

  return (
    <div
      className={`${
        isSideBarOpen ? 'w-52' : 'w-min'
      } flex flex-col justify-between items-start border-r-2 border-borderLine h-full`}
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

          <SideMenuItem
            isOpen={isSideBarOpen}
            icon={<ProjectOutlined className="text-xl flex justify-start items-center" />}
            activedIcon={<ProjectFilled className="text-xl flex justify-start items-center" />}
            text="Projects"
            path="/project"
          />

          {/* <div className="w-full">
            <div className="flex justify-between items-center w-full text-noneSelected">
              <Tooltip placement="right" title={!isSideBarOpen && 'Project'} arrow={false}>
                <button
                  className={`
                ${isSideBarOpen ? 'py-2 px-2' : 'py-2 px-4'}
                flex w-full justify-between font-medium items-center text-noneSelected rounded transition-colors hover:bg-primary-1`}
                  onClick={() => {
                    if (isSideBarOpen) setIsSubMenuOpen(!isSubMenuOpen)
                  }}
                >
                  <div className="flex justify-start items-center gap-2">
                    <ProjectOutlined className="text-xl flex justify-start items-center" />
                    <span className={`${!isSideBarOpen && 'hidden'} `}>Project</span>
                  </div>

                  {isSideBarOpen ? (
                    isSubMenuOpen ? (
                      <CaretUpOutlined />
                    ) : (
                      <CaretDownOutlined />
                    )
                  ) : (
                    <></>
                  )}
                </button>
              </Tooltip>
            </div>

            {isSideBarOpen && isSubMenuOpen && (
              <div className="flex w-full">
                <div className="flex flex-col justify-start items-start">
                  <>
                    {Array.from(projects.entries()).map(([id, project], index) => (
                      <SubMenuItem key={`each-project-${index}`} project={project} />
                    ))}
                  </>
                </div>
              </div>
            )}
          </div> */}

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
