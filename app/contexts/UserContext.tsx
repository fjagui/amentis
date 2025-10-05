// contexts/UserContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  name: string;
  day: string;
  month: string;
  year: string;
  level: number;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const setUserData = (userData: UserData) => {
    try {
      // Guardar en localStorage primero
      localStorage.setItem('userData', JSON.stringify(userData));
      // Luego actualizar el estado
      setUser(userData);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: setUserData, 
      logout, 
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};