import React, { useState, useRef } from 'react'
import {
  CalendarOutlined,
  MessageOutlined,
  PlusOutlined,
  RollbackOutlined
} from '@ant-design/icons'
import { useHover } from 'usehooks-ts'
import { motion } from 'framer-motion'
import useProjectStore from '~/stores/ProjectStore'
import useBoardStore from '~/stores/BoardStore'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import useCredentialStore from '~/stores/CredentialStore'
import SubTask from '~/components/SubTask'
import UserItem from '~/components/UserItem'
import TaskDetailModal from './TaskDetailModal'
import Tag from '~/components/Tag'

type PropsType = {
  title: React.ReactNode
  task: TaskType
  showHeader?: boolean
  disabled?: boolean
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

      <TaskDetailModal
        title={title}
        showHeader={showHeader}
        project={projects.get(task.projectId)}
        task={task}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}

export default TaskItem
