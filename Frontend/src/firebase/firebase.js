import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAAGsC81r_M6TrGxa3JyPvtq-eN8zOkZbU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "poject-k-8eb1a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "poject-k-8eb1a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "poject-k-8eb1a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "714590492295",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:714590492295:web:1f33c968c754a9be7c4a22",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SGCK7CDEC0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// IN-MEMORY persistence — session dies on page refresh / tab close
setPersistence(auth, inMemoryPersistence)
  .catch((error) => console.error("Firebase persistence error:", error));

export default app;
