'use client';
import { useEffect, useState } from 'react';
import RecuerdaSecuencia from './RecuerdaSecuencia';
import MathExercise from './MathExercise';
import ReadingComprehension from './ReadingComprehension';
import Layout from '../Layout'; // Asegúrate de que la ruta sea correcta
import { ExerciseTransition } from './ExerciseTransition';
import MemoryCardGame from './MemoryCardGame';
import JuegoGlobos from './JuegoGlobos';
import JuegoTangram from './TangramGame';
import GuessTheDateGame from './GuessTheDateGame';

type ExerciseComponent = {
  title: string;
  component: React.ReactNode;
  duration: number;
};

export default function ExerciseManager() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [progress, setProgress] = useState(0); // Declara el estado 'progress' y su setter 'setProgress'
  const [exerciseCompleted, setExerciseCompleted] = useState(false); // Nuevo estado
  const [showTransition, setShowTransition] = useState(false);

  const exercises: ExerciseComponent[] = [
    { 
      title:'Adivina la fecha',
      component: <GuessTheDateGame 
        onComplete={() => {
           setProgress(75);
           setExerciseCompleted(true);
           setShowTransition(true);
          
        }} 
      
      />, 
      duration: 120 
    },
    { 
      title:'Explota los globos',
      component: <JuegoGlobos 
        onComplete={() => {
           setProgress(75);
           setExerciseCompleted(true);
           setShowTransition(true);
          
        }} 
      
      />, 
      duration: 120 
    },
    { 
      title:'Memoria',
      component: <MemoryCardGame 
      
        onComplete={() => {
           setProgress(75);
           setExerciseCompleted(true);
           setShowTransition(true);
          
        }} 
      
      />, 
      duration: 120 
    },
    { 
      title:'Lectura',
      component: <ReadingComprehension 
      
        onComplete={() => {
           setProgress(75);
           setExerciseCompleted(true);
           setShowTransition(true);
          
        }} 
      
      />, 
      duration: 120 
    },

    { 
      title: 'Recuerda la secuencia',
      component: <RecuerdaSecuencia 
      onComplete={() => {
        setProgress(25);
        setExerciseCompleted(true); // Marcamos como completado
        setShowTransition(true);
      }}
    
      />, 
      duration: 120 
    },

    { 
      title: 'Resuelve las operaciones',
      component: <MathExercise 
      onComplete={() => {
        setProgress(50);
        setShowTransition(true);

        setExerciseCompleted(true); // Marcamos como completado
      }}
       
      />, 
      duration: 120 
    },
   
    
  ];


/*
  useEffect(() => {
    if (exerciseCompleted) {
      const timer = setTimeout(() => {
        nextExercise();
        setExerciseCompleted(false);
      }, 1500); // Pequeño delay antes de cambiar

      return () => clearTimeout(timer);
    }
  }, [exerciseCompleted]);
*/
  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setProgress(((currentExerciseIndex + 1) / exercises.length) * 100);
      setShowTransition(false);
      setExerciseCompleted(false);
    } else {
      setShowTransition(false);
      alert('¡Todos los ejercicios completados!');
      // Opcional: reiniciar o cerrar sesión
    }
  };

  const replayExercise = () => {
    // Lógica para reiniciar el ejercicio actual
    // Puedes forzar un re-render con una key única
    // Reinicio forzado del ejercicio actual
    setCurrentExerciseIndex(prev => prev);
    setExerciseCompleted(false);
    setShowTransition(false);
  };
  const exitTraining = () => {
    alert('Entrenamiento finalizado');
    // Redirigir o reiniciar según sea necesario
  };
  return (
    <Layout currentProgress={progress}>
      {showTransition ? (
        <ExerciseTransition
          currentExercise={currentExerciseIndex + 1}
          totalExercises={exercises.length}
          onContinue={nextExercise}
          onReplay={replayExercise}
          exerciseName={exercises[currentExerciseIndex].title}
        />
      ) : (
        <div className="exercise-container">
          <h1 className="text-3xl font-bold text-center mb-8">
            {exercises[currentExerciseIndex].title}
          </h1>
          {exercises[currentExerciseIndex].component}
        </div>
      )}
    </Layout>
  );
}