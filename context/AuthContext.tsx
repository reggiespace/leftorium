
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StrapiService } from '../services/strapiService';

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('strapi_jwt');
      if (token) {
        try {
          const userData = await StrapiService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('strapi_jwt');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const data = await StrapiService.login(identifier, password);
    localStorage.setItem('strapi_jwt', data.jwt);
    setUser(data.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await StrapiService.register(username, email, password);
    localStorage.setItem('strapi_jwt', data.jwt);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('strapi_jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
