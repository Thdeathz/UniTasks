interface Board {
  columns: Map<StatusType, Column>
}

type Project = Map<string, ProjectType>

type StatusType = 'todo' | 'inprogress' | 'reviewing' | 'completed'

interface Column {
  id: StatusType
  tasks: TaskType[]
}

type TagType = {
  name: string
  color: string
}

type UserType = {
  id?: string
  avatar?: string
  name?: string
}

type SubTaskType = {
  id?: string
  title: string
  status: boolean
}

type TaskType = {
  id: string
  projectId: string
  tags: TagType[]
  priority: number
  title: string
  description: string
  assignedUser: string[]
  dueDate: Timestamp
  createdAt?: Timestamp
  createdUser?: UserType
  subTasks: SubTaskType[]
  status: StatusType
}

type ProjectType = {
  id: string
  name: string
  description: string
}
