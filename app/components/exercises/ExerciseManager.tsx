'use client';
import { useEffect, useState, useRef } from 'react';
import RecuerdaSecuencia from './RecuerdaSecuencia';
import MathExercise from './MathExercise';
import ReadingComprehension from './ReadingComprehension';
import Layout from '../Layout';
import { ExerciseTransition } from './ExerciseTransition';
import MemoryCardGame from './MemoryCardGame';
import JuegoGlobos from './JuegoGlobos';
import SudokuGame from './SudokuGame';
import TresEnRaya from './TresEnRaya';
import JuegoTangram from './TangramGame';
import GuessTheDateGame from './GuessTheDateGame';
import WritingExercise from './WritingExercise';
import { FaBars, FaTimes } from 'react-icons/fa';
import VasosExercise from './VasosExercise';
import Buscaminas from './BuscaMinas';
import PatternRecognitionGame from './PatternRecognitionGame';
import WordSearchGame from './WordSearchGame';

type ExerciseComponent = {
  title: string;
  component: React.ReactNode;
  duration: number;
};

interface ExerciseConfig {
  title: string;
  componentName: string;
  duration: number;
  minLevel: number;
}

// Mapeo de nombres de componentes a componentes reales
const componentMap: { [key: string]: React.ComponentType<any> } = {
  RecuerdaSecuencia,
  MathExercise,
  ReadingComprehension,
  MemoryCardGame,
  JuegoGlobos,
  TresEnRaya,
  GuessTheDateGame,
  WritingExercise,
  VasosExercise,
  Buscaminas,
  SudokuGame,
  PatternRecognitionGame,
  WordSearchGame,
  JuegoTangram
};

interface ExerciseManagerProps {
  userLevel: number;
}

export default function ExerciseManager({ userLevel }: ExerciseManagerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentGame, setCurrentGame] = useState<number>(0);
  const [exercises, setExercises] = useState<ExerciseComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserLevelLoaded, setIsUserLevelLoaded] = useState(false);

  // Verificar cuando userLevel esté disponible
  useEffect(() => {
    if (typeof userLevel === 'number') {
      setIsUserLevelLoaded(true);
    } else {
      console.error('userLevel is not a number:', userLevel);
    }
  }, [userLevel]);

  // Cargar ejercicios desde el JSON externo
  useEffect(() => {
    if (!isUserLevelLoaded) return;

    const loadExercises = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const response = await fetch('/exercises.json');
        
        if (!response.ok) {
          throw new Error(`Error al cargar ejercicios: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Verificar que data.exercises existe y es un array
        if (!data.exercises || !Array.isArray(data.exercises)) {
          throw new Error('Formato inválido en exercises.json');
        }
        
        console.log('Exercises loaded:', data.exercises);
        console.log('User level:', userLevel);
        
        // Filtrar ejercicios por nivel del usuario
        const filteredExercises = data.exercises.filter((exercise: ExerciseConfig) => 
          exercise.minLevel <= userLevel
        );
        
        console.log('Filtered exercises:', filteredExercises);
        
        if (filteredExercises.length === 0) {
          setError(`No hay ejercicios disponibles para el nivel ${userLevel}`);
          setExercises([]);
          setLoading(false);
          return;
        }
        
        const exerciseComponents: ExerciseComponent[] = filteredExercises.map((exercise: ExerciseConfig) => {
          const Component = componentMap[exercise.componentName];
          
          if (!Component) {
            console.error(`Componente ${exercise.componentName} no encontrado en componentMap`);
            return null;
          }
          
          // Crear el componente con la lógica de onComplete correspondiente
          let component;
          
          if (exercise.componentName === 'Buscaminas' || exercise.componentName === 'TresEnRaya') {
            component = <Component 
              onComplete={() => {
                setCurrentGame(prev => {
                  const newCount = prev + 1;
                  if (newCount >= 2) {
                    setProgress(prevProgress => prevProgress + (100 / filteredExercises.length));
                    setExerciseCompleted(true);
                    setShowTransition(true);
                    return 0; // Reiniciar contador
                  }
                  return newCount;
                });
              }} 
            />;
          } else {
            component = <Component 
              onComplete={() => {
                setProgress(prev => prev + (100 / filteredExercises.length));
                setExerciseCompleted(true);
                setShowTransition(true);
              }} 
            />;
          }
          
          return {
            title: exercise.title,
            component: component,
            duration: exercise.duration
          };
        }).filter(Boolean) as ExerciseComponent[];
        
        setExercises(exerciseComponents);
      } catch (error) {
        console.error('Error loading exercises:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar ejercicios';
        setError(`Error al cargar ejercicios: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [currentGame, userLevel, isUserLevelLoaded]);

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
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

  // Mostrar loading mientras se obtiene userLevel
  if (typeof userLevel !== 'number') {
    return (
      <Layout currentProgress={progress}>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Cargando información del usuario...</div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout currentProgress={progress}>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Cargando ejercicios...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentProgress={progress}>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

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
              <p className="text-blue-100 text-sm">Nivel: {userLevel}</p>
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
          exerciseName={exercises[currentExerciseIndex]?.title || ''}
        />
      ) : (
        <div className="exercise-container">
          <h1 className="text-3xl font-bold text-center mb-8">
            {exercises[currentExerciseIndex]?.title || 'Ejercicio no disponible'}
          </h1>
          {exercises[currentExerciseIndex]?.component || <div>Ejercicio no disponible</div>}
        </div>
      )}
    </Layout>
  );
}