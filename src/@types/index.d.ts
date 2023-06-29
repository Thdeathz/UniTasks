interface Board {
  columns: Map<StatusType, Column>
}

type Project = Map<string, ProjectType>

type StatusType = 'todo' | 'inprogress' | 'reviewing' | 'completed' | 'deleted'

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
  value: string
  isCompleted: boolean
}

type TaskType = {
  id: string
  projectId: string
  tags: TagType[]
  priority: number
  title: string
  description: string
  assignedUser: string[]
  dueDate: Date
  createdAt?: Date
  createdUser?: string
  subTasks: SubTaskType[]
  status: StatusType
}

type ProjectType = {
  id: string
  name: string
  description: string
  thumbnail: string
  bookmark: boolean
  members: string[]
  tags: string[]
}

type UserCredential = {
  uid: string
  email: string
  displayName: string
  avatar?: string
}

type FilePreview = File & { preview: string }

type Users = Map<string, UserCredential>

type NotificationType = {
  NO_ID_FIELD?: string
  id: string
  type: string
  receiver: string
  project?: ProjectType
  sender?: string
}

type CommentType = {
  NO_ID_FIELD?: string
  sender: string
  task: string
  value: string
  displayName: string
}

type UserPlan = {
  id: string
  title: string
  start: Date
  end: Date
  task: TaskType
}
