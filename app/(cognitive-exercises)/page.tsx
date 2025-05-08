'use client';
import { EXERCISE_FLOW } from '../lib/constants/exercises';
import { useUserData } from '../lib/context/UserContext';
import { useRouter } from 'next/navigation';

export default function CognitiveExercisesPage() {
  const { userData } = useUserData();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold p-4">
        Hola, {userData?.name || 'Usuario'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {EXERCISE_FLOW.map((exercise) => (
          <div 
            key={exercise.id}
            className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            onClick={() => router.push(`/cognitive-exercises/${exercise.id}`)}
          >
            <h2 className="font-semibold">{exercise.name}</h2>
            <p>Duración: {exercise.duration} segundos</p>
            <p>Dificultad: {exercise.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}