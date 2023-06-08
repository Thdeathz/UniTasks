import React, { useRef } from 'react'
import { useHover } from 'usehooks-ts'
import { motion } from 'framer-motion'
import { DeleteOutlined } from '@ant-design/icons'

type PropsType = {
  type: 'important' | 'urgent' | 'normal' | 'custom'
  text?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
  editable?: boolean
  onClick?: () => void
}

const Tag = ({ type, text, color, size, editable, onClick }: PropsType) => {
  if (type === 'important')
    return (
      <button className="bg-[#FFE7BA] text-xs font-medium py-1 px-2 rounded-md">🔥Important</button>
    )

  if (type === 'custom' && color) {
    const hoverRef = useRef<HTMLButtonElement>(null)
    const isHover = useHover(hoverRef)

    const red = parseInt(color.substring(1, 3), 16)
    const green = parseInt(color.substring(3, 5), 16)
    const blue = parseInt(color.substring(5, 7), 16)

    const contrast = (red * 299 + green * 587 + blue * 114) / 1000

    return (
      <>
        <button
          type="button"
          className={
            size === 'large'
              ? `bg-[${color}] font-medium py-0.5 px-2 rounded-md relative`
              : `bg-[${color}] text-xs font-medium py-1 px-2 rounded-md relative`
          }
          style={{
            color: contrast >= 128 ? '#000000' : '#ffffff',
            backgroundColor: `${color}`
          }}
          ref={hoverRef}
        >
          {text}
          {editable && isHover && (
            <motion.button
              type="button"
              className="absolute w-full h-full bg-noneSelected top-0 left-0 rounded-md flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={onClick}
            >
              <DeleteOutlined className="text-danger hover:scale-125 transition-transform" />
            </motion.button>
          )}
        </button>
      </>
    )
  }

  return <></>
}

export default Tag
