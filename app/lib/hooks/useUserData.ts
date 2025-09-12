'use client';
import { useUserData } from '../context/UserContext';
import { UserData } from '../types/user';

export function useUserDataActions() {
  const { userData, setUserData } = useUserData();

  // Versión type-safe para actualizaciones
  const updateUserData = <K extends keyof UserData>(field: K, value: UserData[K]) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Métodos específicos para mejor semántica
  const updateName = (name: string) => updateUserData('name', name);
  const updateBirthDate = (date: string) => updateUserData('birthDate', date);
  const updateCurrentDate = (date: string) => updateUserData('currentDate', date);
  const updateDay = (day: string) => updateUserData('day', day);
  const updateMonth = (month: string) => updateUserData('month', month);
  const updateYear = (year: string) => updateUserData('year', year);

  return {
    userData,
    updateName,
    updateBirthDate,
    updateCurrentDate,
    updateDay,
    updateMonth,
    updateYear,
    updateUserData // Método genérico type-safe
  };
}