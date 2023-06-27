import React, { useState } from 'react'
import { Button, Divider, Form, Input } from 'antd'
import GoogleLogo from '~/assets/google_logo.png'
import FacebookLogo from '~/assets/facebook_logo.png'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '~/components/Layouts/AuthLayout'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '~/firebase/config'
import useCredentialStore from '~/stores/CredentialStore'
import { toast } from 'react-toastify'
import { LoadingOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { storeUserInfo } from '~/lib/auth'

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
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

  const onFinish = (values: CredentialType) => {
    const { fullname, email, password } = values
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        const { uid, email, photoURL } = user

        if (!auth.currentUser) return

        updateProfile(auth.currentUser, {
          displayName: fullname
        })
          .then(async () => {
            setCredential({
              uid,
              email: email as string,
              displayName: fullname,
              avatar: photoURL as string
            })

            form.resetFields()
            toast.success('Create new account successfully!', {
              toastId: 'register-success'
            })
            navigate('/')
          })
          .catch(error => {
            console.error(error)
          })
      })
      .catch(error => {
        console.error(error)
        const receivedError = error as { code: string; message: string }
        console.log('==> error code', receivedError.code)
        if (receivedError.code === 'auth/email-already-in-use') {
          form.setFields([
            {
              name: 'email',
              errors: ['Email already in use.']
            }
          ])
        }
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
        className="mt-2 w-full"
        layout="vertical"
      >
        <Form.Item name="fullname" rules={[{ required: true, message: 'Please enter your name.' }]}>
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Display name"
            maxLength={32}
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Email is required.' },
            { pattern: EMAIL_REGEX, message: 'Email is not valid.' }
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Password is required.' }]}>
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            className="flex justify-center items-center"
            type="primary"
            ghost
            htmlType="submit"
            block
          >
            {isloading ? (
              <LoadingOutlined className="text-lg flex justify-center items-center" />
            ) : (
              'Create account'
            )}
          </Button>
        </Form.Item>

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
