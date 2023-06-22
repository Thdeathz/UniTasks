import React from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Progress } from 'antd'
import { useParams } from 'react-router-dom'
import ProjectLayout from '~/components/Layouts/ProjectLayout'
import useBoardStore from '~/stores/BoardStore'
import useProjectStore from '~/stores/ProjectStore'

type EachColumnPropsType = {
  id: StatusType
  tasks: TaskType[]
}

type MemberInfoPropsType = {
  name: string
  email: string
}

const columnTitle: {
  [key in StatusType]: string
} = {
  todo: 'TO DO',
  inprogress: 'IN PROGRESS',
  reviewing: 'REVIEWING',
  completed: 'COMPLETED',
  deleted: 'DELETED'
}

const MemberInfo = ({ name, email }: MemberInfoPropsType) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <Avatar className="flex justify-center items-center" size={36} icon={<UserOutlined />} />

      <div className="flex flex-col justify-start items-start">
        <p className="font-semibold text-lg">{name}</p>
        <p className="text-noneSelected">{email}</p>
      </div>
    </div>
  )
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

  let todo = 0
  let inprogress = 0
  let reviewing = 0
  let completed = 0

  return (
    <ProjectLayout projectId={projectId as string}>
      <div className="bg-neutral-3 grid grid-cols-2 p-2 gap-4 h-subContent">
        <div className="bg-bgDefault rounded-md py-3 px-4 overflow-y-auto hidden-scroll-bar shadow-md">
          <p className="text-2xl font-semibold">Member</p>

          <div className="border border-disabled rounded-md mt-2 px-2 py-1">
            <input
              className="outline-none border-none w-full"
              placeholder="Find member by email..."
            />
          </div>
          <div className="flex flex-col justify-start items-start gap-2 mt-2">
            <MemberInfo name="Bui Dung (you)" email="buidung@gmail.com" />
            <MemberInfo name="Tran Huy" email="tranhuy@gmail.com" />
            <MemberInfo name="Tien Loc" email="tienloc@gmail.com" />
            <MemberInfo name="Duc Luong" email="ducluong@gmail.com" />
            <MemberInfo name="Duc Nghia" email="ducnghia@gmail.com" />
          </div>
        </div>

        <div className="">
          <div className="rounded-md bg-bgDefault py-3 px-4 shadow-md flex flex-col gap-1 justify-start items-start mb-4">
            <p className="text-2xl font-semibold">About project</p>
            <p className="text-xl font-medium">{projects.get(projectId as string)?.name}</p>
            <p className="text-base">{projects.get(projectId as string)?.description}</p>
          </div>

          <div className="rounded-md bg-bgDefault py-3 px-4 shadow-md">
            <p className="text-2xl font-semibold mb-4">Overview</p>
            <div className="flex justify-between items-start">
              <div className="flex flex-col justify-start items-start gap-4">
                {Array.from(board.columns.entries()).map(([id, column]) => {
                  if (id === 'todo')
                    todo = column.tasks.filter(task => task.projectId === projectId).length
                  if (id === 'inprogress')
                    inprogress = column.tasks.filter(task => task.projectId === projectId).length
                  if (id === 'reviewing')
                    reviewing = column.tasks.filter(task => task.projectId === projectId).length
                  if (id === 'completed')
                    completed = column.tasks.filter(task => task.projectId === projectId).length
                  if (id === 'deleted') return <></>

                  return (
                    <EachColumn
                      key={`each-status-overview-${id}`}
                      id={id}
                      tasks={column.tasks.filter(task => task.projectId === projectId)}
                    />
                  )
                })}
              </div>
              <Progress
                type="circle"
                percent={Math.round(
                  (completed / (todo + inprogress + reviewing + completed)) * 100
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
}

export default ProjectOverview
