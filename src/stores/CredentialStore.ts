import { create } from 'zustand'
import { addDocument, getDocument, updateDocument } from '~/firebase/services'
import { getAllUsers, storeUserInfo } from '~/lib/auth'

interface ICredentialState {
  credential: UserCredential
  searchUserResult: UserCredential[]
  users: Map<string, UserCredential>
  userPlan: Map<string, UserPlan>
  setPersistedCredential: (credential: UserCredential) => void
  setCredential: (credential: UserCredential) => void
  sendLogout: () => void
  getAllUsers: () => void
  searchUser: (searchValue: string) => void
  getUserPlan: (userId: string) => void
  setUserPlan: (userId: string, plan: UserPlan) => void
  updateUserPlan: (plan: UserPlan) => void
}

const useCredentialStore = create<ICredentialState>((set, get) => ({
  credential: {
    uid: '',
    email: '',
    displayName: '',
    avatar: ''
  },

  searchUserResult: [],

  users: new Map<string, UserCredential>(),

  userPlan: new Map<string, UserPlan>(),

  setPersistedCredential: credential => {
    set({ credential })
  },

  setCredential: async credential => {
    await storeUserInfo({ ...credential })
    set({ credential })
  },

  sendLogout: () => {
    set({
      credential: {
        uid: '',
        email: '',
        displayName: '',
        avatar: ''
      }
    })
  },

  getAllUsers: async () => {
    const data = await getAllUsers()

    console.log('==> all users', data)

    if (!data) return

    set({ users: data })
  },

  searchUser: searchValue => {
    if (searchValue === '' || !searchValue) return set({ searchUserResult: [] })

    const result = Array.from(get().users.values()).filter(user => {
      return user.email.toLowerCase().includes(searchValue.toLowerCase())
    })

    set({ searchUserResult: result })
  },

  getUserPlan: async userId => {
    const data = await getDocument(
      {
        collectionName: 'plans'
      },
      {
        fieldName: 'user',
        operator: '==',
        compareValue: userId
      }
    )

    if (!data) return

    set(() => {
      const userPlan = (data as UserPlan[]).reduce((acc: Map<string, UserPlan>, plan: any) => {
        acc.set(plan.id, {
          ...plan,
          start: plan.start.toDate(),
          end: plan.end.toDate(),
          task: {
            ...plan.task,
            createdAt: plan.task.createdAt.toDate(),
            dueDate: plan.task.dueDate.toDate()
          }
        })
        return acc
      }, new Map<string, UserPlan>())

      return { userPlan }
    })
  },

  setUserPlan: async (userId, plan) => {
    await addDocument({
      collectionName: 'plans',
      data: {
        user: userId,
        ...plan
      }
    })

    set(state => {
      const userPlan = new Map(state.userPlan)
      userPlan.set(plan.id, plan)
      return { userPlan }
    })
  },

  updateUserPlan: async plan => {
    set(state => {
      const userPlan = new Map(state.userPlan)
      userPlan.set(plan.id, plan)
      return { userPlan }
    })

    await updateDocument({
      collectionName: `plans/${plan.id}`,
      data: {
        ...plan
      }
    })
  }
}))

export default useCredentialStore
