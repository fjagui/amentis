import { EXERCISE_FLOW } from '../constants/exercises';
import { useRouter } from 'next/navigation';

export function useExercise() {
  const router = useRouter();
  
  const nextExercise = () => {
    const currentPath = window.location.pathname.split('/').pop();
    const currentIndex = EXERCISE_FLOW.findIndex(e => e.id === currentPath);
    const next = EXERCISE_FLOW[currentIndex + 1];
    
    if (next) {
      router.push(`/${next.id}`);
    } else {
      router.push('/completado');
    }
  };

  return { nextExercise };
}