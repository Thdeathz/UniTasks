import { create } from 'zustand'
import { deleteDocument } from '~/firebase/services'
import { addDocument, updateDocument } from '~/firebase/services'
import { getTasksByColumn } from '~/lib/getTasksByColumn'

interface IBoardState {
  board: Board
  isSideBarOpen: boolean
  isSubMenuOpen: boolean
  setIsSideBarOpen: (currentSideBarState: boolean) => void
  setIsSubMenuOpen: (currentSubMenuState: boolean) => void
  getBoard: () => void
  setBoardState: (board: Board) => void
  addNewTaskInDB: (task: TaskType) => void
  updateTaskStatusInDB: (taskMovedId: string, tasks: TaskType[], status: StatusType) => void
  updatePriorityInDB: (tasks: TaskType[]) => void
  deleteTaskInDB: (task: TaskType) => void
  rollBackTaskInDB: (task: TaskType) => void
}

const useBoardStore = create<IBoardState>(set => ({
  board: {
    columns: new Map<StatusType, Column>()
  },

  isSideBarOpen: true,

  isSubMenuOpen: false,

  setIsSideBarOpen: nextSideBarState => set({ isSideBarOpen: nextSideBarState }),

  setIsSubMenuOpen: nextSubMenuState => set({ isSubMenuOpen: nextSubMenuState }),

  getBoard: async () => {
    const board = await getTasksByColumn()
    set({ board })
  },

  setBoardState: board => set({ board }),

  updateTaskStatusInDB: async (taskMovedId, tasks, status) => {
    tasks.forEach(async (task, index) => {
      if (taskMovedId === task.id) {
        await updateDocument({
          collectionName: `tasks/${taskMovedId}`,
          data: { status, priority: index }
        })
        return
      }
      await updateDocument({
        collectionName: `tasks/${task.id}`,
        data: { priority: index }
      })
    })
  },

  updatePriorityInDB: async tasks => {
    tasks.forEach(async (task, index) => {
      await updateDocument({
        collectionName: `tasks/${task.id}`,
        data: { priority: index }
      })
    })
  },

  addNewTaskInDB: async task => {
    await addDocument({
      collectionName: 'tasks',
      id: task.id,
      data: { ...task, priority: -1 }
    })

    set(state => {
      const newCols = new Map(state.board.columns)

      const newTask: TaskType = {
        id: task.id,
        projectId: task.projectId,
        tags: task.tags,
        priority: -1,
        title: task.title,
        description: task.description,
        assignedUser: task.assignedUser,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        createdUser: task.createdUser,
        subTasks: task.subTasks,
        status: task.status
      }

      const todoCol = newCols.get('todo')

      if (!todoCol) {
        newCols.set('todo', {
          id: 'todo',
          tasks: [newTask]
        })
      } else {
        newCols.get('todo')?.tasks.unshift(newTask)
      }

      return {
        board: {
          columns: newCols
        }
      }
    })
  },

  deleteTaskInDB: async task => {
    await updateDocument({
      collectionName: `tasks/${task.id}`,
      data: { status: 'deleted' }
    })

    set(state => {
      const newCols = new Map(state.board.columns)

      const newTask = { ...task, status: 'deleted' } as TaskType

      const deletedCol = newCols.get('deleted')

      if (!deletedCol) {
        newCols.set('deleted', {
          id: 'deleted',
          tasks: [newTask]
        })
      } else {
        newCols.get('deleted')?.tasks.unshift(newTask)
      }

      return {
        board: {
          columns: newCols
        }
      }
    })
  },

  rollBackTaskInDB: async task => {
    await updateDocument({
      collectionName: `tasks/${task.id}`,
      data: { status: 'todo' }
    })

    set(state => {
      const newCols = new Map(state.board.columns)

      const newTask = { ...task, status: 'todo', priority: 0 } as TaskType

      const todoCol = newCols.get('todo')

      if (!todoCol) {
        newCols.set('todo', {
          id: 'todo',
          tasks: [newTask]
        })
      } else {
        newCols.get('todo')?.tasks.unshift(newTask)
      }

      newCols.get('deleted')?.tasks.splice(task.priority, 1)

      return {
        board: {
          columns: newCols
        }
      }
    })
  }
}))

export default useBoardStore
