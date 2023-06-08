import { DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Progress } from 'antd'
import React from 'react'
import { useParams } from 'react-router-dom'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import useBoardStore from '~/stores/BoardStore'
import useProjectStore from '~/stores/ProjectStore'

type EachColumnPropsType = {
  id: StatusType
  tasks: TaskType[]
}

const columnTitle: {
  [key in StatusType]: string
} = {
  todo: 'TO DO',
  inprogress: 'IN PROGRESS',
  reviewing: 'REVIEWING',
  completed: 'COMPLETED'
}

const EachColumn = ({ id, tasks }: EachColumnPropsType) => {
  let backgroundColor = ''
  let length = ''
  if (id === 'todo') {
    backgroundColor = 'bg-todo'
    length = `${tasks.length}📃`
  }
  if (id === 'inprogress') {
    backgroundColor = 'bg-inprogress'
    length = `${tasks.length}🔥`
  }
  if (id === 'reviewing') {
    backgroundColor = 'bg-reviewing'
    length = `${tasks.length}📰`
  }
  if (id === 'completed') {
    backgroundColor = 'bg-completed'
    length = `${tasks.length}🎊`
  }

  return (
    <div className="flex justify-center items-center gap-4">
      <p className={`${backgroundColor} text-sm font-semibold px-2 py-1 rounded-md w-max`}>
        {columnTitle[id]}
      </p>
      <span className="font-semibold text-lg">{length}</span>
    </div>
  )
}

const ProjectOverview = () => {
  const { projectId } = useParams()
  const [board] = useBoardStore(state => [state.board])
  const [projects] = useProjectStore(state => [state.projects])

  if (!projectId || !projects) return <></>

  return (
    <ProjectLayout projectName={projects.get(projectId)?.name as string}>
      <div className="bg-neutral-3 h-full p-3 flex justify-center items-center gap-4">
        <div className="basis-1/2 h-full bg-bgDefault rounded-md py-2 px-3 overflow-y-auto hidden-scroll-bar shadow-md">
          <p className="text-2xl font-semibold">Member</p>

          <div className="border border-disabled rounded-md px-2 py-1">
            <input
              className="outline-none border-none w-full"
              placeholder="Find member by email..."
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-1 mt-2">
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-center gap-2">
                <Avatar
                  className="flex justify-center items-center"
                  size={36}
                  icon={<UserOutlined />}
                />

                <div className="flex flex-col justify-start items-start">
                  <p className="font-semibold text-lg">Bui Dung (you)</p>
                  <p className="text-noneSelected">buidung@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-1/2 h-full flex flex-col justify-center items-center gap-4">
          <div className="w-full rounded-md bg-bgDefault py-2 px-3 shadow-md flex flex-col gap-1 justify-start items-start">
            <p className="text-2xl font-semibold">About project</p>
            <p className="text-xl font-medium">{projects.get(projectId)?.name}</p>
            <p className="max-w-[40vw]">{projects.get(projectId)?.description}</p>
          </div>
          <div className="w-full grow rounded-md bg-bgDefault py-2 px-3 shadow-md">
            <p className="text-2xl font-semibold mb-4">About project</p>
            <div className="flex justify-between items-start">
              <div className="flex flex-col justify-start items-start gap-4">
                {Array.from(board.columns.entries()).map(([id, column]) => (
                  <EachColumn
                    key={id}
                    id={id}
                    tasks={column.tasks.filter(task => task.projectId === projectId)}
                  />
                ))}
              </div>
              <Progress type="circle" percent={75} />
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
}

export default ProjectOverview
