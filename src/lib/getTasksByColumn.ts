import { getDocument } from '~/firebase/services'

export const getTasksByColumn = async () => {
  const data = await getDocument({
    collectionName: 'tasks'
  })

  if (!data) return

  const returnTasks = (data as TaskType[]).sort((a, b) => a.priority - b.priority)

  const columns = returnTasks?.reduce((acc: Map<StatusType, Column>, task: TaskType) => {
    if (!acc.get(task.status)) {
      acc.set(task.status, {
        id: task.status,
        tasks: []
      })
    }

    acc.get(task.status)!.tasks.push({
      ...task,
      dueDate: task.dueDate.toDate(),
      createdAt: task.createdAt.toDate()
    })

    return acc
  }, new Map<StatusType, Column>())

  const columnTypes: StatusType[] = ['todo', 'inprogress', 'reviewing', 'completed']

  columnTypes.forEach((columnType: StatusType) => {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        tasks: []
      })
    }
  })

  const sortedColumns = new Map(
    [...columns.entries()].sort((a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0]))
  ) as Map<StatusType, Column>

  const board: Board = {
    columns: sortedColumns
  }

  return board
}
