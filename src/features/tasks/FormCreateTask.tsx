import React, { useState } from 'react'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import { TagOutlined } from '@ant-design/icons'
import NewTag from '~/components/NewTag'
import Tag from '~/components/Tag'
import { v4 } from 'uuid'
import useBoardStore from '~/stores/BoardStore'
import useCredentialStore from '~/stores/CredentialStore'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import useProjectStore from '~/stores/ProjectStore'
import AddSubTask from '~/components/AddSubTask'

type PropsType = {
  projectId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FormCreateTask = ({ projectId, setIsOpen }: PropsType) => {
  const [addNewTaskInDB] = useBoardStore(state => [state.addNewTaskInDB])
  const [credential, users] = useCredentialStore(state => [state.credential, state.users])
  const [projects] = useProjectStore(state => [state.projects])

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
        createdUser: credential.uid,
        tags: tagsList,
        status: 'todo',
        priority: -1,
        createdAt,
        subTasks: [...subTasksList]
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
          style={{ width: '100%' }}
          options={Array.from(projects.get(projectId)?.members as string[]).map(memberId => {
            const user = users.get(memberId) as UserCredential
            return {
              value: user.uid,
              label: user.displayName
            }
          })}
        />
      </Form.Item>

      <Form.Item
        label={<p className="text-lg font-semibold">Due date:</p>}
        name="dueDate"
        rules={[{ required: true, message: 'Task due date is required.' }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={current => {
            return current < dayjs().startOf('day')
          }}
        />
      </Form.Item>

      <Form.Item label={<p className="text-lg font-semibold">To do:</p>} name="todo">
        <AddSubTask subTasks={subTasksList} setSubTasksList={setSubTasksList} />
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
