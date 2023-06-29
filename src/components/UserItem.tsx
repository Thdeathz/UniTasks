import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'

type UserItemPropsType = {
  size: 'large' | 'small'
  user: UserCredential | undefined
}

const UserItem = ({ size, user }: UserItemPropsType) => {
  if (user)
    return (
      <div className="flex justify-start items-center gap-1">
        <Avatar
          className="flex justify-center items-center"
          src={user.avatar ?? null}
          size={size === 'large' ? 24 : 20}
          icon={<UserOutlined className={`${size === 'small' && 'text-xm'}`} />}
        />
        <span className={size === 'large' ? 'font-normal text-base' : 'text-sm'}>
          {user.displayName}
        </span>
      </div>
    )

  return <></>
}
export default UserItem
