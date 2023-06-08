import React from 'react'
import SideBar from '../SideBar'
import NavBar from '../NavBar'

type PropsType = {
  children: React.ReactNode
}

const DefaultLayout = ({ children }: PropsType) => {
  return (
    <div className="flex justify-start items-start w-full h-full">
      <SideBar />

      <div className="grow bg-slate-700 h-full flex flex-col justify-start items-start overflow-hidden">
        <NavBar />

        <div className="w-full h-[85%] grow">{children}</div>

        <p className="text-end text-sm opacity-30 font-medium w-full">
          © 2023 UI/UX HUST Team. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default DefaultLayout
