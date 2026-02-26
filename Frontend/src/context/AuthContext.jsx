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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to exchange Firebase token for Backend JWT
  const executeBackendLogin = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken(true);
      // In a real scenario, this POSTs to the backend:
      // const res = await fetch('/api/v1/auth/firebase-login', { ... });
      // const data = await res.json();
      
      // MOCK: simulate backend giving us a JWT
      const mockBackendJwt = `mock_jwt_${idToken.substring(0, 10)}`;
      localStorage.setItem('watchVaultToken', mockBackendJwt);
      console.log('Backend JWT stored successfully');
    } catch (err) {
      console.error('Failed to get backend JWT:', err);
    }
  };

  async function register(email, password, role) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // ⭐ SAVE ROLE (customer / vendor)
  localStorage.setItem("role", role || "customer");

  // existing backend login
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
    localStorage.removeItem('watchVaultToken');
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    await executeBackendLogin(cred.user);
    return cred;
  }

  useEffect(() => {
    // onAuthStateChanged fires automatically when Firebase detects a persistent session
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        // Refresh backend token on load if needed
        await executeBackendLogin(user);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('watchVaultToken');
      }
      setLoading(false);
    });
    return unsubscribe;
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
      {/* We render children even if loading, because ProtectedRoute will handle the spinner */}
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
