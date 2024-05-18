// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_PORTAL_STUDENT_TEACHER,
  authDomain: "portal-student---teacher.firebaseapp.com",
  projectId: "portal-student---teacher",
  storageBucket: "portal-student---teacher.appspot.com",
  messagingSenderId: "1035384259562",
  appId: "1:1035384259562:web:c20bc8f5ef90e556fb6893",
  measurementId: "G-C1WJX36Y0H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
export const auth = getAuth();
const storage = getStorage(app);
export { storage };
