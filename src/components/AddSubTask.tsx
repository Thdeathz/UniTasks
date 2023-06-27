import React, { useState } from 'react'
import {
  BarsOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Checkbox } from 'antd'

type PropsType = {
  subTasks: SubTaskType[]
  setSubTasksList: React.Dispatch<React.SetStateAction<SubTaskType[]>>
}

const AddSubTask = ({ subTasks, setSubTasksList }: PropsType) => {
  const [isAddNewSubTask, setIsAddNewSubTask] = useState<boolean>(false)
  const [inputVal, setInputVal] = useState<string>('')

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
        {subTasks?.map((subTask, index) => (
          <div key={`added-subtaks-${index}`} className="flex justify-between items-center gap-2">
            <Checkbox>{subTask.value}</Checkbox>

            <DeleteOutlined
              className="text-danger hover:scale-125 transition-transform cursor-pointer"
              onClick={() => {
                const newSubTask = Array.from(subTasks)
                newSubTask.splice(index, 1)
                setSubTasksList([...newSubTask])
              }}
            />
          </div>
        ))}

        {isAddNewSubTask && (
          <div className="flex justify-center items-end gap-1">
            <Checkbox>
              <input
                maxLength={128}
                className="outline-none border-b border-noneSelected w-full py-1 focus:border-textHover transition-colors"
                placeholder="Enter sub task..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
              />
            </Checkbox>

            <div className="flex justify-center items-end gap-1">
              <CloseOutlined
                className="flex justify-center items-end p-1 hover:text-danger transition-colors"
                onClick={() => {
                  setInputVal('')
                  setIsAddNewSubTask(false)
                }}
              />

              <CheckOutlined
                className="flex justify-center items-end p-1 hover:text-checked transition-colors"
                onClick={() => {
                  setInputVal('')
                  setSubTasksList(prev => [
                    ...prev,
                    {
                      value: inputVal,
                      isCompleted: false
                    }
                  ])
                }}
              />
            </div>
          </div>
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

export default AddSubTask
