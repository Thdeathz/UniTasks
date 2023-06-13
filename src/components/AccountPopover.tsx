import React, { MouseEventHandler } from 'react'
import { LogoutOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Popover, Tooltip } from 'antd'
import useCredentialStore from '~/stores/CredentialStore'
import { auth } from '~/firebase/config'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

type PopoverItemPropsType = {
  children: React.ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
}

const PopoverItem = ({ children, onClick }: PopoverItemPropsType) => {
  return (
    <button
      className="w-full hover:bg-primary-1 flex justify-start items-center gap-2 p-2 rounded-md font-medium text-base text-noneSelected"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const AccountPopover = () => {
  const navigate = useNavigate()
  const [credential, setCredential] = useCredentialStore(state => [
    state.credential,
    state.setCredential
  ])

  const handleLogout = () => {
    console.log('logout')
    try {
      signOut(auth).then(() => {
        setCredential({
          uid: '',
          email: '',
          displayName: '',
          avatar: ''
        })
        navigate('/login')
        toast.success('Logout successfully', {
          toastId: 'logout-success'
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Popover
      placement="bottom"
      trigger="click"
      arrow={false}
      content={
        <div className="min-w-[10vw] flex flex-col justify-start items-start gap-1">
          <PopoverItem onClick={() => console.log('send feedback')}>
            <MailOutlined className="flex justify-center items-center" />
            <span>Send me feedback</span>
          </PopoverItem>

          <PopoverItem onClick={handleLogout}>
            <LogoutOutlined className="flex justify-center items-center" />
            <span>Logout</span>
          </PopoverItem>

          <p className="text-sm opacity-30 font-medium w-full">Team 37 · © 2023</p>
        </div>
      }
    >
      <Tooltip placement="bottom" title="Account" arrow={false}>
        <button className="flex justify-center items-center h-full gap-2 bg-primary-2 py-1 px-2 rounded-md font-medium hover:bg-primary-3 transition-colors">
          <Avatar
            className="flex justify-center items-center cursor-pointer"
            size={26}
            icon={<UserOutlined />}
            src={credential.avatar}
          />
          <span>{credential.displayName}</span>
        </button>
      </Tooltip>
    </Popover>
  )
}

export default AccountPopover
