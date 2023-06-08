import { db } from './config'
import {
  WhereFilterOp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'

export type DocumentType = {
  collectionName: string
  id?: string
  data?: object
}

export type ConditionType = {
  fieldName: string
  operator: WhereFilterOp
  compareValue: string
}

export const addDocument = async (document: DocumentType) => {
  const collectionRef = collection(db, document.collectionName)

  if (document.id) {
    await setDoc(doc(db, String(document.collectionName), String(document.id)), {
      ...document.data
    })
  } else {
    await addDoc(collectionRef, {
      ...document.data
    })
  }
}

export const getDocument = async (document: DocumentType, condition?: ConditionType) => {
  let ref = null
  let res = null
  if (document.id) {
    ref = doc(db, document.collectionName, String(document.id))
    res = await getDoc(ref)
    if (res.data()) {
      return {
        ...res.data()
      }
    }
  } else {
    ref = collection(db, document.collectionName)
    if (condition) {
      ref = query(ref, where(condition.fieldName, condition.operator, condition.compareValue))
    }
    res = await getDocs(ref)
    if (res) {
      const returnRes = res.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      return returnRes
    }
  }
  return null
}

export const deleteDocument = async (document: DocumentType) => {
  const collectionRef = doc(db, document.collectionName)

  if (document.id) {
    await deleteDoc(doc(db, String(document.collectionName), String(document.id)))
  } else {
    await deleteDoc(collectionRef)
  }
}

export const updateDocument = async (document: DocumentType) => {
  let collectionRef = doc(db, document.collectionName)
  if (document.id) {
    collectionRef = doc(collectionRef, document.id)
  }
  await updateDoc(collectionRef, document.data)
}
