import React, { useState } from 'react'
import { BarsOutlined, LoadingOutlined } from '@ant-design/icons'
import { Checkbox, Progress } from 'antd'
import useBoardStore from '~/stores/BoardStore'

type PropsType = {
  task: TaskType
}

const SubTask = ({ task }: PropsType) => {
  const [setCompletedSubTask] = useBoardStore(state => [state.setCompletedSubTask])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCompletedSubTask = (taskIndex: number) => {
    try {
      setIsLoading(true)
      const newSubTasks = Array.from(task.subTasks)
      const [completedSubTask] = newSubTasks.splice(taskIndex, 1)

      completedSubTask.isCompleted = !completedSubTask.isCompleted
      newSubTasks.splice(taskIndex, 0, completedSubTask)

      setCompletedSubTask(task, newSubTasks)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-disabled rounded-md w-full">
      <div className="flex justify-between items-center py-1 px-2 border-b border-disabled ">
        <div className="flex justify-center items-center gap-1 font-semibold ">
          <BarsOutlined />
          <span>Sub task</span>
        </div>

        <p className="font-semibold">
          {task.subTasks.filter(each => each.isCompleted).length ?? 0}/{task.subTasks.length ?? 0}
        </p>
      </div>

      <div className="flex flex-col w-full justify-start items-start px-3 py-2 gap-2 max-h-[30vh] custom-scroll-bar overflow-y-auto">
        {task.subTasks?.map((subTask, index) => (
          <div key={`added-subtaks-${index}`} className="flex justify-between items-center gap-2">
            <Checkbox checked={subTask.isCompleted} onChange={() => handleCompletedSubTask(index)}>
              {isLoading ? <LoadingOutlined className="text-primary-5" /> : subTask.value}
            </Checkbox>
          </div>
        ))}
      </div>

      <div className="px-2 py-1 flex items-center justify-center gap-1 font-semibold w-full border-t border-disabled">
        <Progress
          percent={
            Math.round(
              (task.subTasks?.filter(each => each.isCompleted).length * 100) / task.subTasks?.length
            ) ?? 0
          }
          size="small"
        />
      </div>
    </div>
  )
}

export default SubTask
