import React from 'react'
import { BellOutlined } from '@ant-design/icons'
import { Badge, Popconfirm, Popover, Tooltip } from 'antd'
import { query, collection, where } from 'firebase/firestore'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import useCredentialStore from '~/stores/CredentialStore'
import useProjectStore from '~/stores/ProjectStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteDocument } from '~/firebase/services'

const Notifications = () => {
  const navigate = useNavigate()

  const [credential, users] = useCredentialStore(state => [state.credential, state.users])
  const [projects, joinProject] = useProjectStore(state => [state.projects, state.joinProject])
  const { data: messagesList } = useFirestoreCollectionData(
    query(collection(useFirestore(), 'notifications'), where('receiver', '==', credential.uid))
  )

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      arrow={false}
      content={
        <div className="min-w-[18rem] max-w-[18rem] overflow-hidden flex flex-col justify-start items-start gap-1">
          <p className="text-base font-semibold">🔔Notifications</p>
          <div className="w-full">
            {(messagesList as NotificationType[])?.map(message => {
              if (message.type === 'project-invite')
                return (
                  <Popconfirm
                    key={message.NO_ID_FIELD}
                    title="Accept the invitation"
                    description="Do you want to accept the invitation to join this project?"
                    onConfirm={() => {
                      joinProject(
                        message.project as ProjectType,
                        credential.uid,
                        message.NO_ID_FIELD as string
                      )
                      navigate(`/project/${message.project?.id}/overview`)
                      toast.success('You have joined the project.', {
                        toastId: 'join-project-success',
                        icon: '🎉'
                      })
                    }}
                    okText="Accept"
                    cancelText="Reject"
                  >
                    <button className="px-2 py-2 hover:bg-primary-1 rounded-md w-full flex justify-start items-center gap-2 transition-colors mb-1">
                      <img
                        src={message.project?.thumbnail}
                        className="w-[2rem] aspect-square rounded-md object-cover"
                        alt="project-thumbnail"
                      />

                      <div className="flex flex-col justify-start items-start gap-1">
                        <p className="leading-none text-base font-medium truncate">
                          {message.project?.name}
                        </p>
                        <p className="leading-none text-sm text-noneSelected">
                          You have an invitation to join 👋
                        </p>
                      </div>
                    </button>
                  </Popconfirm>
                )

              if (message.type === 'new-task' && message.sender && message.project)
                return (
                  <button
                    key={message.NO_ID_FIELD}
                    className="px-2 py-2 hover:bg-primary-1 rounded-md w-full flex justify-start items-center gap-2 transition-colors mb-1"
                    onClick={async () => {
                      await deleteDocument({
                        collectionName: `notifications/${message.NO_ID_FIELD}`
                      })
                      navigate(`/project/${message.project?.id}/tasks`)
                    }}
                  >
                    <div className="flex flex-col justify-start items-start gap-1">
                      <p className="leading-none text-base font-medium truncate">
                        {projects.get(message.project.id)?.name}
                      </p>
                      <p className="leading-none text-sm text-noneSelected">
                        {users.get(message.sender)?.displayName} has assigned you a new task 🎉
                      </p>
                    </div>
                  </button>
                )
            })}

            {(!messagesList || (messagesList as NotificationType[])?.length === 0) && (
              <p className="text-disabled">There is no unread notice.</p>
            )}
          </div>
        </div>
      }
    >
      <Tooltip placement="bottom" title="Notifications" arrow={false}>
        <button className="py-1">
          <Badge size="small" count={messagesList?.length ?? 0}>
            <BellOutlined className="text-2xl flex justify-center items-center text-noneSelected cursor-pointer hover:text-textHover transition-colors" />
          </Badge>
        </button>
      </Tooltip>
    </Popover>
  )
}

export default Notifications
