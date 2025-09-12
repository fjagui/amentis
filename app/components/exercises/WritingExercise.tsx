"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPencilAlt, FaWhatsapp, FaCheck, FaBook, FaPen } from "react-icons/fa";

interface Instruction {
  id: number;
  title: string;
  description: string;
}

// Almacenamiento para historial de ejercicios
const EXERCISE_HISTORY_KEY = "exerciseHistory";
const MAX_HISTORY_SIZE = 15; // Mantener un historial razonable
const EXERCISES_TO_SHOW = 2;

// Función para obtener ejercicios evitando repeticiones recientes
const getNonRepeatingExercises = (
  allExercises: Instruction[],
  history: number[]
): Instruction[] => {
  // Filtrar ejercicios que no están en el historial reciente
  const availableExercises = allExercises.filter(
    ex => !history.includes(ex.id)
  );
  
  // Si hay suficientes ejercicios disponibles
  if (availableExercises.length >= EXERCISES_TO_SHOW) {
    const shuffled = [...availableExercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, EXERCISES_TO_SHOW);
  }
  
  // Si no hay suficientes, mezclar todos los ejercicios
  const allShuffled = [...allExercises].sort(() => 0.5 - Math.random());
  
  // Seleccionar algunos no usados y completar con ejercicios ya vistos
  const nonRepeating = availableExercises.slice(0, EXERCISES_TO_SHOW);
  const repeatingNeeded = EXERCISES_TO_SHOW - nonRepeating.length;
  
  // Seleccionar ejercicios del historio que no estén ya seleccionados
  const repeatingExercises = allShuffled
    .filter(ex => !nonRepeating.some(nr => nr.id === ex.id))
    .slice(0, repeatingNeeded);
  
  return [...nonRepeating, ...repeatingExercises];
};

const WritingExercise = ({ onComplete }: { onComplete: () => void }) => {
  const [allInstructions, setAllInstructions] = useState<Instruction[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar instrucciones desde un archivo JSON externo
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch('escrituras/writing-instructions.json');
        if (!response.ok) {
          throw new Error('No se pudieron cargar las instrucciones');
        }
        const data: Instruction[] = await response.json();
        setAllInstructions(data);
        
        // Obtener historial de localStorage
        const historyRaw = localStorage.getItem(EXERCISE_HISTORY_KEY);
        const history: number[] = historyRaw ? JSON.parse(historyRaw) : [];
        
        // Seleccionar ejercicios evitando repeticiones recientes
        const selected = getNonRepeatingExercises(data, history);
        setInstructions(selected);
        
        // Actualizar historial
        const newHistory = [
          ...selected.map(ex => ex.id),
          ...history
        ].slice(0, MAX_HISTORY_SIZE);
        
        localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(newHistory));
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las instrucciones');
        setLoading(false);
        console.error(err);
      }
    };

    fetchInstructions();
  }, []);

  // ... (resto del componente permanece igual)
  const handleNext = () => {
    if (currentInstruction < instructions.length - 1) {
      setCurrentInstruction(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center">
            <div className="flex items-center justify-center mb-4">
              <FaBook className="text-4xl mr-4 animate-pulse" />
              <FaPen className="text-3xl animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold">Ejercicio de Escritura</h1>
            <p className="mt-2 text-blue-100">Cargando instrucciones...</p>
          </div>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Preparando el ejercicio</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white text-center">
            <div className="flex items-center justify-center mb-4">
              <FaBook className="text-4xl mr-4" />
              <FaPen className="text-3xl" />
            </div>
            <h1 className="text-3xl font-bold">Error en el ejercicio</h1>
          </div>
          <div className="p-8 text-center">
            <div className="text-2xl text-red-600 font-bold mb-4">{error}</div>
            <p className="text-gray-700 mb-6">
              No se pudieron cargar las instrucciones. Por favor, inténtalo de nuevo más tarde.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cabecera con icono de libreta */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <div className="flex items-center justify-center mb-3">
            <FaBook className="text-4xl mr-4" />
            <FaPen className="text-3xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Ejercicio de Escritura</h1>
          <p className="text-blue-100">
            <span className="inline-flex items-center">
              <FaPencilAlt className="mr-2" />
              Requiere libreta y lápiz
            </span>
          </p>
        </div>
        
        {/* Progreso 
        <div className="px-6 py-4 bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">
              Progreso: {currentInstruction + 1}/{instructions.length}
            </span>
            <span className="text-sm font-medium text-blue-700">
              {completed ? "¡Completado!" : "En progreso"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ 
                width: `${completed ? 100 : (currentInstruction / (instructions.length - 1)) * 100}%` 
              }}
            />
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6 md:p-8">
          {!completed ? (
            <motion.div
              key={currentInstruction}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              
              {/* Instrucción actual */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-800 mb-3">
                  {instructions[currentInstruction].title}
                </h2>
                
                <div className="text-4xl text-gray-700 mb-6 bg-white p-6 rounded-lg border-4 border-blue-300 shadow-md">
  {instructions[currentInstruction].description}
</div>
                
                <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-lg">
                  <p className="flex items-center text-blue-700">
                    <FaPencilAlt className="mr-3 text-blue-600" />
                    <span>Escribe esta información en tu libreta</span>
                  </p>
                </div>
              </div>
              {/* Sección destacada con icono de escritura */}
              <div className="flex flex-col items-center bg-yellow-50 p-5 rounded-xl border-2 border-yellow-200 mb-6">
                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                  <FaPencilAlt className="text-3xl text-yellow-600" />
                </div>
                <p className="text-center text-yellow-700 font-medium">
                  Este ejercicio se realiza fuera de la aplicación
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                <motion.button
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>
                    {currentInstruction < instructions.length - 1 
                      ? "Siguiente instrucción" 
                      : "He completado la escritura"}
                  </span>
                  <FaCheck className="ml-3" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-600 text-4xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Excelente trabajo!
              </h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full mr-4">
                    <FaBook className="text-2xl text-blue-600" />
                  </div>
                  <div className="bg-blue-100 p-4 rounded-full">
                    <FaPen className="text-2xl text-blue-600" />
                  </div>
                </div>
                <p className="text-gray-600 max-w-md">
                  Has completado todas las instrucciones de escritura manual.
                </p>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mb-8">
                <h3 className="font-bold text-yellow-800 mb-3 text-xl">
                  Último paso: Comparte tu trabajo
                </h3>
                <p className="text-gray-700 mb-4">
                  Toma una foto de lo que escribiste en tu libreta y envíala por WhatsApp:
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <ol className="list-decimal list-inside space-y-2 text-left">
                    <li className="mb-2">Abre la aplicación de WhatsApp en tu teléfono</li>
                    <li className="mb-2">Envía la foto por WhatsApp</li>
                    <li>Espera confirmación de que hemos recibido tu foto</li>
                  </ol>
                </div>
                
                <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200">
                  <FaWhatsapp className="text-3xl text-green-600 mr-3" />
                  <p className="text-green-700">
                    Al enviar la foto completarás este ejercicio
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handleComplete}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg flex items-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>He enviado la foto</span>
                <FaWhatsapp className="ml-3 text-xl" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      

    </div>
  );
};

export default WritingExercise;