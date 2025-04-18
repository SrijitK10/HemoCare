// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLfi50pnlT2zt2FchSFjRunLaaxCXZrL4",
  authDomain: "hemocare-f1f6d.firebaseapp.com",
  projectId: "hemocare-f1f6d",
  storageBucket: "hemocare-f1f6d.firebasestorage.app",
  messagingSenderId: "914630242027",
  appId: "1:914630242027:web:85c5920b2cfe1677a2d8ae"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
