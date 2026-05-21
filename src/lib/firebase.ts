// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRbPyYoZMBzyP8eDX_hDJtkSJBOtkzRMg",
  authDomain: "darts-scorer-e4297.firebaseapp.com",
  projectId: "darts-scorer-e4297",
  storageBucket: "darts-scorer-e4297.firebasestorage.app",
  messagingSenderId: "44031262871",
  appId: "1:44031262871:web:28367e99d96818d22b29d2",
  measurementId: "G-HWX0JKHVXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };