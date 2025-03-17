
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { msalInstance, getActiveAccount, signIn, signOut, signInWithGoogle } from '../integrations/azure/client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Register callback for redirect
        msalInstance.addEventCallback((event: EventMessage) => {
          if (event.eventType === EventType.LOGIN_SUCCESS) {
            const result = event.payload as AuthenticationResult;
            setUser({
              id: result.account?.homeAccountId,
              email: result.account?.username,
              name: result.account?.name || 'User',
            });
          } else if (event.eventType === EventType.LOGOUT_SUCCESS) {
            setUser(null);
          }
        });

        // Check if user is already logged in
        const account = getActiveAccount();
        if (account) {
          setUser({
            id: account.homeAccountId,
            email: account.username,
            name: account.name || 'User',
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const login = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
