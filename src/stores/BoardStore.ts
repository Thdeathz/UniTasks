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
  setCompletedSubTask: (task: TaskType, subTasks: SubTaskType[]) => void
}

const useBoardStore = create<IBoardState>(set => ({
  board: {
    columns: new Map<StatusType, Column>()
  },

  isSideBarOpen: window.localStorage.getItem('isSideBarOpen') === 'true',

  isSubMenuOpen: false,

  setIsSideBarOpen: nextSideBarState => {
    window.localStorage.setItem('isSideBarOpen', String(nextSideBarState))

    set({ isSideBarOpen: nextSideBarState })
  },

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

    task.assignedUser.forEach(async user => {
      await addDocument({
        collectionName: 'notifications',
        data: {
          receiver: user,
          type: 'new-task',
          project: {
            id: task.projectId
          },
          sender: task.createdUser
        }
      })
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
    set(state => {
      const newCols = new Map(state.board.columns)

      const newTask = { ...task, status: 'todo', priority: 0 } as TaskType

      const todoCol = newCols.get('todo')
      const deletedCol = newCols.get('deleted')

      if (!todoCol) {
        newCols.set('todo', {
          id: 'todo',
          tasks: [newTask]
        })
      } else {
        newCols.get('todo')?.tasks.unshift(newTask)
      }

      if (!deletedCol) {
        newCols.set('deleted', {
          id: 'deleted',
          tasks: []
        })
      } else {
        const deletedTask = newCols.get('deleted')?.tasks.filter(t => t.id !== task.id)
        newCols.set('deleted', {
          id: 'deleted',
          tasks: deletedTask as TaskType[]
        })
      }

      return {
        board: {
          columns: newCols
        }
      }
    })

    await updateDocument({
      collectionName: `tasks/${task.id}`,
      data: { status: 'todo' }
    })
  },

  setCompletedSubTask: async (task, subTasks) => {
    await updateDocument({
      collectionName: `tasks/${task.id}`,
      data: { subTasks }
    })

    set(state => {
      const newCols = new Map(state.board.columns)

      const newTaskCol = newCols.get(task.status)

      if (!newTaskCol) {
        newCols.set(task.status, {
          id: task.status,
          tasks: [{ ...task, subTasks }]
        })
      } else {
        const newTasks = Array.from(
          newTaskCol.tasks.map(t => (t.id === task.id ? { ...task, subTasks } : t))
        )

        newCols.set(task.status, {
          id: task.status,
          tasks: newTasks
        })
      }

      return {
        board: {
          columns: newCols
        }
      }
    })
  }
}))

export default useBoardStore
