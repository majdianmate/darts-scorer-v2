import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRbPyYoZMBzyP8eDX_hDJtkSJBOtkzRMg",
    authDomain: "darts-scorer-e4297.firebaseapp.com",
    projectId: "darts-scorer-e4297",
    storageBucket: "darts-scorer-e4297.firebasestorage.app",
    messagingSenderId: "44031262871",
    appId: "1:44031262871:web:28367e99d96818d22b29d2",
    measurementId: "G-HWX0JKHVXT"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics, auth, db };