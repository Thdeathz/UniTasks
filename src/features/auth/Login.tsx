import React, { useState } from 'react'
import { LoadingOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input } from 'antd'
import GoogleLogo from '~/assets/google_logo.png'

import { useNavigate } from 'react-router-dom'
import AuthLayout from '~/components/Layouts/AuthLayout'
import { auth } from '~/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import useCredentialStore from '~/stores/CredentialStore'
import { toast } from 'react-toastify'
import SignInWithGoogle from './SignInWithGoogle'
import SignInWithFacebook from './SignInWithFacebook'

type CredentialType = {
  email: string
  password: string
}

const EMAIL_REGEX = new RegExp(/^\S+@\S+\.\S+$/)

const Login = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [setCredential] = useCredentialStore(state => [state.setCredential])
  const [isloading, setIsLoading] = useState<boolean>(false)
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)

  const onFinish = (values: CredentialType) => {
    setIsLoading(true)
    const { email, password } = values
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
        setCredential({
          uid: user.uid,
          email: user.email as string,
          displayName: user.displayName as string,
          avatar: user.photoURL as string
        })
        form.resetFields()
        toast.success('Login successfully!', {
          toastId: 'login-success'
        })
        navigate('/')
      })
      .catch(error => {
        const receivedError = error as { code: string; message: string }
        console.log('==> error code', receivedError.code)
        if (receivedError.code === 'auth/too-many-requests') {
          form.setFields([
            {
              name: 'email',
              errors: ['Too many requests. Please try again later.']
            }
          ])
        }

        if (receivedError.code === 'auth/user-not-found') {
          form.setFields([
            {
              name: 'email',
              errors: ['Email is not registered.']
            }
          ])
        }

        if (receivedError.code === 'auth/wrong-password') {
          form.setFields([
            {
              name: 'password',
              errors: ['Invalid password.']
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
      <Form
        form={form}
        name="login"
        size="large"
        onFinish={onFinish}
        autoComplete="off"
        className="mt-4 w-full"
      >
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
              'Login'
            )}
          </Button>
        </Form.Item>

        <Divider plain>or sign in with</Divider>

        <div className="flex justify-between items-center w-full gap-4">
          <SignInWithGoogle />

          <SignInWithFacebook />
        </div>

        <div className="mt-2 text-base">
          Haven't account yet?{' '}
          <span
            className="font-medium text-textHover hover:border-b transition-all cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </div>
      </Form>
    </AuthLayout>
  )
}

export default Login
