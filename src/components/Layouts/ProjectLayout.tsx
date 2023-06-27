import React from 'react'
import DefaultLayout from './DefaultLayout'
import { Avatar, Breadcrumb, Button } from 'antd'
import { EditOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import projectThumbnail from '~/assets/project_thumbnail_demo.png'
import useProjectStore from '~/stores/ProjectStore'
import { AnimatePresence, motion } from 'framer-motion'
import SideBar from '../SideBar'
import NavBar from '../NavBar'
import useCredentialStore from '~/stores/CredentialStore'

type PropsType = {
  children: React.ReactNode
  projectId: string
}

const variants = {
  hidden: { opacity: 0, x: 0, y: 10 },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, type: 'easeOut', when: 'beforeChildren' }
  },
  exit: { opacity: 0, x: -0, y: -10 }
}

const ProjectLayout = ({ children, projectId }: PropsType) => {
  const path = useLocation().pathname
  const [projects] = useProjectStore(state => [state.projects])
  const [users] = useCredentialStore(state => [state.users])

  const isOverviewPage = path.includes('overview')
  const isTasksPage = path.includes('tasks')
  const isCalendarPage = path.includes('calendar')

  let title = ''
  if (isOverviewPage) title = 'Overview'
  if (isTasksPage) title = 'All tasks'
  if (isCalendarPage) title = 'Calendar'

  return (
    <AnimatePresence
      initial={true}
      onExitComplete={() => {
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 })
        }
      }}
    >
      <div className="flex justify-start items-start w-screen h-screen">
        <ToastContainer autoClose={2000} style={{ fontSize: '16px' }} />
        <SideBar />

        <div className="grow h-screen flex flex-col justify-start items-start overflow-hidden">
          <NavBar />

          <div className="w-full grow h-content">
            <div
              className={`px-3 ${isOverviewPage && ' min-h-[8rem] max-h-[8rem] '}`}
              style={
                isOverviewPage
                  ? {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backgroundImage: `url(${
                        projects.get(projectId as string)?.thumbnail as string
                      })`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundBlendMode: 'lighten'
                    }
                  : {}
              }
            >
              <div className="w-full flex flex-col justify-start items-start gap-2">
                <Breadcrumb
                  items={[
                    {
                      title: projects.get(projectId as string)?.name as string
                    },
                    {
                      title
                    }
                  ]}
                />

                {isOverviewPage && (
                  <>
                    <p className="text-3xl font-semibold">
                      {projects.get(projectId as string)?.name as string}
                    </p>

                    <div className="w-full flex justify-between items-center">
                      <Avatar.Group
                        maxCount={3}
                        maxPopoverTrigger="click"
                        maxStyle={{
                          color: '#f56a00',
                          backgroundColor: '#fde3cf',
                          cursor: 'pointer'
                        }}
                      >
                        {projects.get(projectId as string)?.members.map(member => (
                          <Avatar
                            src={users.get(member)?.avatar ?? null}
                            className="flex justify-center items-center text-sm"
                            style={{ backgroundColor: '#f56a00' }}
                            icon={<UserOutlined />}
                          />
                        ))}
                      </Avatar.Group>

                      <div className="flex justify-center items-center gap-2">
                        <Button
                          type="primary"
                          ghost
                          className="flex justify-center items-center"
                          icon={<EditOutlined />}
                        >
                          Edit
                        </Button>

                        <Button
                          type="primary"
                          ghost
                          className="flex justify-center items-center"
                          icon={<ShareAltOutlined />}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <motion.div
              className="relative h-full"
              initial="hidden"
              animate="enter"
              exit="exit"
              variants={variants}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default ProjectLayout
