import type { User } from '#/features/authentication/types/user-types'
import { db } from '#/lib/firebase'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024
const PROFILE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function uploadProfileImage(file: File): Promise<string> {
  if (!PROFILE_IMAGE_TYPES.has(file.type)) {
    throw new Error('Please choose a JPG, PNG, or WebP image.')
  }

  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}

/**
 * Frissíti a felhasználó adatait Firestore-ban.
 * @param userId a felhasználó azonosítója
 * @param updates a frissítendő mezők (pl. image, displayName, stb.)
 * @returns Promise<User>
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<User, 'image' | 'displayName' | 'name' | 'email'>>,
): Promise<User> {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() })

  const userSnap = await getDoc(userRef)
  if (!userSnap.exists()) {
    throw new Error('User not found')
  }

  return { id: userSnap.id, ...userSnap.data() } as User
}