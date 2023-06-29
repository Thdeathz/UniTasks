import React from 'react'
import { Modal, Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'
import { EditOutlined, TagOutlined } from '@ant-design/icons'
import useCredentialStore from '~/stores/CredentialStore'
import SubTask from '~/components/SubTask'
import ChatBox from '~/components/ChatBox'
import UserItem from '~/components/UserItem'
import Tag from '~/components/Tag'

type PropsType = {
  title: React.ReactNode
  showHeader?: boolean
  project?: ProjectType
  task: TaskType
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TaskDetailModal = ({ title, showHeader, project, task, isOpen, setIsOpen }: PropsType) => {
  const navigate = useNavigate()

  const [users] = useCredentialStore(state => [state.users])

  const isOutDate = new Date(task.dueDate).valueOf() - new Date().valueOf() < 0

  return (
    <Modal
      title={
        <div className="flex justify-start items-center h-full gap-2">
          {title}

          {showHeader && (
            <p
              className="font-medium text-textHover hover:text-primary-4 transition-colors cursor-pointer"
              onClick={() => navigate(`/project/${task.projectId}/tasks`)}
            >
              {project?.name}
            </p>
          )}

          {task?.createdAt && (
            <p className="font-medium text-noneSelected">
              Task created at:{' '}
              <span className="text-black">
                {new Intl.DateTimeFormat('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(task?.createdAt))}
              </span>
            </p>
          )}

          {task?.dueDate && (
            <p className="font-medium text-noneSelected">
              Due date:{' '}
              <span className={`${isOutDate ? 'text-danger' : 'text-black'}`}>
                {new Intl.DateTimeFormat('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(task?.dueDate))}
              </span>
            </p>
          )}
        </div>
      }
      style={{ top: 20 }}
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => setIsOpen(false)}
      width={950}
      footer={[<></>]}
    >
      <div className="flex justify-between items-start h-[75vh] overflow-hidden">
        <div className="basis-2/3 pr-2 h-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-start items-center gap-2">
              {task.tags?.map((tag, index) => (
                <Tag key={`tag-${index}`} type="custom" text={tag.name} color={tag.color} />
              ))}

              <Tooltip placement="bottom" title="New tag" arrow={false}>
                <button className="text-sm font-medium flex justify-center items-center gap-1 text-noneSelected border p-1 rounded-md border-disabled border-dashed hover:text-textHover hover:border-textHover transition-colors">
                  <TagOutlined />
                </button>
              </Tooltip>
            </div>

            <Tooltip placement="bottom" title="Edit task" arrow={false}>
              <EditOutlined className="cursor-pointer hover:text-textHover transition-colors text-lg text-noneSelected" />
            </Tooltip>
          </div>

          <p className="text-2xl font-semibold">{task.title}</p>

          <p>{task.description}</p>

          <div className="mb-1">
            <p className="text-lg font-semibold mb-1">Created by:</p>

            {task.createdUser && <UserItem size="large" user={users.get(task.createdUser)} />}
          </div>

          <div className="mb-1">
            <p className="text-lg font-semibold mb-1">Assigned to:</p>

            <div className="flex justify-start items-center gap-3">
              {task.assignedUser?.map((uid, index) => (
                <UserItem key={`assigned-user-${index}`} size="large" user={users.get(uid)} />
              ))}
            </div>
          </div>

          <div className="mb-1">
            <p className="text-lg font-semibold mb-1">To do:</p>

            <SubTask task={task} />
          </div>
        </div>

        <div className="basis-1/3 bg-bgSecondary h-full p-2 rounded-e flex flex-col items-start justify-start">
          <p className="font-semibold text-lg">Comments</p>
          <ChatBox task={task} />
        </div>
      </div>
    </Modal>
  )
}

export default TaskDetailModal
