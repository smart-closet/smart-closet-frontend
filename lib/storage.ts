import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export default function firebaseInstance() {
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "quiztory-f5e09.firebaseapp.com",
    projectId: "quiztory-f5e09",
    storageBucket: "quiztory-f5e09.appspot.com",
    messagingSenderId: "237993415808",
    appId: "1:237993415808:web:20f6c0ea9695ab591cc265",
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const auth = getAuth(app);

  return { storage, auth };
}

