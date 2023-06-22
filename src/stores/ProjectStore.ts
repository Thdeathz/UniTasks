import { create } from 'zustand'
import { updateDocument } from '~/firebase/services'
import { getAllProjects } from '~/lib/getAllProject'

interface IProjectState {
  projects: Project
  getProjects: () => void
  bookmarkProject: (projectId: string, status: boolean) => void
}

const useProjectStore = create<IProjectState>(set => ({
  projects: new Map<string, ProjectType>(),

  getProjects: async () => {
    const projects = await getAllProjects()

    set({ projects })
  },

  bookmarkProject: async (projectId, status) => {
    set(state => {
      const newProjects = new Map<string, ProjectType>(state.projects)
      const project = newProjects.get(projectId) as ProjectType

      project.bookmark = status
      newProjects.set(projectId, project)

      return {
        projects: newProjects
      }
    })

    await updateDocument({
      collectionName: `projects/${projectId}`,
      data: { bookmark: status }
    })
  }
}))

export default useProjectStore
