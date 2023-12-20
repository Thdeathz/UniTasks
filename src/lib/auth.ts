import { addDocument, getDocument } from '~/firebase/services'

export const storeUserInfo = async (userInfo: UserCredential) => {
  const registerdUser = await getDocument({ collectionName: 'users', id: userInfo.uid })

  if (registerdUser) return
  await addDocument({ collectionName: 'users', id: userInfo.uid, data: { ...userInfo } })
}

export const getAllUsers = async () => {
  const users = await getDocument({ collectionName: 'users' })

  console.log('==> all users', users)

  if (!users) return

  const usersMap = (users as UserCredential[]).reduce(
    (acc: Map<string, UserCredential>, user: UserCredential) => {
      acc.set(user.uid, user)
      return acc
    },
    new Map<string, UserCredential>()
  )

  return usersMap
}
