'use client';
import { useUserData } from 'app/lib/context/UserContext';
import { useEffect, useState } from 'react';

export default function MathExercisePage() {
  const { userData } = useUserData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita renderizado SSR

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {userData?.name ? `Hola ${userData.name}, resuelve:` : 'Resuelve:'}
      </h2>
      {/* Tu componente de matemáticas aquí */}
    </div>
  );
}