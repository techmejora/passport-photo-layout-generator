import React, { useState, useEffect } from 'react';
import { AuthContext } from '../../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
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

  const authValue = {
    isSignedIn,
    user,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}
