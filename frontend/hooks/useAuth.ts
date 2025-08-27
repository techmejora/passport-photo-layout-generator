import { useState, useEffect, createContext, useContext } from 'react';
import backend from '~backend/client';

interface AuthState {
  isSignedIn: boolean;
  user: { id: string; email: string } | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    // Return default state if not in provider
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);

    useEffect(() => {
      // Check localStorage for existing session
      const savedUser = localStorage.getItem('demoUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsSignedIn(true);
      }
    }, []);

    const signIn = (email: string) => {
      const userData = { id: email.split('@')[0], email };
      setUser(userData);
      setIsSignedIn(true);
      localStorage.setItem('demoUser', JSON.stringify(userData));
    };

    const signOut = () => {
      setUser(null);
      setIsSignedIn(false);
      localStorage.removeItem('demoUser');
    };

    return { isSignedIn, user, signIn, signOut };
  }
  return context;
}

// Returns the backend client with authentication.
export function useBackend() {
  const { isSignedIn, user } = useAuth();
  
  if (!isSignedIn || !user) return backend;
  
  return backend.with({
    auth: async () => {
      return { authorization: `Bearer user_${user.id}` };
    }
  });
}

export { AuthContext };
