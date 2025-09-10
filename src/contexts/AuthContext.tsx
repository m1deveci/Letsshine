import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  clearRememberedCredentials: () => void;
  hasRememberedCredentials: () => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login function to avoid infinite loop
  const autoLogin = async (email: string, encodedPassword: string): Promise<boolean> => {
    const password = atob(encodedPassword);
    if (email === 'admin@letsshine.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email,
        role: 'admin'
      };
      
      setUser(adminUser);
      sessionStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Check for existing session in both sessionStorage and localStorage
    const sessionUser = sessionStorage.getItem('user');
    const rememberedUser = localStorage.getItem('rememberedUser');
    const rememberedCredentials = localStorage.getItem('rememberedCredentials');
    
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
      setIsLoading(false);
    } else if (rememberedUser && rememberedCredentials) {
      // Auto-login with remembered credentials
      const credentials = JSON.parse(rememberedCredentials);
      autoLogin(credentials.email, credentials.password).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    // Simple demo authentication - in production, use proper authentication
    if (email === 'admin@letsshine.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        email,
        role: 'admin'
      };
      
      setUser(adminUser);
      
      if (rememberMe) {
        // Remember user for auto-login
        localStorage.setItem('rememberedUser', JSON.stringify(adminUser));
        localStorage.setItem('rememberedCredentials', JSON.stringify({
          email,
          password: btoa(password) // Basic encoding (not secure for production)
        }));
        // Also save to sessionStorage for current session
        sessionStorage.setItem('user', JSON.stringify(adminUser));
      } else {
        // Only save to sessionStorage (expires when browser closes)
        sessionStorage.setItem('user', JSON.stringify(adminUser));
        // Clear any remembered credentials
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('rememberedCredentials');
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    // Keep remembered credentials for auto-login, don't remove them on logout
    // localStorage.removeItem('rememberedUser');
    // localStorage.removeItem('rememberedCredentials');
  };

  const clearRememberedCredentials = () => {
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('rememberedCredentials');
  };

  const hasRememberedCredentials = () => {
    return localStorage.getItem('rememberedCredentials') !== null;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    clearRememberedCredentials,
    hasRememberedCredentials,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};