import React, { useState } from 'react'
import { StarFilled, StarOutlined } from '@ant-design/icons'

type PropsType = {
  stared: boolean
}

const StarButton = ({ stared }: PropsType) => {
  const [isStared, setIsStared] = useState<boolean>(stared)

  return (
    <>
      {isStared ? (
        <StarFilled
          className="text-xl text-gold-4 hover:scale-125 transition-transform cursor-pointer absolute bottom-5 right-5"
          onClick={() => setIsStared(false)}
        />
      ) : (
        <StarOutlined
          className="text-xl text-noneSelected hover:scale-125 transition-transform cursor-pointer absolute bottom-5 right-5"
          onClick={() => setIsStared(true)}
        />
      )}
    </>
  )
}

export default StarButton
