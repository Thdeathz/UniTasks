import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import { TagOutlined } from '@ant-design/icons'
import SubTask from '~/components/SubTask'
import NewTag from '~/components/NewTag'
import Tag from '~/components/Tag'
import { v4 } from 'uuid'
import useBoardStore from '~/stores/BoardStore'
import { toast } from 'react-toastify'

type PropsType = {
  projectId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OPTIONS = ['Bui Dung', 'Tran Huy', 'Duc Luong', 'Tien Loc', 'Duc Nghia']

const FormCreateTask = ({ projectId, setIsOpen }: PropsType) => {
  const [addNewTaskInDB] = useBoardStore(state => [state.addNewTaskInDB])

  const [form] = Form.useForm()
  const [tagsList, setTagsList] = useState<TagType[]>([])
  const [subTasksList, setSubTasksList] = useState<SubTaskType[]>([])
  const [isAddNewTag, setIsAddNewTag] = useState<boolean>(false)

  const handleCancel = () => {
    setIsAddNewTag(false)
    setTagsList([])
    form.resetFields()
    setIsOpen(false)
  }

  const onFinish = async (values: TaskType) => {
    try {
      const taskId = v4()
      const createdAt = new Date()

      addNewTaskInDB({
        id: taskId,
        projectId: projectId,
        title: values.title,
        description: values.description,
        assignedUser: values.assignedUser,
        dueDate: new Date(values.dueDate),
        createdUser: {
          id: '1',
          name: 'Bui Dung'
        },
        tags: tagsList,
        status: 'todo',
        priority: -1,
        createdAt,
        subTasks: []
      })

      setIsAddNewTag(false)
      setTagsList([])
      form.resetFields()
      setIsOpen(false)
      toast.success('Create new task successfully', {
        toastId: 'create task'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form
      form={form}
      name="create task"
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      className="w-full"
    >
      <div className="flex justify-start items-center gap-2 mb-2">
        {tagsList?.map((tag, index) => (
          <Tag
            key={`tag-${index}`}
            size="large"
            editable
            type="custom"
            text={tag.name}
            color={tag.color}
            onClick={() => {
              tagsList.splice(index, 1)
              setTagsList([...tagsList])
            }}
          />
        ))}

        <div
          className={
            isAddNewTag
              ? 'text-sm font-medium flex justify-center items-center gap-1 text-noneSelected border p-1 rounded-md border-disabled border-dashed'
              : 'text-sm font-medium text-noneSelected border p-1 rounded-md border-disabled border-dashed hover:text-textHover hover:border-textHover transition-colors'
          }
        >
          {isAddNewTag ? (
            <NewTag tagsList={tagsList} setTagsList={setTagsList} setIsAddNewTag={setIsAddNewTag} />
          ) : (
            <button
              type="button"
              className="flex justify-center items-center gap-1"
              onClick={() => setIsAddNewTag(true)}
            >
              <TagOutlined />
              <span>New tag</span>
            </button>
          )}
        </div>
      </div>

      <Form.Item
        label={<p className="text-lg font-semibold">Title:</p>}
        name="title"
        rules={[{ required: true, message: 'Task title is required.' }]}
      >
        <Input maxLength={128} placeholder="Enter task title..." />
      </Form.Item>

      <Form.Item
        label={<p className="text-lg font-semibold">Description:</p>}
        name="description"
        rules={[{ required: true, message: 'Task description is required.' }]}
      >
        <Input.TextArea placeholder="Enter description..." />
      </Form.Item>

      <Form.Item
        label={<p className="text-lg font-semibold">Assigned to:</p>}
        name="assignedUser"
        rules={[{ required: true, message: 'Task must assigned to at least one user.' }]}
      >
        <Select
          mode="multiple"
          placeholder="Enter user name..."
          value={OPTIONS}
          style={{ width: '100%' }}
          options={OPTIONS.map(item => ({
            value: item,
            label: item
          }))}
        />
      </Form.Item>

      <Form.Item
        label={<p className="text-lg font-semibold">Due date:</p>}
        name="dueDate"
        rules={[{ required: true, message: 'Task due date is required.' }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item label={<p className="text-lg font-semibold">To do:</p>} name="todo">
        <SubTask subTasks={subTasksList} setSubTasksList={setSubTasksList} />
      </Form.Item>

      <div className=" flex justify-end items-center mb-2 gap-2">
        <Button type="primary" ghost danger htmlType="button" onClick={handleCancel}>
          Cancel
        </Button>

        <Button type="primary" ghost htmlType="submit">
          Create task
        </Button>
      </div>
    </Form>
  )
}

export default FormCreateTask
