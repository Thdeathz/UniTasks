import { create } from 'zustand'

interface ICredentialState {
  credential: UserCredential
  setCredential: (credential: UserCredential) => void
}

const credentialStore = create<ICredentialState>(set => ({
  credential: {
    uid: '',
    email: '',
    displayName: '',
    avatar: ''
  },
  setCredential: credential => set({ credential })
}))

export default credentialStore
