import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAGsC81r_M6TrGxa3JyPvtq-eN8zOkZbU",
  authDomain: "poject-k-8eb1a.firebaseapp.com",
  projectId: "poject-k-8eb1a",
  storageBucket: "poject-k-8eb1a.firebasestorage.app",
  messagingSenderId: "714590492295",
  appId: "1:714590492295:web:1f33c968c754a9be7c4a22",
  measurementId: "G-SGCK7CDEC0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Explicitly set persistence to LOCAL (persists until explicit logout)
setPersistence(auth, browserLocalPersistence)
  .catch((error) => console.error("Firebase persistence error:", error));

export default app;
