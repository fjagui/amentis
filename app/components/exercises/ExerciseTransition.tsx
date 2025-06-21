'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

interface ExerciseTransitionProps {
  currentExercise: number;
  totalExercises: number;
  onContinue: () => void;
  onExit: () => void;
  exerciseName: string;
}

export function ExerciseTransition({ 
  currentExercise,
  totalExercises,
  onContinue,
  onExit,
  exerciseName
}: ExerciseTransitionProps) {
  const [message, setMessage] = useState('');
  const [showButton, setShowButton] = useState(false);

  const messages = [
    `¡Dominaste ${exerciseName}!`,
    `¡Perfecto en ${exerciseName}!`,
    `¡${exerciseName} completado con éxito!`,
    `¡Nivel de ${exerciseName} superado!`
  ];

  useEffect(() => {
    // Mostrar mensaje aleatorio
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    // Mostrar el botón después de 1.5 segundos (para dar tiempo a leer el mensaje)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
    >
      <motion.div
        initial={{ y: 20, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <FaCheckCircle className="text-green-500 text-6xl" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800">{message}</h2>
          
          <div className="text-xl text-gray-600">
            Progreso: {currentExercise} de {totalExercises}
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${(currentExercise / totalExercises) * 100}%` }}
            />
          </div>

          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <motion.button
                onClick={onContinue}
                className={`w-full py-4 px-6 rounded-xl text-xl font-bold text-white shadow-lg flex items-center justify-center space-x-3 ${
                  currentExercise < totalExercises 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>
                  {currentExercise < totalExercises 
                    ? 'Siguiente ejercicio' 
                    : '¡Completado todo!'}
                </span>
                <FaArrowRight />
              </motion.button>

              {currentExercise < totalExercises && (
                <button
                  onClick={onExit}
                  className="mt-3 w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-xl text-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Finalizar entrenamiento
                </button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}