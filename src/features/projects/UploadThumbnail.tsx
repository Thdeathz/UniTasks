import React, { ChangeEventHandler } from 'react'
import { InboxOutlined } from '@ant-design/icons'

type PropsType = {
  thumbnail: FilePreview | null
  setThumbnail: React.Dispatch<React.SetStateAction<FilePreview | null>>
}

const UploadThumbnail = ({ thumbnail, setThumbnail }: PropsType) => {
  const handleChangeInput: ChangeEventHandler<HTMLInputElement> = event => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0] as FilePreview
    const url = URL.createObjectURL(file)
    file.preview = url
    setThumbnail(file)
  }

  return (
    <div className="relative mb-2 h-36 border flex justify-center items-center border-dashed bg-neutral-2 border-noneSelected hover:border-primary-4 transition-colors rounded-md cursor-pointer">
      {thumbnail ? (
        <img src={thumbnail.preview} className="w-full h-full object-cover rounded-md" />
      ) : (
        <div className="py-3 flex flex-col justify-center items-center gap-1 ">
          <InboxOutlined className="text-4xl flex justify-center items-center text-primary-4" />
          <p className="text-lg font-semibold">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Upload your project's logo, or any image you want to show in the project
          </p>
        </div>
      )}

      <input
        type="file"
        className="w-full h-full absolute top-0 right-0 opacity-0"
        onChange={handleChangeInput}
        accept=".png,.jpg,.jpeg"
      />
    </div>
  )
}

export default UploadThumbnail
