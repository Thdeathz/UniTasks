import React, { useEffect, useRef } from 'react'
import SendComment from './SendComment'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import { collection, limit, orderBy, query, where } from 'firebase/firestore'
import useCredentialStore from '~/stores/CredentialStore'
import { LoadingOutlined } from '@ant-design/icons'

type PropsType = {
  task: TaskType
}

const ChatBox = ({ task }: PropsType) => {
  const [credential] = useCredentialStore(state => [state.credential])

  const bottomRef = useRef<HTMLDivElement>(null)

  const { status, data: messagesList } = useFirestoreCollectionData(
    query(
      collection(useFirestore(), 'comments'),
      where('task', '==', task.id),
      limit(50),
      orderBy('createdAt', 'desc')
    )
  )

  useEffect(() => {
    const handleScrolltoBottom = () => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    handleScrolltoBottom()
  }, [messagesList])

  return (
    <>
      <div className="grow flex flex-col justify-start items-start gap-3 mt-2 w-full overflow-y-auto hidden-scroll-bar pb-2">
        {messagesList &&
          Array.from(messagesList as CommentType[])
            .reverse()
            .map((message, index) => (
              <div
                key={`comment-list-${index}`}
                className={`py-1 px-2 max-w-[90%] ${
                  message.sender === credential.uid
                    ? 'bg-textHover text-bgDefault rounded-s-xl rounded-tr-xl self-end'
                    : 'bg-bgDefault rounded-tl-xl rounded-e-xl'
                }`}
              >
                {message.sender === credential.uid ? (
                  <p>{message.value}</p>
                ) : (
                  <>
                    <p className="font-semibold">{message.displayName}</p>
                    <p>{message.value}</p>
                  </>
                )}
              </div>
            ))}
        {status === 'loading' && (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingOutlined className=" text-4xl text-primary-5 flex justify-center items-center" />
          </div>
        )}

        {status === 'success' && messagesList.length === 0 && (
          <p className="text-center w-full text-noneSelected">
            Write your first comment for this task
          </p>
        )}
        <div ref={bottomRef}></div>
      </div>

      <SendComment task={task} />
    </>
  )
}

export default ChatBox
