import React from 'react'
import { PlusOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Tag } from 'antd'
import HomeLayout from '~/components/Layouts/HomeLayout'
import useProjectStore from '~/stores/ProjectStore'
import { useNavigate } from 'react-router-dom'
import useBoardStore from '~/stores/BoardStore'
import StarButton from '~/components/StarButton'
import useCredentialStore from '~/stores/CredentialStore'
import { projectTags } from '~/app/config'
import FilterBar from './FilterBar'
import { motion, AnimatePresence } from 'framer-motion'

type ProjectItemPropsType = {
  project: ProjectType
  upcomingTask: TaskType[]
}

const cardVariants = {
  hidden: { opacity: 0, y: -20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
}

const ProjectItem = ({ project, upcomingTask }: ProjectItemPropsType) => {
  const navigate = useNavigate()
  const [users] = useCredentialStore(state => [state.users])

  return (
    <motion.div
      className="relative"
      variants={cardVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <button
        className="bg-bgDefault w-full h-[32vh] rounded-2xl shadow-sm p-4 hover:shadow-lg transition-shadow flex flex-col justify-start items-start"
        onClick={() => navigate(`/project/${project.id}/overview`)}
      >
        <div className="flex justify-start items-start gap-2 mb-1">
          <img src={project.thumbnail} className="w-[40px] rounded-lg object-cover aspect-square" />
          <p className="text-lg font-semibold truncate">{project.name}</p>
        </div>

        <div className="grow">
          {upcomingTask.map((task, index) => (
            <p className="text-sm text-left truncate" key={`upcoming-task-${task.id}-${index}`}>
              - {task.title}
            </p>
          ))}

          {upcomingTask.length === 0 && (
            <p className="text-sm text-left font-medium text-disabled">No up coming task found</p>
          )}
        </div>

        <div className="flex justify-start items-center mb-2">
          {project.tags.slice(0, 2).map((tag, index) => (
            <Tag key={`project-tag-${project.id}-${index}`} color={projectTags[tag].color}>
              {tag}
            </Tag>
          ))}
        </div>

        <div className="flex justify-between items-center w-full">
          <Avatar.Group
            maxCount={3}
            maxPopoverTrigger="click"
            maxStyle={{
              color: '#f56a00',
              backgroundColor: '#fde3cf',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}
            size={28}
          >
            {project.members.map((member, index) => (
              <Avatar
                key={`project-member-${project.id}-${index}`}
                src={users.get(member)?.avatar ?? null}
                className="flex justify-center items-center text-sm"
                style={{ backgroundColor: '#f56a00' }}
                icon={<UserOutlined />}
              />
            ))}
          </Avatar.Group>
        </div>
      </button>

      <StarButton projectId={project.id} stared={project.bookmark} />
    </motion.div>
  )
}

const ProjectList = () => {
  const navigate = useNavigate()
  const [filteredProject] = useProjectStore(state => [state.filteredProject])
  const [board] = useBoardStore(state => [state.board])
  const [searchProjectValue] = useProjectStore(state => [state.searchProjectValue])

  return (
    <HomeLayout>
      <FilterBar />

      <div className="grid grid-cols-4 gap-4 auto-rows-min">
        <button
          className="cursor-pointer hover:text-textHover hover:border-textHover transition-colors rounded-2xl h-[32vh] flex flex-col gap-2 justify-center items-center text-noneSelected border border-dashed border-noneSelected"
          onClick={() => navigate('/project/create')}
        >
          <PlusOutlined className="text-3xl flex justify-center items-center" />
          <p className="text-xl font-medium">Create new project</p>
        </button>

        <AnimatePresence initial={true}>
          {Array.from(filteredProject.entries())
            .filter(([id, project]) => {
              console.log('==> search', searchProjectValue)
              return project.name.toLowerCase().includes(searchProjectValue.toLowerCase())
            })
            .map(([id, project], index) => (
              <ProjectItem
                key={`project-list-${index}`}
                project={project}
                upcomingTask={
                  board.columns
                    .get('todo')
                    ?.tasks.filter(task => task.projectId === id)
                    .splice(0, 3) as TaskType[]
                }
              />
            ))}
        </AnimatePresence>
      </div>
    </HomeLayout>
  )
}

export default ProjectList
