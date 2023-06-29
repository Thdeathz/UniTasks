import React, { useState } from 'react'
import useBoardStore from '~/stores/BoardStore'
import useCredentialStore from '~/stores/CredentialStore'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import HomeLayout from '~/components/Layouts/HomeLayout'
import TaskItem from '../tasks/TaskItem'
import { columnTitle } from '~/app/config'
import { useEventCallback } from 'usehooks-ts'
import useProjectStore from '~/stores/ProjectStore'
import { Empty, Tag, Tooltip } from 'antd'
import TaskDetailModal from '../tasks/TaskDetailModal'
import { useNavigate } from 'react-router-dom'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'

const localizer = momentLocalizer(moment)

const DnDCalendar = withDragAndDrop(Calendar)

const MyCalendar = () => {
  const [board] = useBoardStore(state => [state.board])
  const [credential, userPlan, setUserPlan, updateUserPlan] = useCredentialStore(state => [
    state.credential,
    state.userPlan,
    state.setUserPlan,
    state.updateUserPlan
  ])
  const [projects] = useProjectStore(state => [state.projects])

  const [draggedEvent, setDraggedEvent] = useState<TaskType | null>(null)

  const components = {
    event: (props: any) => {
      const { event } = props
      if (!event) return <></>

      const [isOpen, setIsOpen] = useState<boolean>(false)

      const { task } = event as UserPlan

      const project = projects.get(task.projectId)

      const title = (
        <p
          className={`${
            columnTitle[task.status].bgColor
          } text-sm font-semibold px-2 py-1 rounded-md w-max`}
        >
          {columnTitle[task.status].title}
        </p>
      )

      return (
        <>
          <button
            className="w-full h-full bg-primary-2 p-1 shadow-sm hover:bg-primary-3 transition-colors text-sm font-semibold text-start relative"
            onClick={() => project && setIsOpen(true)}
          >
            {project && <p className="text-primary-8">{project.name}</p>}

            <p className="text-black ">{task.title}</p>

            {task.tags?.length > 0 &&
              task.tags.map((tag, index) => (
                <Tag key={`tag-${index}`} color={tag.color}>
                  {tag.name}
                </Tag>
              ))}
          </button>

          {project && (
            <TaskDetailModal
              title={title}
              project={project}
              task={task}
              isOpen={isOpen}
              showHeader={true}
              setIsOpen={setIsOpen}
            />
          )}
        </>
      )
    },
    toolbar: (props: any) => {
      const navigate = (action: string) => props.onNavigate(action)
      const selectSlot = (slotInfo: string) => props.onView(slotInfo)

      return (
        <div className="flex justify-between items-center gap-2 mb-2">
          <span className="flex justify-center items-center gap-2 py-1">
            <button
              className="rounded-md shadow-sm bg-primary-2 font-medium px-2 py-1 hover:bg-primary-5 hover:text-bgDefault transition-colors"
              type="button"
              onClick={() => navigate('TODAY')}
            >
              Today
            </button>

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
          </span>

          <span className="font-semibold text-lg">{props.label}</span>

          <div className="flex justify-center items-center gap-2 bg-neutral-3 shadow-sm p-1 rounded-md">
            {props.views.map((view: string) => (
              <button
                className={`px-4 py-1 rounded shadow-sm font-medium text-base capitalize ${
                  props.view === view && 'bg-bgDefault'
                }`}
                key={view}
                type="button"
                onClick={() => selectSlot(view)}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      )
    }
  }

  const onChangeEventTime = useEventCallback((start: Date, end: Date, event: UserPlan) => {
    const updatedPlan = {
      ...event,
      start,
      end
    } as UserPlan

    updateUserPlan(updatedPlan)
    console.log(start, end, event)
  })

  const onDropFromOutside = useEventCallback((start: Date, end: Date) => {
    if (!draggedEvent) return

    const newPlan = {
      id: draggedEvent.id,
      title: draggedEvent.title,
      task: draggedEvent,
      start,
      end
    } as UserPlan

    setUserPlan(credential.uid, newPlan)
    setDraggedEvent(null)
  })

  const onDragStart = useEventCallback((event: TaskType) => setDraggedEvent(event))

  return (
    <HomeLayout>
      <div className="flex h-profile justify-between gap-3 relative">
        <div className="rounded-md w-1/5 h-full overflow-y-auto relative">
          <p className="bg-bgDefault mb-2 shadow-sm rounded-md px-2 py-2 font-medium sticky top-0 z-50">
            Need to do task
          </p>

          {board.columns
            .get('inprogress')
            ?.tasks.filter(
              task =>
                !Array.from(userPlan.values()).some(each => each.task.id === task.id) &&
                task.assignedUser.includes(credential.uid)
            )
            .map((task, index) => (
              <div
                key={`my-todo-task-${index}`}
                className="mb-2"
                draggable="true"
                onDragStart={() => {
                  onDragStart(task)
                }}
              >
                <TaskItem
                  title={
                    <p
                      className={`${
                        columnTitle[task.status].bgColor
                      } text-sm font-semibold px-2 py-1 rounded-md w-max`}
                    >
                      {columnTitle[task.status].title}
                    </p>
                  }
                  task={task}
                  showHeader={true}
                />
              </div>
            ))}

          {board.columns
            .get('inprogress')
            ?.tasks.filter(
              task =>
                !Array.from(userPlan.values()).some(each => each.task.id === task.id) &&
                task.assignedUser.includes(credential.uid)
            ).length === 0 && <Empty />}
        </div>

        <DnDCalendar
          className="p-3 w-4/5 overflow-y-auto bg-bgDefault rounded-md shadow-sm"
          localizer={localizer}
          components={components as any}
          events={Array.from(userPlan.values()).filter(each =>
            board.columns.get('inprogress')?.tasks.some(task => task.id === each.task.id)
          )}
          timeslots={2}
          step={60}
          defaultView="day"
          views={['day', 'week', 'month', 'agenda']}
          resizable
          min={moment(`${moment().format('YYYY-MM-DD')} 0:00`).toDate()}
          max={moment(`${moment().format('YYYY-MM-DD')} 23:59`).toDate()}
          formats={{ dayHeaderFormat: date => moment(date).format('LL') }}
          toolbar={toolbar as any}
          onEventDrop={({ start, end, event }) =>
            onChangeEventTime(
              new Date(start.toString()),
              new Date(end.toString()),
              event as UserPlan
            )
          }
          onEventResize={({ start, end, event }) =>
            onChangeEventTime(
              new Date(start.toString()),
              new Date(end.toString()),
              event as UserPlan
            )
          }
          onDropFromOutside={({ start, end }) =>
            onDropFromOutside(new Date(start.toString()), new Date(end.toString()))
          }
        />
      </div>
    </HomeLayout>
  )
}

export default MyCalendar
