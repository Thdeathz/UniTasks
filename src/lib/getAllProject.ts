import { getDocument } from '~/firebase/services'

export const getAllProjects = async () => {
  const data = await getDocument({
    collectionName: 'projects'
  })

  if (!data) return

  const projects = (data as ProjectType[]).reduce(
    (acc: Map<string, ProjectType>, project: ProjectType) => {
      acc.set(project.id, project)
      return acc
    },
    new Map<string, ProjectType>()
  )

  return projects
}
