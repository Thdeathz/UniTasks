import React, { useState } from 'react'
import { DeleteOutlined, InboxOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import { addDocument } from '~/firebase/services'
import { toast } from 'react-toastify'
import useProjectStore from '~/stores/ProjectStore'
import appLogo from '~/assets/Logo.png'
import AccountPopover from '~/components/AccountPopover'
import { motion } from 'framer-motion'
import UploadThumbnail from './UploadThumbnail'
import uploadFile from '~/hooks/uploadFile'

type StepHeaderPropsType = {
  currentStep: number
}

const variants = {
  hidden: { opacity: 0, x: 0, y: 10 },
  enter: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, type: 'easeOut', when: 'beforeChildren' }
  },
  exit: { opacity: 0, x: -0, y: -10 }
}

const StepHeader = ({ currentStep }: StepHeaderPropsType) => {
  if (currentStep === 1)
    return (
      <div className="flex flex-col gap-3 mb-3">
        <p className="text-3xl font-bold">Project name</p>
        <p className="text-base">Please fill in the name of the project you want to create</p>
      </div>
    )

  if (currentStep === 2)
    return (
      <div className="flex flex-col gap-3 mb-3">
        <p className="text-3xl font-bold">More about your project</p>
      </div>
    )

  if (currentStep === 3)
    return (
      <div className="flex flex-col gap-3 mb-3">
        <p className="text-3xl font-bold">Find your temmate</p>
      </div>
    )

  return <></>
}

const CreateProject = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const values = Form.useWatch([], form)

  const [getProjects] = useProjectStore(state => [state.getProjects])
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [projectThumbnail, setProjectThumbnail] = useState<FilePreview | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleNextStep = () => {
    if (currentStep === 1 && values.name) {
      setCurrentStep(prev => prev + 1)
      return
    }

    if (currentStep === 2 && values.description) {
      setCurrentStep(prev => prev + 1)
      return
    }

    return
  }

  const onFinish = async (values: { name: string; description: string }) => {
    setIsLoading(true)
    const { name, description } = values

    if (!name || !description || !projectThumbnail) return

    const id = v4()

    uploadFile(projectThumbnail)
      .then(async res => {
        await addDocument({
          collectionName: 'projects',
          id,
          data: {
            name,
            description,
            thumbnail: res,
            bookmark: true
          }
        })
        getProjects()

        form.resetFields()
        navigate(`/project/${id}/tasks`)
        toast.success('Create new project successfully', {
          toastId: 'create project'
        })
      })
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col justify-start items-center">
      <div className="flex min-h-[3rem] max-h-[3rem] justify-between items-center border-b-2 border-borderLine px-4 py-1.5 w-full relative">
        <img src={appLogo} className="h-3/4 cursor-pointer" onClick={() => navigate('/')} />
        <AccountPopover />
        <div
          className={`absolute bottom-0 left-0 bg-primary-4 h-[2px] rounded-full transition-all duration-300 ${
            currentStep === 1 && 'w-1/3'
          } ${currentStep === 2 && 'w-2/3'} ${currentStep === 3 && 'w-full'}`}
        ></div>
      </div>
      <motion.div
        className="grow w-full flex justify-center items-start mt-8"
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
      >
        <Form
          className="basis-1/2"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className="flex flex-col h-full w-full">
            <StepHeader currentStep={currentStep} />

            <Form.Item
              className={currentStep === 1 ? `block` : `hidden`}
              label={<p className="text-sm font-medium">Enter your project name:</p>}
              name="name"
              rules={[{ required: true, message: 'Project name is required.' }]}
            >
              <Input size="large" placeholder="Ex: Project GR1, Bài tập lớn UI/UX, ..." />
            </Form.Item>

            <div className={currentStep === 2 ? `block` : `hidden`}>
              <UploadThumbnail thumbnail={projectThumbnail} setThumbnail={setProjectThumbnail} />

              <Form.Item
                label={<p className="text-sm font-medium">Enter your project detail:</p>}
                name="description"
                rules={[{ required: true, message: 'Description is required.' }]}
              >
                <Input.TextArea placeholder="Show more about your project..." />
              </Form.Item>
            </div>

            <Form.Item className={currentStep === 3 ? `block` : `hidden`} label={<></>}>
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

            <div className="flex justify-end items-center gap-2">
              <Button htmlType="button" danger onClick={() => navigate(-1)}>
                Cancel
              </Button>

              {currentStep !== 3 && (
                <Button
                  disabled={
                    (currentStep === 1 && !values?.name) ||
                    (currentStep === 2 && (!values?.description || Boolean(!projectThumbnail)))
                  }
                  type="primary"
                  htmlType="button"
                  ghost
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              )}

              <Button
                className={`${currentStep === 3 ? 'block' : 'hidden'}`}
                disabled={isLoading}
                type="primary"
                ghost
                htmlType="submit"
              >
                {isLoading ? (
                  <LoadingOutlined className="text-lg flex justify-center items-center" />
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        </Form>
      </motion.div>
    </div>
  )
}

export default CreateProject
