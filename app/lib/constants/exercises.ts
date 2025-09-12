interface ExerciseConfig {
    id: string;
    name: string;
    component: string;
    duration: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
  
  export const EXERCISE_FLOW: ExerciseConfig[] = [
    {
      id: 'math-1',
      name: 'Operaciones Básicas',
      component: 'math',
      duration: 120,
      difficulty: 'easy'
    },
    {
      id: 'memory-1',
      name: 'Juego de Memoria',
      component: 'memory',
      duration: 180,
      difficulty: 'medium'
    },
    // Agrega más ejercicios según necesites
  ];