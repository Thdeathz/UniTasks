import React from 'react'
import { useParams } from 'react-router-dom'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import useProjectStore from '~/stores/ProjectStore'

const ProjectCalendar = () => {
  const { projectId } = useParams()
  const [projects] = useProjectStore(state => [state.projects])

  if (!projectId || !projects) return <></>

  return (
    <ProjectLayout projectName={projects.get(projectId)?.name as string}>
      <div>ProjectCalendar</div>
    </ProjectLayout>
  )
}

export default ProjectCalendar
