'use client';
import { createContext, useContext, useState } from 'react';

type UserData = {
  name: string;
  birthDate: string | null;
  currentDate: string | null;
};

const UserContext = createContext<{
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  } | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    birthDate: null,
    currentDate: null
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
}