import React from 'react'
import { useParams } from 'react-router-dom'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import useProjectStore from '~/stores/ProjectStore'

const ProjectOverview = () => {
  const { projectId } = useParams()
  const [projects] = useProjectStore(state => [state.projects])

  if (!projectId || !projects) return <></>

  return (
    <ProjectLayout projectName={projects.get(projectId)?.name as string}>
      <div className="bg-neutral-3 h-full py-2 px-3 flex justify-center items-center gap-2">
        <div className="basis-1/2 h-full bg-bgDefault rounded-md py-2 px-3 overflow-y-auto hidden-scroll-bar">
          x
        </div>
        <div className="basis-1/2 h-full flex flex-col justify-center items-center gap-2">
          <div className="w-full rounded-md bg-bgDefault py-2 px-3">y</div>
          <div className="w-full grow rounded-md bg-bgDefault py-2 px-3">y</div>
        </div>
      </div>
    </ProjectLayout>
  )
}

export default ProjectOverview
