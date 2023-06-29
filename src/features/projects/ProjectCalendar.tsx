import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import useBoardStore from '~/stores/BoardStore'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { columnTitle } from '~/app/config'
import useProjectStore from '~/stores/ProjectStore'
import { Tag, Tooltip } from 'antd'
import TaskDetailModal from '../tasks/TaskDetailModal'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const localizer = momentLocalizer(moment)

const DnDCalendar = withDragAndDrop(Calendar)

const ProjectCalendar = () => {
  const { projectId } = useParams()
  const [board] = useBoardStore(state => [state.board])

  const columns = Array.from(board.columns.entries()).map(([id, column]) =>
    column.tasks
      .filter(each => each?.projectId === projectId)
      .map(task => ({
        id: task.id,
        title: task.title,
        start: task.createdAt,
        end: task.dueDate
      }))
  )

  const components = {
    toolbar: (props: any) => {
      const navigate = (action: string) => props.onNavigate(action)

      return (
        <div className="flex justify-between items-center gap-2 mb-1">
          <span className="font-semibold text-xl">{props.label}</span>

          <span className="flex justify-center items-center gap-2">
            <Tooltip placement="bottom" arrow={false} title="prev">
              <button
                className="rounded-full p-1 hover:bg-borderLine hover:text-primary-5 transition-colors"
                type="button"
                onClick={() => navigate('PREV')}
              >
                <LeftOutlined className="flex justify-center items-center" />
              </button>
            </Tooltip>

            <Tooltip placement="bottom" arrow={false} title="next">
              <button
                className="rounded-full p-1 hover:bg-borderLine hover:text-primary-5 transition-colors"
                type="button"
                onClick={() => navigate('NEXT')}
              >
                <RightOutlined className="flex justify-center items-center" />
              </button>
            </Tooltip>

            <button
              className="rounded-md shadow-sm bg-primary-2 font-medium px-2 py-1 hover:bg-primary-5 hover:text-bgDefault transition-colors"
              type="button"
              onClick={() => navigate('TODAY')}
            >
              This month
            </button>
          </span>
        </div>
      )
    }
  }

  return (
    <ProjectLayout projectId={projectId as string}>
      {columns.length !== 0 && (
        <DnDCalendar
          className="p-3 h-projectCalendar rounded-md shadow-sm"
          localizer={localizer}
          components={components}
          events={[...columns[0], ...columns[1], ...columns[2]]}
          timeslots={1}
          step={60}
          defaultView="month"
          views={['month']}
          min={moment(`${moment().format('YYYY-MM-DD')} 0:00 AM`).toDate()}
          max={moment(`${moment().format('YYYY-MM-DD')} 11:00 PM`).toDate()}
          formats={{ dayHeaderFormat: date => moment(date).format('MMMM DD YYYY') }}
        />
      )}
    </ProjectLayout>
  )
}

export default ProjectCalendar
