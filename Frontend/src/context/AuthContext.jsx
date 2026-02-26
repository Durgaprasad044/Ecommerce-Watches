import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// In-memory token — dies on page refresh (never persisted to localStorage)
let backendToken = null;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to exchange Firebase token for Backend JWT
  const executeBackendLogin = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken(true);
      // TODO: Replace with actual backend call:
      // const res = await fetch('/api/v1/auth/firebase-login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: idToken })
      // });
      // const data = await res.json();
      // backendToken = data.data.access_token;

      // TEMP: use Firebase ID token directly until backend integration
      backendToken = idToken;
      window.__authToken = backendToken; // expose to axiosInstance
    } catch (err) {
      console.error('Failed to get backend JWT:', err);
    }
  };

  async function register(email, password, role) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Role is stored in-memory, NOT localStorage
    currentUser && (currentUser._role = role || 'customer');
    await executeBackendLogin(cred.user);
    return cred;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await executeBackendLogin(cred.user);
    return cred;
  }

  async function logout() {
    await signOut(auth);
    // Clear in-memory token
    backendToken = null;
    window.__authToken = null;
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    await executeBackendLogin(cred.user);
    return cred;
  }

  useEffect(() => {
    // With inMemoryPersistence, onAuthStateChanged fires with null after refresh
    // So user is automatically logged out on page reload
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        await executeBackendLogin(user);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        backendToken = null;
        window.__authToken = null;
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      // Cleanup on unmount
      backendToken = null;
      window.__authToken = null;
    };
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
