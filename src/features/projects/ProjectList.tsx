import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import DefaultLayout from '~/components/Layouts/DefaultLayout'
import { Avatar, Switch, Tooltip } from 'antd'
import HomeLayout from '~/components/Layouts/HomeLayout'
import useProjectStore from '~/stores/ProjectStore'
import { useNavigate } from 'react-router-dom'

type ProjectItemPropsType = {
  project: ProjectType
}

const ProjectItem = ({ project }: ProjectItemPropsType) => {
  const navigate = useNavigate()

  return (
    <button
      className="bg-bgDefault h-[18vh] rounded-md shadow-md p-4 gap-4 hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/project/${project.id}/overview`)}
    >
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold">{project.name}</p>

        <Tooltip>
          <Switch checkedChildren="show" unCheckedChildren="hidden" defaultChecked />
        </Tooltip>
      </div>

      <div className="flex justify-between items-center">
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
      </div>
    </button>
  )
}

const ProjectList = () => {
  const [projects] = useProjectStore(state => [state.projects])

  return (
    <HomeLayout>
      <div className="bg-neutral-3 h-full p-4 grid grid-cols-3 gap-4 auto-rows-min">
        <div className="cursor-pointer hover:text-textHover hover:border-textHover transition-colors rounded-md h-[18vh] flex flex-col gap-2 justify-center items-center text-noneSelected border border-dashed border-noneSelected">
          <PlusOutlined className="text-3xl flex justify-center items-center" />
          <p className="text-xl font-medium">Create new project</p>
        </div>

        {Array.from(projects.entries()).map(([id, project]) => (
          <ProjectItem key={id} project={project} />
        ))}
      </div>
    </HomeLayout>
  )
}

export default ProjectList
