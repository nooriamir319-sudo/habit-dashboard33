import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrs-MgCAn_MzRk3TRqsj8BvI82J85dP0",
  authDomain: "habit-dashboard-8a7dd.firebaseapp.com",
  projectId: "habit-dashboard-8a7dd",
  storageBucket: "habit-dashboard-8a7dd.firebasestorage.app",
  messagingSenderId: "106752354268",
  appId: "1:106752354268:web:a7c22c8e90f89b3858a045"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
