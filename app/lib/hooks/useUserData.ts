'use client';
import { useUserData } from '../context/UserContext';
import { UserData } from '../types/user'; // Asegúrate de tener esta interfaz

export function useUserDataActions() {
  const { userData, setUserData } = useUserData();

  // Tipado explícito para las funciones de actualización
  const updateName = (name: string) => {
    setUserData((prev: UserData) => ({ ...prev, name }));
  };

  const updateBirthDate = (date: string) => {
    setUserData((prev: UserData) => ({ ...prev, birthDate: date }));
  };

  const updateCurrentDate = (date: string) => {
    setUserData((prev: UserData) => ({ ...prev, currentDate: date }));
  };

  const getUserData = () => userData;
  // Versión alternativa con validación de tipos más estricta:
  const safeUpdateUserData = <K extends keyof UserData>(
    key: K,
    value: UserData[K]
  ) => {
    setUserData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    getUserData,
    updateName,
    updateBirthDate,
    updateCurrentDate,
    safeUpdateUserData // Método alternativo type-safe
  };
}