import { create } from 'zustand'
import { getAllUsers, storeUserInfo } from '~/lib/auth'

interface ICredentialState {
  credential: UserCredential
  searchUserResult: UserCredential[]
  users: Map<string, UserCredential>
  setPersistedCredential: (credential: UserCredential) => void
  setCredential: (credential: UserCredential) => void
  sendLogout: () => void
  getAllUsers: () => void
  searchUser: (searchValue: string) => void
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

    if (!data) return

    set({ users: data })
  },

  searchUser: searchValue => {
    if (searchValue === '') return set({ searchUserResult: [] })

    const result = Array.from(get().users.values()).filter(user =>
      user.email.toLowerCase().includes(searchValue.toLowerCase())
    )

    set({ searchUserResult: result })
  }
}))

export default useCredentialStore
