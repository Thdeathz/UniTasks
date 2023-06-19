import React from 'react'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import useBoardStore from '~/stores/BoardStore'
import EachColumn from './EachColumn'
import DefaultLayout from '~/components/Layouts/DefaultLayout'

const MyTasks = () => {
  const [board, setBoardState, updateTaskStatusInDB, updatePriorityInDB] = useBoardStore(state => [
    state.board,
    state.setBoardState,
    state.updateTaskStatusInDB,
    state.updatePriorityInDB
  ])

  const handleOnDragEnd: OnDragEndResponder = async result => {
    const { source, destination } = result

    if (!destination) return

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
    <DefaultLayout>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="grid grid-cols-4 gap-3 my-2 px-3 h-max">
          {Array.from(board.columns.entries()).map(([id, column], index) => {
            if (id !== 'deleted')
              return (
                <EachColumn
                  index={index}
                  key={id}
                  id={id}
                  tasks={column.tasks.filter(each => each.assignedUser.includes('Bui Dung'))}
                  showHeader={true}
                />
              )
          })}
        </div>
      </DragDropContext>
    </DefaultLayout>
  )
}

export default MyTasks
