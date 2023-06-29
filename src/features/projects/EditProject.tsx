import React, { useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import FormEditProject from './FormEditProject'

const EditProject = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <Button
        type="primary"
        className="flex justify-center items-center"
        icon={<EditOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Edit
      </Button>

      <Modal
        title="Edit project"
        open={isOpen}
        style={{ top: 20 }}
        onOk={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        width={800}
        footer={<></>}
      >
        <div className="max-h-[75vh] overflow-y-auto custom-scroll-bar pe-1">
          <FormEditProject setIsOpen={setIsOpen} />
        </div>
      </Modal>
    </>
  )
}

export default EditProject
