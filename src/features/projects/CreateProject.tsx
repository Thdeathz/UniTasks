import { DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Form, Input } from 'antd'
import React from 'react'
import DefaultLayout from '~/components/Layouts/DefaultLayout'

const CreateProject = () => {
  const [form] = Form.useForm()

  return (
    <DefaultLayout>
      <Form className="px-8 py-4 w-2/3" form={form} autoComplete="off" layout="vertical">
        <Form.Item
          label={<p className="text-2xl font-semibold">Project name:</p>}
          name="projectName"
          rules={[{ required: true, message: 'Project name is required.' }]}
        >
          <Input placeholder="Enter your project name..." />
        </Form.Item>

        <Form.Item
          label={<p className="text-2xl font-semibold">More about your project:</p>}
          name="description"
          rules={[{ required: true, message: 'Description is required.' }]}
        >
          <Input.TextArea placeholder="Show more about your project..." />
        </Form.Item>

        <Form.Item label={<p className="text-2xl font-semibold">Members:</p>} name="members">
          <div className="border border-disabled rounded-md px-2 py-1">
            <input
              className="outline-none border-none w-full"
              placeholder="Find member by email..."
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-1 mt-2">
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-center gap-2">
                <Avatar
                  className="flex justify-center items-center"
                  size={36}
                  icon={<UserOutlined />}
                />

                <div className="flex flex-col justify-start items-start">
                  <p className="font-semibold text-lg">Bui Dung (you)</p>
                  <p className="text-noneSelected">buidung@gmail.com</p>
                </div>
              </div>

              <DeleteOutlined className="text-2xl cursor-pointer text-danger hover:scale-125 transition-transform" />
            </div>
          </div>
        </Form.Item>
      </Form>
    </DefaultLayout>
  )
}

export default CreateProject
