import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJKXxKa-1ns0XKtSTkfIZLHjArZjtHNy8",
  authDomain: "mini-project-42fa1.firebaseapp.com",
  projectId: "mini-project-42fa1",
  storageBucket: "mini-project-42fa1.firebasestorage.app",
  messagingSenderId: "262785627271",
  appId: "1:262785627271:web:f47e2695a3c51e9bc1b422",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });