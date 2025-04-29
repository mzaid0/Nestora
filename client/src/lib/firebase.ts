import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nestora-12c40.firebaseapp.com",
  projectId: "nestora-12c40",
  storageBucket: "nestora-12c40.firebasestorage.app",
  messagingSenderId: "371549571361",
  appId: "1:371549571361:web:d6d41f123b263cfa1e5660",
};

export const app = initializeApp(firebaseConfig);
