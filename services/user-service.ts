import type { AuthCredentials, User } from "../types/user-types";
import { auth, db } from "@/lib/firebase";
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
    name: firebaseUser.displayName || "Névtelen",
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
    // 1. Minimum 3 betű check
    if (!searchTerm || searchTerm.length < 3) return [];

    const term = searchTerm.toLowerCase();
    const usersRef = collection(db, "users");

    // 2. Firestore prefix keresés trükk: 
    // Keressük azokat, amik a 'term'-mel kezdődnek, 
    // és kisebbek, mint a term + egy záró karakter (\uf8ff)
    const endTerm = term + "\uf8ff";

    // Külön query-k, mert a Firestore nem tud "OR" feltételt különböző mezőkre komplexen
    const queries = [
        query(usersRef, where("username", ">=", term), where("username", "<=", endTerm)),
        query(usersRef, where("name", ">=", term), where("name", "<=", endTerm)),
        query(usersRef, where("email", ">=", term), where("email", "<=", endTerm))
    ];

    // 3. Lekérjük mindet párhuzamosan
    const snapshots = await Promise.all(queries.map(q => getDocs(q)));
    
    const resultsMap: Record<string, User> = {};

    // 4. Összefésülés (hogy ne legyen duplikáció, ha vki neve és username-je is egyezik)
    snapshots.forEach(snap => {
      snap.forEach(doc => {
        resultsMap[doc.id] = { id: doc.id, ...doc.data() } as User;
      });
    });

    return Object.values(resultsMap);
}