import React, { useState } from 'react'
import { Avatar, Button, Form, Input, Select } from 'antd'
import UploadThumbnail from './UploadThumbnail'
import { projectTags } from '~/app/config'
import { CheckOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons'
import useCredentialStore from '~/stores/CredentialStore'
import useProjectStore from '~/stores/ProjectStore'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MemberItem } from './CreateProject'

type PropsType = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, type: 'easeOut', staggerChildren: 0.2 }
  },
  exit: {
    opacity: 0,
    x: -20
  }
}

const FormEditProject = ({ setIsOpen }: PropsType) => {
  const [form] = Form.useForm()

  const [credential] = useCredentialStore(state => [state.credential])
  const [createProject] = useProjectStore(state => [state.createProject])
  const [users, searchUserResult, searchUser] = useCredentialStore(state => [
    state.users,
    state.searchUserResult,
    state.searchUser
  ])

  const [projectThumbnail, setProjectThumbnail] = useState<FilePreview | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [addedMemberList, setAddedMemberList] = useState<string[]>([credential.uid])

  const onFinish = (values: any) => {}

  return (
    <Form
      className="basis-1/2"
      form={form}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label={<p className="text-sm font-medium">Enter your project name:</p>}
        name="name"
        rules={[{ required: true, message: 'Project name is required.' }]}
      >
        <Input placeholder="Ex: Project GR1, Bài tập lớn UI/UX, ..." />
      </Form.Item>

      <UploadThumbnail thumbnail={projectThumbnail} setThumbnail={setProjectThumbnail} />

      <Form.Item
        label={<p className="text-sm font-medium">Enter your project detail:</p>}
        name="description"
        rules={[{ required: true, message: 'Description is required.' }]}
      >
        <Input.TextArea placeholder="Show more about your project..." />
      </Form.Item>

      <Form.Item
        label={<p className="text-sm font-medium">Your project is related to:</p>}
        name="tags"
        rules={[
          { required: true, message: 'Please select at least 1 tag.' },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value.length > 3) {
                  callback('No more than 3 tags please.')
                } else if (value.length <= 3) {
                  callback()
                }
              }
              return
            }
          }
        ]}
      >
        <Select
          showSearch
          mode="multiple"
          placeholder="Select tag"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={Array.from(Object.keys(projectTags), each => ({
            value: each,
            label: each
          }))}
        />
      </Form.Item>

      <div className="border border-disabled rounded-md px-2 py-1">
        <input
          autoComplete="off"
          className="outline-none border-none w-full"
          placeholder="Find member by email..."
          onChange={e => searchUser(e.target.value)}
        />
      </div>

      <div className="flex flex-col justify-start items-start gap-1 mt-2">
        <div className="flex justify-between items-center w-full rounded-md px-2">
          <div className="flex justify-center items-center gap-2">
            <Avatar
              className="flex justify-center items-center"
              size={32}
              icon={<UserOutlined />}
            />

            <div className="flex flex-col justify-start items-start">
              <p className="font-semibold text-base">{credential.displayName} (You)</p>
              <p className="text-noneSelected text-sm">{credential.email}</p>
            </div>
          </div>
        </div>

        {Array.from(addedMemberList)
          .filter(each => each != credential.uid)
          .map(each => {
            const user = users.get(each)
            if (user)
              return (
                <motion.button
                  type="button"
                  className={`flex justify-between items-center w-full rounded-md px-2 bg-polar-green-2`}
                  onClick={() => setAddedMemberList(prev => prev.filter(uid => uid !== each))}
                  variants={itemVariants}
                  initial="hidden"
                  animate="enter"
                  exit="exit"
                >
                  <div className="flex justify-center items-center gap-2">
                    <Avatar
                      src={user.avatar ?? null}
                      className="flex justify-center items-center"
                      size={32}
                      icon={<UserOutlined />}
                    />

                    <div className="flex flex-col justify-start items-start">
                      <p className="font-semibold text-base">{user.displayName}</p>
                      <p className="text-noneSelected text-sm">{user.email}</p>
                    </div>
                  </div>

                  <CheckOutlined className="flex justify-center items-center text-2xl text-polar-green-5" />
                </motion.button>
              )
          })}

        {Array.from(searchUserResult)
          .filter(each => !addedMemberList.includes(each.uid))
          .map(user => (
            <MemberItem
              key={`search-list-${user.uid}`}
              user={user}
              setAddedMemberList={setAddedMemberList}
            />
          ))}
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button htmlType="button" danger onClick={() => setIsOpen(false)}>
          Cancel
        </Button>

        <Button disabled={isLoading} type="primary" ghost htmlType="submit">
          {isLoading ? (
            <LoadingOutlined className="text-lg flex justify-center items-center" />
          ) : (
            'Update'
          )}
        </Button>
      </div>
    </Form>
  )
}

export default FormEditProject
