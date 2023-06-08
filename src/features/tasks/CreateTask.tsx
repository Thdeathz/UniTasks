import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { FloatButton, Modal } from 'antd'
import FormCreateTask from './FormCreateTask'

type PropsType = {
  projectId: string
}

const CreateTask = ({ projectId }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <button
        className="bg-primary-3 text-bgDefault hover:opacity-90 transition-all hover:text-textHover absolute bottom-12 right-6 z-50 h-[40px] px-3 flex justify-center items-center gap-1 rounded-full cursor-pointer shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <PlusOutlined className="flex justify-center items-center" />
        <span className="font-medium">New task</span>
      </button>

      <Modal
        title={<p className="bg-todo text-sm font-semibold px-2 py-1 rounded-md w-max">TO DO</p>}
        open={isOpen}
        style={{ top: 20 }}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        width={800}
        footer={<></>}
      >
        <div className="max-h-[75vh] overflow-y-auto custom-scroll-bar pe-1">
          <FormCreateTask projectId={projectId} setIsOpen={setIsOpen} />
        </div>
      </Modal>
    </>
  )
}

export default CreateTask
