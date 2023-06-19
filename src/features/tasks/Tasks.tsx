import React, { useState } from 'react'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import useBoardStore from '~/stores/BoardStore'
import EachColumn from './EachColumn'
import CreateTask from './CreateTask'
import { useParams } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { StrictModeDroppable as Droppable } from '~/helpers/StrictModeDroppable'
import { toast } from 'react-toastify'

const Tasks = () => {
  const { projectId } = useParams()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [board, setBoardState, updateTaskStatusInDB, updatePriorityInDB, deleteTaskInDB] =
    useBoardStore(state => [
      state.board,
      state.setBoardState,
      state.updateTaskStatusInDB,
      state.updatePriorityInDB,
      state.deleteTaskInDB
    ])

  const handleOnDragEnd: OnDragEndResponder = async result => {
    const { source, destination } = result

    if (!destination) return

    if (destination.droppableId === 'delete') {
      const startCol = board.columns.get(source.droppableId as StatusType)
      if (!startCol) return

      const newTasks = [...startCol.tasks]
      const [deleteTask] = newTasks.splice(source.index, 1)

      const newCols = new Map(board.columns)
      newCols.set(startCol.id, {
        id: startCol.id,
        tasks: newTasks
      })

      setBoardState({ ...board, columns: newCols })
      deleteTaskInDB(deleteTask)
      toast.warning('You just delete a task !', {
        toastId: 99
      })
      return
    }

    const startCol = board.columns.get(source.droppableId as StatusType)
    const finishCol = board.columns.get(destination.droppableId as StatusType)

    if (!startCol || !finishCol) return

    const newTasks = [...startCol.tasks]
    const [taskMoved] = newTasks.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      // Same column drag
      newTasks.splice(destination.index, 0, taskMoved)

      const newCol = new Map(board.columns)
      newCol.set(startCol.id, {
        id: startCol.id,
        tasks: newTasks
      })

      // update to firestore
      updatePriorityInDB(newTasks)

      setBoardState({ ...board, columns: newCol })
    } else {
      // Drag to another column
      const finishTasks = Array.from(finishCol.tasks)
      finishTasks.splice(destination.index, 0, taskMoved)

      const newCol = new Map(board.columns)
      newCol.set(startCol.id, {
        id: startCol.id,
        tasks: newTasks
      })
      newCol.set(finishCol.id, {
        id: finishCol.id,
        tasks: finishTasks
      })

      // update to firestore
      updateTaskStatusInDB(taskMoved.id, finishTasks, finishCol.id)

      setBoardState({ ...board, columns: newCol })
    }
  }

  return (
    <ProjectLayout projectId={projectId as string}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="grid grid-cols-4 gap-3 my-2 px-3 h-max">
          {Array.from(board.columns.entries()).map(([id, column], index) => {
            if (id !== 'deleted')
              return (
                <EachColumn
                  index={index}
                  key={id}
                  id={id}
                  tasks={column.tasks.filter(task => task.projectId === projectId)}
                />
              )
          })}
        </div>

        <Droppable droppableId="delete" type="card">
          {(provided, snapshot) => (
            <>
              <button
                className={`
                  ${
                    isOpen
                      ? 'w-[20vw] h-[23vh] rounded-md text-3xl'
                      : 'text-lg w-[40px] h-[40px] rounded-full'
                  }
                  ${snapshot.isDraggingOver ? 'bg-dust-red-5' : 'bg-dust-red-3'}
                  text-bgDefault hover:text-dust-red-5 hover:opacity-90 transition-all duration-200
                  absolute bottom-24 right-6 z-50 flex flex-col justify-center items-center cursor-pointer shadow-md
                `}
                onClick={() => setIsOpen(!isOpen)}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <DeleteOutlined />
                {isOpen && (
                  <motion.span
                    className="text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    Drop here to delete task
                  </motion.span>
                )}
              </button>
              <>{provided.placeholder}</>
            </>
          )}
        </Droppable>
      </DragDropContext>

      <CreateTask projectId={projectId as string} />
    </ProjectLayout>
  )
}

export default Tasks
