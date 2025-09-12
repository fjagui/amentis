// app/cognitive-exercises/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExerciseManager from './ExerciseManager';

export default function CognitiveExercisesPage() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Leer datos del usuario desde localStorage
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      // Si no hay datos, redirigir al onboarding
      router.push('/onboarding');
    }
  }, [router]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return <ExerciseManager userLevel={userData.level} />;
}