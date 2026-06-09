import type { AuthCredentials, User } from "../types/user-types";
import { auth, db } from "@/lib/firebase";
import MiniSearch from 'minisearch';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";

export const getUserData = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.data() as User;
}

export const getOrCreateUserData = async (
  firebaseUser: FirebaseUser,
): Promise<User> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  }

  const newUser: User = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "Anonymous User",
    displayName: firebaseUser.displayName || "Anonymous User",
    email: firebaseUser.email || "",
    image: firebaseUser.photoURL || "",
    username:
      firebaseUser.email?.split("@")[0] || firebaseUser.uid.slice(0, 5),
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };
  await setDoc(userRef, newUser);
  return newUser;
};

export const subscribeToAuthChanges = (
  onChange: (user: User | null) => void,
) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      onChange(null);
      return;
    }
    const userData = await getOrCreateUserData(firebaseUser);
    onChange(userData);
  });
};

export const loginWithGoogleService = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

export const registerWithEmailService = async ({
  email,
  password,
  name,
}: AuthCredentials & { name: string }): Promise<User> => {
  const { user: firebaseUser } = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const newUser: User = {
    id: firebaseUser.uid,
    name,
    displayName: name,
    email,
    image: "",
    username: email.split("@")[0],
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };

  await setDoc(doc(db, "users", firebaseUser.uid), newUser);
  return newUser;
};

export const loginWithEmailService = async ({
  email,
  password,
}: AuthCredentials): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const resetPasswordService = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const logoutService = async (): Promise<void> => {
  await signOut(auth);
};

export const deleteAccountService = async (): Promise<void> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) throw new Error("Not authenticated");
  await deleteDoc(doc(db, "users", firebaseUser.uid));
  await deleteUser(firebaseUser);
};

export const getUsersData = async (userIds: string[]): Promise<Record<string, User>> => {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (!unique.length) return {};

  const usersMap: Record<string, User> = {};

  await Promise.all(
    unique.map(async (uid) => {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        usersMap[uid] = { id: snap.id, ...snap.data() } as User;
      }
    }),
  );

  return usersMap;
}

export async function searchUsersService(searchTerm: string): Promise<User[]> {
    if (!searchTerm || searchTerm.length < 3) return [];

    // 1. Lekérjük az összes felhasználót a Firestore-ból
    // Tipp: Ezt érdemes lehet cache-elni egy változóba, hogy ne fusson le minden leütésnél!
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const allUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as User[];

    // 2. Beállítjuk a MiniSearch-et
    const miniSearch = new MiniSearch({
        fields: ['name', 'username', 'email'], // ezekben a mezőkben fog keresni
        storeFields: ['name', 'username', 'email', 'image'], // ezeket adja vissza a találatnál
        searchOptions: {
            prefix: true, // engedélyezi a szó eleji egyezést (kri -> kristof)
            fuzzy: 0.2    // engedélyezi az apró elütéseket (pl. kristóf -> kristof)
        }
    });

    // 3. Betöltjük az adatokat
    miniSearch.addAll(allUsers);

    // 4. Keresés
    const results = miniSearch.search(searchTerm);
    console.log('results', results);

    // 5. Visszaalakítjuk a formátumot a te User típusodra
    return results.map(result => ({
        id: result.id,
        name: result.name,
        username: result.username,
        email: result.email,
        image: result.image,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    } as User));
}