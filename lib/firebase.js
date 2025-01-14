import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: "AIzaSyDp-GoSek4WRmMZNMEhkSDwJGd9GHGy6iE",
  authDomain: "street-eats-2025.firebaseapp.com",
  projectId: "street-eats-2025",
  storageBucket: "street-eats-2025.firebasestorage.app",
  messagingSenderId: "52795014412",
  appId: "1:52795014412:web:6f0aeda20b6cb25ce1dd29",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
