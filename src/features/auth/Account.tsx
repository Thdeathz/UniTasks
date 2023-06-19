import React from 'react'
import { Avatar, Button } from 'antd'
import HomeLayout from '~/components/Layouts/HomeLayout'
import useCredentialStore from '~/stores/CredentialStore'
import { EditOutlined } from '@ant-design/icons'

type AccountItemPropsType = {
  children: React.ReactNode
}

type UserInfoItemPropsType = {
  label: string
  value: string
}

const AccountItem = ({ children }: AccountItemPropsType) => {
  return <div className="border border-disabled h-min rounded-md p-4">{children}</div>
}

const UserInfoItem = ({ label, value }: UserInfoItemPropsType) => {
  return (
    <div>
      <p className="text-noneSelected font-medium">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

const Account = () => {
  const [credential] = useCredentialStore(state => [state.credential])

  return (
    <HomeLayout>
      <>
        <div className="bg-bgDefault rounded-md shadow-sm grow h-profile p-6 grid grid-cols-1 auto-rows-min gap-6">
          <AccountItem>
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-2">
                <Avatar src={credential.avatar} size={72} />
                <div>
                  <p className="font-semibold text-xl">{credential.displayName}</p>
                  <p className="text-base text-noneSelected">{credential.email}</p>
                </div>
              </div>

              <Button className="flex justify-center items-center" icon={<EditOutlined />}>
                Edit
              </Button>
            </div>
          </AccountItem>

          <AccountItem>
            <div className="flex justify-between items-start w-full mb-2">
              <p className="font-semibold text-lg">Personal Information</p>

              <Button disabled className="flex justify-center items-center" icon={<EditOutlined />}>
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <UserInfoItem label="First name" value={credential.displayName.split(' ')[0]} />
              <UserInfoItem label="Last name" value={credential.displayName.split(' ')[1]} />

              <UserInfoItem label="Email address" value={credential.email} />
              <UserInfoItem label="Phone" value="0987654321" />
            </div>
          </AccountItem>
        </div>
      </>
    </HomeLayout>
  )
}

export default Account
