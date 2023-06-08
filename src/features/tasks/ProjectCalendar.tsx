import { Calendar } from 'antd'
import React from 'react'
import ProjectLayout from '~/components/Layouts/ProjectLayout'

const ProjectCalendar = () => {
  return (
    <ProjectLayout projectName="Bài tập lớn UI/UX">
      <Calendar className="w-full h-full overflow-y-auto" />
    </ProjectLayout>
  )
}

export default ProjectCalendar
