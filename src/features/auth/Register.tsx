import React, { useState } from 'react'
import { Button, Divider, Form, Input } from 'antd'
import GoogleLogo from '~/assets/google_logo.png'
import FacebookLogo from '~/assets/facebook_logo.png'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '~/components/Layouts/AuthLayout'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '~/firebase/config'
import useCredentialStore from '~/stores/CredentialStore'
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons'

type CredentialType = {
  fullname: string
  email: string
  password: string
}

const EMAIL_REGEX = new RegExp(/^\S+@\S+\.\S+$/)

const Register = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [setCredential] = useCredentialStore(state => [state.setCredential])
  const [isloading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: CredentialType) => {
    const { fullname, email, password } = values
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        const { uid, email, displayName, photoURL } = user
        if (!uid || !email || !displayName || !photoURL) return

        setCredential({ uid, email, displayName, avatar: photoURL })
        form.resetFields()
        toast.success('Create new account successfully!', {
          toastId: 'register-success'
        })
        navigate('/')
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthLayout>
      <p className="text-2xl font-semibold">Get started</p>
      <Form
        labelCol={{ span: 6 }}
        form={form}
        name="login"
        size="large"
        onFinish={onFinish}
        autoComplete="off"
        className="mt-4 w-full items-start"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required.' },
            { pattern: EMAIL_REGEX, message: 'Email is not valid.' }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Password is required.' }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" ghost htmlType="submit" block>
            {isloading ? <LoadingOutlined /> : 'Create account'}
          </Button>
        </Form.Item>

        <Divider plain>or register with</Divider>

        <div className="flex justify-between items-center w-full gap-4">
          <button
            type="button"
            className="basis-1/2 border border-disabled flex justify-center gap-2 items-center p-2 rounded-md hover:border-textHover transition-colors"
          >
            <img src={GoogleLogo} className="w-[20px]" />
            <span className="font-medium">Google</span>
          </button>

          <button
            type="button"
            className="basis-1/2 border border-disabled flex justify-center gap-2 items-center p-2 rounded-md hover:border-textHover transition-colors"
          >
            <img src={FacebookLogo} className="w-[20px]" />
            <span className="font-medium">Facebook</span>
          </button>
        </div>

        <div className="mt-2 text-base">
          Already has account?{' '}
          <span
            className="font-medium text-textHover hover:border-b transition-all cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default Register
