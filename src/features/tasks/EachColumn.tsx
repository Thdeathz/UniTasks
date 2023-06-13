import React from 'react'
import { CheckOutlined, EllipsisOutlined } from '@ant-design/icons'
import { StrictModeDroppable as Droppable } from '~/helpers/StrictModeDroppable'
import { Draggable } from 'react-beautiful-dnd'
import TaskItem from './TaskItem'
import { Empty } from 'antd'

type PropsType = {
  id: StatusType
  tasks: TaskType[]
  index: number
  showHeader?: boolean
}

const columnTitle: {
  [key in StatusType]: string
} = {
  todo: 'TO DO',
  inprogress: 'IN PROGRESS',
  reviewing: 'REVIEWING',
  completed: 'COMPLETED'
}

const EachColumn = ({ id, tasks, index, showHeader }: PropsType) => {
  let backgroundColor = ''
  if (id === 'todo') backgroundColor = 'bg-todo'
  if (id === 'inprogress') backgroundColor = 'bg-inprogress'
  if (id === 'reviewing') backgroundColor = 'bg-reviewing'
  if (id === 'completed') backgroundColor = 'bg-completed'

  const title = (
    <p className={`${backgroundColor} text-sm font-semibold px-2 py-1 rounded-md w-max`}>
      {columnTitle[id]}
    </p>
  )

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          {title}

          <>
            {tasks?.length === 0 ? (
              <CheckOutlined className="text-checked" />
            ) : (
              <span className="border text-sm border-noneSelected px-1 font-semibold rounded-md">
                {tasks?.length}
              </span>
            )}
          </>
        </div>

        <EllipsisOutlined className="text-xl font-semibold text-noneSelected cursor-pointer hover:text-textHover transition-colors" />
      </div>

      <div className="h-[1.5px] bg-disabled rounded-full mt-2" />

      <Droppable droppableId={id} type="card">
        {(provided, snapshot) => (
          <ul
            className={`p-2 mt-4 shadow-sm rounded max-h-[83vh] hidden-scroll-bar overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-dragging' : 'bg-bgSecondary '
            }`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tasks?.length !== 0 ? (
              <>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={`mb-4`}
                        key={`each-task-${index}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskItem title={title} task={task} showHeader={showHeader} />
                      </div>
                    )}
                  </Draggable>
                ))}
              </>
            ) : (
              <Empty className="py-2" description={<span>No task found</span>} />
            )}
            <>{provided.placeholder}</>
          </ul>
        )}
      </Droppable>
    </div>
  )
}

export default EachColumn
