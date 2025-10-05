// app/cognitive-exercises/page.tsx
'use client';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ExerciseManager from '../components/exercises/ExerciseManager';

export default function CognitiveExercisesPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  useEffect(() => {
    // Verificar localStorage directamente como fuente de verdad
    const checkUserData = () => {
      const storedUser = localStorage.getItem('userData');
      
      if (storedUser) {
        try {
          const parsedData = JSON.parse(storedUser);
          console.log("Usuario encontrado en localStorage:", parsedData);
          
          if (parsedData && parsedData.level !== undefined) {
            // Si hay usuario en localStorage pero no en el contexto,
            // recargar la página para sincronizar el contexto
            if (!user) {
              console.log("Recargando para sincronizar contexto...");
              window.location.reload();
              return;
            }
            // Si tenemos usuario en ambos, continuar
            setIsCheckingStorage(false);
            return;
          }
        } catch (error) {
          console.error("Error al parsear userData:", error);
        }
      }
      
      // Si no hay usuario en localStorage, redirigir
      console.log("No se encontraron datos de usuario, redirigiendo al onboarding");
      router.push('/onboarding');
    };

    // Pequeño retardo para asegurar que los datos se hayan guardado
    const timer = setTimeout(checkUserData, 100);
    return () => clearTimeout(timer);
  }, [user, router]);

  if (isLoading || isCheckingStorage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Cargando información del usuario...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Redirigiendo al onboarding...</div>
      </div>
    );
  }

  return <ExerciseManager userLevel={user.level} />;
}