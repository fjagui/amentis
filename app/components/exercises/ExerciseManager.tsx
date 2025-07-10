'use client';
import { useEffect, useState, useRef } from 'react';
import RecuerdaSecuencia from './RecuerdaSecuencia';
import MathExercise from './MathExercise';
import ReadingComprehension from './ReadingComprehension';
import Layout from '../Layout';
import { ExerciseTransition } from './ExerciseTransition';
import MemoryCardGame from './MemoryCardGame';
import JuegoGlobos from './JuegoGlobos';
import TresEnRaya from './TresEnRaya';
import JuegoTangram from './TangramGame';
import GuessTheDateGame from './GuessTheDateGame';
import WritingExercise from './WritingExercise';
import { FaBars, FaTimes } from 'react-icons/fa';

type ExerciseComponent = {
  title: string;
  component: React.ReactNode;
  duration: number;
};

export default function ExerciseManager() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentGame, setCurrentGame] = useState<number>(0);
  const exercises: ExerciseComponent[] = [
    { 
      title: 'Tres en Raya',
      component: <TresEnRaya 
        onComplete={() => {
          // Incrementar contador de partidas
          setCurrentGame(prev => prev + 1);
          
          // Si se han jugado 3 partidas, completar el ejercicio
          if (currentGame >= 2) {
            setProgress(75);
            setExerciseCompleted(true);
            setShowTransition(true);
            setCurrentGame(0); // Reiniciar contador para la próxima vez
          }
        }} 
      />, 
      duration: 120 
    },   

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
          setExerciseCompleted(true);
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
          setExerciseCompleted(true);
        }}
      />, 
      duration: 120 
    },
    { 
      title:'Escribe en tu cuaderno',
      component: <WritingExercise 
        onComplete={() => {
          setProgress(75);
          setExerciseCompleted(true);
          setShowTransition(true);
        }} 
      />, 
      duration: 120 
    }
  ];

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setProgress(((currentExerciseIndex + 1) / exercises.length) * 100);
      setShowTransition(false);
      setExerciseCompleted(false);
    } else {
      setShowTransition(false);
      alert('¡Todos los ejercicios completados!');
    }
  };

  const replayExercise = () => {
    setCurrentExerciseIndex(prev => prev);
    setExerciseCompleted(false);
    setShowTransition(false);
  };

  const goToExercise = (index: number) => {
    setCurrentExerciseIndex(index);
    setProgress(((index) / exercises.length) * 100);
    setShowTransition(false);
    setExerciseCompleted(false);
    setMenuOpen(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Layout currentProgress={progress}>
      {/* Menú de navegación */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {menuOpen && (
          <div 
            ref={menuRef}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div className="bg-blue-600 p-4">
              <h3 className="text-xl font-bold text-white">Menú de Ejercicios</h3>
            </div>
            <ul className="py-2 max-h-80 overflow-y-auto">
              {exercises.map((exercise, index) => (
                <li key={index}>
                  <button
                    onClick={() => goToExercise(index)}
                    className={`w-full text-left px-6 py-4 flex items-center ${
                      index === currentExerciseIndex
                        ? 'bg-blue-100 font-bold text-blue-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span>{exercise.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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