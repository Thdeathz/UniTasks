import React from 'react'
import HomeLayout from '~/components/Layouts/HomeLayout'
import useBoardStore from '~/stores/BoardStore'
import TaskItem from './TaskItem'
import { Empty } from 'antd'

const Trash = () => {
  const [board] = useBoardStore(state => [state.board])

  return (
    <HomeLayout>
      <div className="grid grid-cols-4 gap-4 auto-rows-min">
        {board.columns.get('deleted')?.tasks.map(task => (
          <TaskItem
            key={`deleted-task-${task.id}`}
            title={
              <p
                className={`bg-dust-red-5 text-bgDefault text-sm font-semibold px-2 py-1 rounded-md w-max`}
              >
                Deleted
              </p>
            }
            task={task}
            showHeader={true}
            disabled
          />
        ))}
      </div>
      {board.columns.get('deleted')?.tasks.length === 0 && (
        <div className="h-profile flex justify-center items-center">
          <Empty description="Trash empty ><!" />
        </div>
      )}
    </HomeLayout>
  )
}

export default Trash
