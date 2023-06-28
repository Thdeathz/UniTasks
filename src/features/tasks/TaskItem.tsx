import React, { useState, useRef } from 'react'
import { Avatar, Modal, Tooltip } from 'antd'
import {
  CalendarOutlined,
  EditOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  RollbackOutlined,
  TagOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useHover } from 'usehooks-ts'
import { motion } from 'framer-motion'
import Tag from '~/components/Tag'
import useProjectStore from '~/stores/ProjectStore'
import ChatBox from '~/components/ChatBox'
import useBoardStore from '~/stores/BoardStore'
import { toast } from 'react-toastify'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import useCredentialStore from '~/stores/CredentialStore'
import SubTask from '~/components/SubTask'

type PropsType = {
  title: React.ReactNode
  task: TaskType
  showHeader?: boolean
  disabled?: boolean
}

type UserItemPropsType = {
  size: 'large' | 'small'
  user: UserCredential | undefined
}

const UserItem = ({ size, user }: UserItemPropsType) => {
  if (user)
    return (
      <div className="flex justify-start items-center gap-1">
        <Avatar
          className="flex justify-center items-center"
          src={user.avatar ?? null}
          size={size === 'large' ? 24 : 20}
          icon={<UserOutlined className={`${size === 'small' && 'text-xm'}`} />}
        />
        <span className={size === 'large' ? 'font-normal text-base' : 'text-sm'}>
          {user.displayName}
        </span>
      </div>
    )

  return <></>
}

const TaskItem = ({ title, task, showHeader, disabled }: PropsType) => {
  const navigate = useNavigate()

  const [projects] = useProjectStore(state => [state.projects])
  const [rollBackTaskInDB] = useBoardStore(state => [state.rollBackTaskInDB])
  const [users] = useCredentialStore(state => [state.users])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isHover = useHover(cardRef)
  const isOutDate = new Date(task.dueDate).valueOf() - new Date().valueOf() < 0

  const handleTaskItemClick = () => {
    if (disabled) {
      rollBackTaskInDB(task)
      toast.success('Rollback task successfully', {
        toastId: 'rollback-task'
      })
      return
    }

    setIsOpen(true)
    return
  }

  return (
    <>
      <div
        className={`${
          (task.status === 'todo' || task.status === 'inprogress') && isOutDate
            ? 'bg-dust-red-2'
            : 'bg-bgDefault'
        } rounded-md shadow cursor-pointer hover:shadow-lg transition-shadow relative`}
        onClick={handleTaskItemClick}
        ref={cardRef}
      >
        {showHeader && (
          <div className="font-medium text-textHover border-b w-full border-disabled px-2 py-1">
            {projects?.get(task.projectId)?.name}
          </div>
        )}
        <div className="flex flex-col justify-start items-start w-full p-2 gap-2">
          <div className="flex justify-between items-center w-full">
            <div className="grow flex justify-start items-center gap-2 w-full">
              {task.tags?.slice(0, 2)?.map((tag, index) => (
                <Tag key={`tag-${index}`} type="custom" text={tag.name} color={tag.color} />
              ))}
              <>
                {task.tags.length > 2 && (
                  <p className="flex justify-center items-center text-sm text-noneSelected border border-dashed rounded-md px-1">
                    <PlusOutlined className="text-xs flex items-center justify-center" />
                    {task.tags.length - 2}
                  </p>
                )}
              </>
            </div>
          </div>

          <p className="font-semibold text-lg">{task.title}</p>

          <div className="flex justify-start items-center gap-2">
            {task.assignedUser?.slice(0, 2)?.map((uid, index) => (
              <UserItem key={`assigned-user-${uid}-${index}`} size="small" user={users.get(uid)} />
            ))}
            {task.assignedUser.length > 2 && (
              <span className="border-dashed border border-disabled rounded-full text-sm font-medium text-noneSelected w-[24px] h-[24px] flex justify-center items-center">
                <PlusOutlined className="text-xs flex items-center justify-center" />
                {task.assignedUser.length - 2}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="flex justify-center items-center gap-1 text-sm text-noneSelected font-medium">
              <MessageOutlined />
              <span>2</span>
            </p>

            {task?.dueDate && (
              <p className="flex justify-center items-center gap-1 text-sm text-noneSelected font-medium">
                <CalendarOutlined />
                <span>{new Intl.DateTimeFormat('en-GB').format(new Date(task?.dueDate))}</span>
              </p>
            )}
          </div>
        </div>

        {disabled && isHover && (
          <motion.div
            className="w-full h-cardBody bg-disabled absolute bottom-0 rounded-b-md flex flex-col gap-1 justify-center text-bgDefault items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <RollbackOutlined className="font-bold flex justify-center items-center text-2xl hover:scale-125 transition-transform" />
            <p>Roll back</p>
          </motion.div>
        )}
      </div>

      <Modal
        title={
          <div className="flex justify-start items-center h-full gap-2">
            {title}

            {showHeader && (
              <p
                className="font-medium text-textHover hover:text-primary-4 transition-colors cursor-pointer"
                onClick={() => navigate(`/project/${task.projectId}/tasks`)}
              >
                {projects?.get(task.projectId)?.name}
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
    </>
  )
}

export default TaskItem
