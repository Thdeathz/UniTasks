import React, { useState } from 'react'
import { BarsOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Checkbox } from 'antd'

type PropsType = {
  subTasks: SubTaskType[]
  setSubTasksList?: React.Dispatch<React.SetStateAction<SubTaskType[]>>
}

const SubTask = ({ subTasks, setSubTasksList }: PropsType) => {
  const [isAddNewSubTask, setIsAddNewSubTask] = useState<boolean>(false)

  return (
    <div className="border border-disabled rounded-md w-full">
      <div className="flex justify-between items-center py-1 px-2 border-b border-disabled ">
        <div className="flex justify-center items-center gap-1 font-semibold ">
          <BarsOutlined />
          <span>Sub task</span>
        </div>

        <p className="font-semibold">0/10</p>
      </div>

      <div className="flex flex-col w-full justify-start items-start px-3 py-2">
        {isAddNewSubTask && (
          <Checkbox>
            <div className="flex justify-center items-end gap-2">
              <input
                maxLength={128}
                className="outline-none border-b border-noneSelected w-full py-1 focus:border-textHover transition-colors"
                placeholder="Enter sub task..."
              />
              <div className="flex justify-center items-center gap-1">
                <CloseOutlined
                  className="flex justify-center items-center p-1 hover:text-danger transition-colors"
                  onClick={() => setIsAddNewSubTask(false)}
                />
                <CheckOutlined className="flex justify-center items-center p-1 hover:text-checked transition-colors" />
              </div>
            </div>
          </Checkbox>
        )}
        {subTasks.length === 0 && !isAddNewSubTask && (
          <span className="text-noneSelected">No sub task available now !</span>
        )}
      </div>

      <button
        type="button"
        className="py-1 flex items-center justify-center gap-1 font-semibold w-full hover:text-textHover transition-colors border-t border-disabled"
        onClick={() => setIsAddNewSubTask(true)}
      >
        <PlusOutlined />
        <span>Add sub task</span>
      </button>
    </div>
  )
}

export default SubTask
