import React from 'react'
import DefaultLayout from './DefaultLayout'
import { Avatar, Breadcrumb, Button } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

type PropsType = {
  children: React.ReactNode
  projectName: string
}

const ProjectLayout = ({ children, projectName }: PropsType) => {
  const path = useLocation().pathname

  const isOverviewPage = path.includes('overview')
  const isTasksPage = path.includes('tasks')
  const isCalendarPage = path.includes('calendar')

  let title = ''
  if (isOverviewPage) title = 'Overview'
  if (isTasksPage) title = 'All tasks'
  if (isCalendarPage) title = 'Calendar'

  return (
    <DefaultLayout>
      <div className="flex flex-col justify-start items-start py-1 px-3 mb-2">
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <Breadcrumb
            items={[
              {
                title: projectName
              },
              {
                title
              }
            ]}
          />

          {isOverviewPage && (
            <>
              <p className="text-3xl font-semibold">{projectName}</p>

              <div className="w-full flex justify-between items-center">
                <Avatar.Group
                  maxCount={3}
                  maxPopoverTrigger="click"
                  maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
                >
                  <Avatar style={{ backgroundColor: '#f56a00' }}>BD</Avatar>
                  <Avatar style={{ backgroundColor: '#f56a00' }}>TL</Avatar>
                  <Avatar style={{ backgroundColor: '#f56a00' }}>TH</Avatar>
                  <Avatar style={{ backgroundColor: '#f56a00' }}>DN</Avatar>
                  <Avatar style={{ backgroundColor: '#f56a00' }}>DL</Avatar>
                </Avatar.Group>

                <Button
                  className="flex justify-center items-center text-textHover"
                  icon={<ShareAltOutlined />}
                >
                  Share
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </DefaultLayout>
  )
}

export default ProjectLayout
