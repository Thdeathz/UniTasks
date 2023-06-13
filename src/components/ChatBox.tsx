import React, { useState } from 'react'
import { SendOutlined, SmileOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

const ChatBox = () => {
  const [inputVal, setInputVal] = useState<string>('')

  const handleSendMessage = () => {
    setInputVal('')
  }

  return (
    <>
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
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          className="border-none outline-none grow bg-trans"
          placeholder="Your comment..."
          multiple
          autoComplete="off"
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
        <SendOutlined
          onClick={handleSendMessage}
          className="cursor-pointer text-noneSelected hover:text-textHover transition-colors"
        />
      </div>
    </>
  )
}

export default ChatBox
