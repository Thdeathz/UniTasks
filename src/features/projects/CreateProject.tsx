import { DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import DefaultLayout from '~/components/Layouts/DefaultLayout'
import { addDocument } from '~/firebase/services'
import { toast } from 'react-toastify'
import useProjectStore from '~/stores/ProjectStore'

const CreateProject = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [getProjects] = useProjectStore(state => [state.getProjects])

  const onFinish = async (values: { name: string; description: string }) => {
    try {
      const { name, description } = values

      if (!name || !description) return

      const id = v4()

      await addDocument({
        collectionName: 'projects',
        id,
        data: {
          name,
          description
        }
      })
      getProjects()

      form.resetFields()
      navigate(`/project/${id}/tasks`)
      toast.success('Create new project successfully', {
        toastId: 'create project'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <DefaultLayout>
      <Form
        className="px-8 py-4 w-2/3 h-full"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <div className="flex flex-col justify-between items-start h-full">
          <div className="w-full grow">
            <Form.Item
              label={<p className="text-2xl font-semibold">Project name:</p>}
              name="name"
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

            <Form.Item label={<p className="text-2xl font-semibold">Members:</p>}>
              <>
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
              </>
            </Form.Item>
          </div>

          <Form.Item className="self-end">
            <Button size="large" type="primary" ghost htmlType="submit" className="mt-4" block>
              Create
            </Button>
          </Form.Item>
        </div>
      </Form>
    </DefaultLayout>
  )
}

export default CreateProject
