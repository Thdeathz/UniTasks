import React, { useState } from 'react'
import { Avatar, Modal, Tooltip } from 'antd'
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SendOutlined,
  TagOutlined,
  UserOutlined
} from '@ant-design/icons'
import Tag from '~/components/Tag'
import SubTask from '~/components/SubTask'
import useBoardStore from '~/stores/BoardStore'
import { showDeleteConfirm } from '~/components/ComfirmModal'
import useProjectStore from '~/stores/ProjectStore'

type PropsType = {
  title: React.ReactNode
  task: TaskType
  showHeader?: boolean
}

type UserItemPropsType = {
  size: 'large' | 'small'
  name: string
}

const UserItem = ({ size, name }: UserItemPropsType) => {
  return (
    <div className="flex justify-start items-center gap-1">
      <Avatar
        className="flex justify-center items-center"
        size={size === 'large' ? 24 : 20}
        icon={<UserOutlined />}
      />
      <span className={size === 'large' ? 'font-normal text-base' : 'text-sm'}>{name}</span>
    </div>
  )
}

const TaskItem = ({ title, task, showHeader }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [board, setBoardState, deleteTaskInDB] = useBoardStore(state => [
    state.board,
    state.setBoardState,
    state.deleteTaskInDB
  ])

  const [projects] = useProjectStore(state => [state.projects])

  return (
    <>
      <div
        className="bg-bgDefault rounded-md shadow cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        {showHeader && (
          <p className="font-medium text-textHover border-b w-full border-disabled px-2 py-1">
            {projects?.get(task.projectId)?.name}
          </p>
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
            {task.assignedUser?.slice(0, 2)?.map((user, index) => (
              <UserItem key={`assigned-user-${index}`} size="small" name={user as string} />
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
      </div>

      <Modal
        title={
          <div className="flex justify-start items-center h-full gap-2">
            {title}

            {showHeader && (
              <p className="font-medium text-textHover">{projects?.get(task.projectId)?.name}</p>
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
                <span className="text-black">
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
        <div className="flex justify-between items-start h-[75vh] overflow-y-auto custom-scroll-bar">
          <div className="basis-2/3 flex flex-col justify-start items-start gap-1 pr-2">
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-start items-center gap-2">
                {task.tags?.map((tag, index) => (
                  <Tag key={`tag-${index}`} type="custom" text={tag.name} color={tag.color} />
                ))}

                <Tooltip placement="bottom" title="New tag">
                  <button className="text-sm font-medium flex justify-center items-center gap-1 text-noneSelected border p-1 rounded-md border-disabled border-dashed hover:text-textHover hover:border-textHover transition-colors">
                    <TagOutlined />
                  </button>
                </Tooltip>
              </div>

              <Tooltip placement="bottom" title="Edit task">
                <EditOutlined className="cursor-pointer hover:text-textHover transition-colors text-lg text-noneSelected" />
              </Tooltip>
            </div>

            <p className="text-2xl font-semibold">{task.title}</p>

            <p>{task.description}</p>

            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Created by:</p>

              <UserItem size="large" name={task.createdUser?.name as string} />
            </div>

            <div className="w-full">
              <p className="text-lg font-semibold mb-1">Assigned to:</p>

              <div className="flex justify-start items-center gap-3">
                {task.assignedUser?.map((user, index) => (
                  <UserItem key={`assigned-user-${index}`} size="large" name={user as string} />
                ))}

                <Tooltip placement="bottom" title="New user">
                  <PlusCircleOutlined className="cursor-pointer text-lg text-noneSelected hover:text-textHover transition-colors flex justify-center items-center" />
                </Tooltip>
              </div>
            </div>

            <div className="w-full">
              <p className="text-lg font-semibold mb-1">To do:</p>

              <SubTask subTasks={task.subTasks} />
            </div>
          </div>

          <div className="basis-1/3 bg-bgSecondary h-full p-2 rounded-e flex flex-col items-start justify-start">
            <p className="font-semibold text-lg">Comments</p>
            <div className="grow flex flex-col justify-start items-start gap-3 mt-2">
              <div className="bg-bgDefault py-1 px-2 rounded-tl-xl rounded-e-xl max-w-[90%]">
                <p className="font-semibold">Duc Luong</p>
                <p>Task này to quá ko mn :(( t nghĩ nên chia nhỏ hơn nữa</p>
              </div>

              <div className="bg-textHover text-bgDefault py-1 px-2 rounded-s-xl rounded-tr-xl max-w-[90%] self-end">
                <p>Ngon :))</p>
              </div>
            </div>
            <div className="w-full flex justify-center items-center bg-bgDefault py-2 px-3 rounded-md gap-2">
              <input
                className="border-none outline-none grow bg-trans"
                placeholder="Your comment..."
              />
              <SendOutlined className="cursor-pointer text-noneSelected hover:text-textHover transition-colors" />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TaskItem
