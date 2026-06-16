import { auth, db } from '@/lib/firebase'
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import type { User } from '../types/user-types'
import type {
  AuthSignInCredentials,
  AuthSignUpCredentials,
  ResetPasswordCredentials,
} from '../types/auth-types'

export const getOrCreateUserData = async (
  firebaseUser: FirebaseUser,
): Promise<User> => {
  const docRef = doc(db, 'users', firebaseUser.uid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) return docSnap.data() as User

  const newUser: User = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'Google User',
    displayName: firebaseUser.displayName || 'Google User',
    email: firebaseUser.email || '',
    image: firebaseUser.photoURL || '',
    username: firebaseUser.email?.split('@')[0] ?? firebaseUser.uid,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  }
  await setDoc(docRef, newUser)
  return newUser
}

export const initAuthSync = (setUser: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null)
      return
    }
    const userData = await getOrCreateUserData(firebaseUser)
    setUser(userData)
  })
}

export const getAuthenticatedUser = async (): Promise<User | null> => {
  const firebaseUser = await new Promise<FirebaseUser | null>((resolve, reject) => {
    let unsubscribe = () => {}
    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject,
    )
  })

  if (!firebaseUser) return null

  return getOrCreateUserData(firebaseUser)
}


export const getUserData = async (userId: string): Promise<User> => {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('User not found')
  return docSnap.data() as User
}

export const signUpWithCredentials = async (
  signUpCredentials: AuthSignUpCredentials,
): Promise<User> => {
  const { name, displayName, email, password, passwordAgain } =
    signUpCredentials
  if (!name) throw new Error('Name required')
  if (!email) throw new Error('Email required')
  if (!displayName) throw new Error('Display name required')
  if (!password) throw new Error('Password required')
  if (password !== passwordAgain) throw new Error('Passwords do not match')

  const { user: firebaseUser } = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )

  const newUser: User = {
    id: firebaseUser.uid,
    name,
    displayName,
    email,
    image: '',
    username: email.split('@')[0],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  }

  await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
  return newUser
}

export const signInWithCredentials = async (
  signInCredentials: AuthSignInCredentials,
): Promise<User> => {
  const { email, password } = signInCredentials

  if (!email) throw new Error('Email is required')
  if (!password) throw new Error('Password is required')

  await signInWithEmailAndPassword(auth, email, password)

  const user = await getOrCreateUserData(auth.currentUser as FirebaseUser)
  return user
}

export const signInOrSignUpWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const result = await signInWithPopup(auth, provider)
  return getOrCreateUserData(result.user)
}

export const handleGoogleRedirectResult = async (): Promise<User | null> => {
  const result = await getRedirectResult(auth)
  console.log('getRedirectResult result:', result)

  if (!result) return null

  const firebaseUser = result.user
  console.log('firebaseUser:', firebaseUser.uid, firebaseUser.email)

  const docRef = doc(db, 'users', firebaseUser.uid)
  const docSnap = await getDoc(docRef)
  console.log('docSnap exists:', docSnap.exists())

  if (!docSnap.exists()) {
    const newUser: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Google User',
      displayName: firebaseUser.displayName || 'Google User',
      email: firebaseUser.email || '',
      image: firebaseUser.photoURL || '',
      username: firebaseUser.email?.split('@')[0] ?? firebaseUser.uid,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    }
    console.log('Writing new user to Firestore:', newUser)
    await setDoc(docRef, newUser)
    console.log('Firestore write done')
    return newUser
  }

  return docSnap.data() as User
}

export const resetPasswordService = async (
  resetPasswordCredentials: ResetPasswordCredentials,
): Promise<void> => {
  const { email } = resetPasswordCredentials

  if (!email) throw new Error('Email is required')

  await sendPasswordResetEmail(auth, email)
}

export const signOutService = async (): Promise<void> => {
  await signOut(auth)
}

export const deleteAccountService = async (): Promise<void> => {
  const firebaseUser = auth.currentUser
  if (!firebaseUser) throw new Error('Not authenticated')
  await deleteDoc(doc(db, 'users', firebaseUser.uid))
  await deleteUser(firebaseUser)
}
