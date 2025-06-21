// app/context/UserContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';
import { UserData } from '../types/user';

type UserContextType = {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    day: '',
    month: '',
    year: '',
    birthDate: null,
    currentDate: null
  });

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserData = () => useContext(UserContext);