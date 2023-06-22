import React, { useState } from 'react'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import useProjectStore from '~/stores/ProjectStore'

type PropsType = {
  projectId: string
  stared: boolean
}

const StarButton = ({ projectId, stared }: PropsType) => {
  const [bookmarkProject] = useProjectStore(state => [state.bookmarkProject])

  return (
    <>
      {stared ? (
        <StarFilled
          className="text-xl text-gold-4 hover:scale-125 transition-transform cursor-pointer absolute bottom-5 right-5"
          onClick={() => bookmarkProject(projectId, false)}
        />
      ) : (
        <StarOutlined
          className="text-xl text-noneSelected hover:scale-125 transition-transform cursor-pointer absolute bottom-5 right-5"
          onClick={() => bookmarkProject(projectId, true)}
        />
      )}
    </>
  )
}

export default StarButton
