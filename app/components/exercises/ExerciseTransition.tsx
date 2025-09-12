'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaArrowRight, FaRedo, FaCheckCircle } from 'react-icons/fa';

interface ExerciseTransitionProps {
  currentExercise: number;
  totalExercises: number;
  onContinue: () => void;
  onReplay: () => void; // Nueva prop para repetir el ejercicio
  exerciseName: string;
}

export function ExerciseTransition({ 
  currentExercise,
  totalExercises,
  onContinue,
  onReplay, // Nueva prop
  exerciseName
}: ExerciseTransitionProps) {
  const [message, setMessage] = useState('');

  const messages = [
    `¡Dominaste ${exerciseName}!`,
    `¡Perfecto en ${exerciseName}!`,
    `¡${exerciseName} completado con éxito!`,
    `¡Nivel de ${exerciseName} superado!`
  ];

  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
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

          <div className="pt-4 grid grid-cols-2 gap-4">
            {/* Botón para repetir ejercicio */}
            <motion.button
              onClick={onReplay}
              className="py-4 px-6 rounded-xl text-xl font-bold text-white shadow-lg flex items-center justify-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaRedo />
              <span>Repetir</span>
            </motion.button>

            {/* Botón para siguiente ejercicio */}
            <motion.button
              onClick={onContinue}
              className={`py-4 px-6 rounded-xl text-xl font-bold text-white shadow-lg flex items-center justify-center space-x-3 ${
                currentExercise < totalExercises 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {currentExercise < totalExercises 
                  ? 'Siguiente' 
                  : 'Finalizar'}
              </span>
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}