import React from 'react'
import { useParams } from 'react-router-dom'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import useProjectStore from '~/stores/ProjectStore'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import useBoardStore from '~/stores/BoardStore'

const ProjectCalendar = () => {
  const { projectId } = useParams()
  const [projects] = useProjectStore(state => [state.projects])
  const [board] = useBoardStore(state => [state.board])

  const columns = Array.from(board.columns.entries()).map(([id, column]) =>
    column.tasks
      .filter(each => each.projectId === projectId)
      .map(task => ({
        title: task.title,
        date: task.dueDate // Extracting the date part from the dueDate
      }))
  )

  return (
    <ProjectLayout projectId={projectId as string}>
      {columns.length !== 0 && (
        <FullCalendar
          viewClassNames={['h-[68%] px-3']}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={false}
          events={[...columns[0], ...columns[1], ...columns[2]]}
        />
      )}
    </ProjectLayout>
  )
}

export default ProjectCalendar
