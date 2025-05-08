'use client';
import { useUserData } from 'app/lib/context/UserContext';

export default function MathExercisePage() {
  const { userData } = useUserData();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Hola {userData.name}, resuelve:
      </h2>
      {/* Tu componente de matemáticas aquí */}
    </div>
  );
}