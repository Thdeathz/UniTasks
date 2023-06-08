import { BarsOutlined, PlusOutlined } from '@ant-design/icons'
import React from 'react'

const SubTask = () => {
  return (
    <div className="border border-disabled rounded-md w-full">
      <div className="flex justify-between items-center py-1 px-2">
        <div className="flex justify-center items-center gap-1 font-semibold ">
          <BarsOutlined />
          <span>Sub task</span>
        </div>

        <p className="font-semibold">0/10</p>
      </div>

      <div className=""></div>

      <button className="py-1 flex items-center justify-center gap-1 font-semibold w-full hover:text-textHover transition-colors border-t border-disabled">
        <PlusOutlined />
        <span>Add sub task</span>
      </button>
    </div>
  )
}

export default SubTask
