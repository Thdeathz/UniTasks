import { create } from 'zustand'
import { getAllProjects } from '~/lib/getAllProject'

interface IProjectState {
  projects: Project
  getProjects: () => void
}

const useProjectStore = create<IProjectState>(set => ({
  projects: new Map<string, ProjectType>(),

  getProjects: async () => {
    const projects = await getAllProjects()

    set({ projects })
  }
}))

export default useProjectStore
