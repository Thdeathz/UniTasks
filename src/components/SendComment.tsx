import React, { KeyboardEvent, useRef, useState } from 'react'
import { Popover } from 'antd'
import { addDocument } from '~/firebase/services'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { LoadingOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons'
import useCredentialStore from '~/stores/CredentialStore'
import { serverTimestamp } from 'firebase/firestore'

type PropsType = {
  task: TaskType
}

const SendComment = ({ task }: PropsType) => {
  const [credential] = useCredentialStore(state => [state.credential])

  const [inputVal, setInputVal] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (inputVal.trim() === '') return

    try {
      setIsLoading(true)
      await addDocument({
        collectionName: 'comments',
        data: {
          task: task.id,
          sender: credential.uid,
          displayName: credential.displayName,
          value: inputVal,
          createdAt: serverTimestamp()
        }
      })
      setInputVal('')
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full flex justify-center items-center bg-bgDefault py-2 px-3 rounded-md gap-2">
      <input
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        className="border-none outline-none grow bg-trans"
        placeholder="Your comment..."
        multiple
        autoComplete="off"
        onKeyDown={onKeyDown}
      />

      <Popover
        placement="top"
        trigger="click"
        arrow={false}
        content={
          <Picker
            data={data}
            theme="light"
            navPosition="bottom"
            previewPosition="none"
            searchPosition="none"
            emojiButtonSize={32}
            emojiSize={20}
            onEmojiSelect={(emoji: { native: string }) => setInputVal(inputVal + emoji.native)}
          />
        }
      >
        <SmileOutlined className="cursor-pointer text-noneSelected p-1 hover:text-textHover transition-colors rounded-full" />
      </Popover>

      {isLoading ? (
        <LoadingOutlined className="text-primary-5" />
      ) : (
        <SendOutlined
          onClick={handleSendMessage}
          className="cursor-pointer text-noneSelected hover:text-textHover transition-colors"
        />
      )}
    </div>
  )
}

export default React.memo(SendComment)
