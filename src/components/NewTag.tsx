import React, { useState } from 'react'
import { ColorPicker, theme } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { recommendedColor } from '~/app/config'

type PropsType = {
  tagsList: TagType[]
  setTagsList: React.Dispatch<React.SetStateAction<TagType[]>>
  setIsAddNewTag: React.Dispatch<React.SetStateAction<boolean>>
}

const NewTag = ({ tagsList, setTagsList, setIsAddNewTag }: PropsType) => {
  const { token } = theme.useToken()
  const [tagValue, setTagValue] = useState<TagType>({ name: '', color: token.colorPrimary })

  const handleAddNewTag = () => {
    if (tagValue && tagValue.name) {
      const { name, color } = tagValue
      setTagsList([...tagsList, { name, color }])
      setIsAddNewTag(false)
    }
  }

  return (
    <>
      <ColorPicker
        presets={[
          {
            label: 'Recommended',
            colors: [...recommendedColor]
          }
        ]}
        onChange={(value, hex) => setTagValue({ ...tagValue, color: hex })}
      />
      <input
        maxLength={16}
        className="outline-none border-none font-normal w-[6vw] px-1 text-black"
        placeholder="Tag name..."
        onChange={e => setTagValue({ ...tagValue, name: e.target.value })}
      />
      <CheckOutlined
        className="hover:text-textHover hover:border-textHover transition-colors font-bold"
        onClick={handleAddNewTag}
      />
    </>
  )
}

export default NewTag
