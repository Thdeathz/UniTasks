import { create } from 'zustand'
import { addDocument, deleteDocument, updateDocument } from '~/firebase/services'
import { getAllProjects } from '~/lib/getAllProject'
import { arrayUnion } from 'firebase/firestore'

interface IProjectState {
  projects: Project
  filteredProject: Project
  getProjects: (currentUserUid: string) => void
  bookmarkProject: (projectId: string, status: boolean) => void
  createProject: (project: ProjectType, inviteList: string[]) => void
  joinProject: (project: ProjectType, currentUserUid: string, notificationId: string) => void
  setFilterdProject: (projects: ProjectType[]) => void
  searchProjectValue: string
  setSearchProjectValue: (value: string) => void
}

const useProjectStore = create<IProjectState>((set, get) => ({
  projects: new Map<string, ProjectType>(),

  filteredProject: new Map<string, ProjectType>(),

  searchProjectValue: '',

  setSearchProjectValue: value => {
    set({ searchProjectValue: value })
  },

  getProjects: async currentUserUid => {
    const projects = await getAllProjects(currentUserUid)

    set({ projects, filteredProject: projects })
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
  },

  createProject: async (project, inviteList) => {
    const { id, name, description, thumbnail, members, tags } = project

    await addDocument({
      collectionName: 'projects',
      id,
      data: {
        name,
        description,
        thumbnail,
        bookmark: true,
        members,
        tags
      }
    })

    inviteList.forEach(async member => {
      await addDocument({
        collectionName: 'notifications',
        data: {
          receiver: member,
          type: 'project-invite',
          project: {
            id,
            name,
            description,
            thumbnail,
            members
          }
        }
      })
    })

    set(state => {
      const newProjects = state.projects
      newProjects.set(id, project)

      return {
        projects: newProjects
      }
    })
  },

  joinProject: async (project, currentUserUid, notificationId) => {
    const { id, members } = project

    await updateDocument({
      collectionName: `projects/${id}`,
      data: {
        members: arrayUnion(currentUserUid)
      }
    })

    await deleteDocument({
      collectionName: `notifications/${notificationId}`
    })

    const projects = await getAllProjects(currentUserUid)

    set({ projects })
  },

  setFilterdProject: projects => {
    set(state => {
      const newProjects = projects.reduce((acc: Map<string, ProjectType>, project: ProjectType) => {
        acc.set(project.id, project)
        return acc
      }, new Map<string, ProjectType>())

      return {
        filteredProject: newProjects
      }
    })
  }
}))

export default useProjectStore
