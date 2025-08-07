"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaCheck, FaGlassWhiskey } from "react-icons/fa";

// Constante para determinar el número de rondas
const NUMBER_OF_ROUNDS = 3;

const VasosExercise = ({ onComplete }: { onComplete: () => void }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [cardNumbers, setCardNumbers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  
  // Generar números de carta aleatorios al cargar
  useEffect(() => {
    const generateCardNumbers = () => {
      const numbers: number[] = [];
      for (let i = 0; i < NUMBER_OF_ROUNDS; i++) {
        numbers.push(Math.floor(Math.random() * 50) + 1);
      }
      return numbers;
    };
    
    setCardNumbers(generateCardNumbers());
  }, []);

  const handleNextRound = () => {
    if (currentRound < NUMBER_OF_ROUNDS - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleFinalComplete = () => {
    onComplete();
  };

  // Si aún no se han generado los números de carta
  if (cardNumbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white text-center">
            <div className="flex items-center justify-center mb-3">
              <FaGlassWhiskey className="text-4xl mr-4" />
              <FaGlassWhiskey className="text-3xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Preparando ejercicio</h1>
          </div>
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generando cartas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cabecera con indicador de ronda */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white text-center">
          <div className="flex items-center justify-center mb-3">
            <FaGlassWhiskey className="text-4xl mr-4" />
            <FaGlassWhiskey className="text-3xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Ejercicio de Vasos</h1>
          <p className="text-purple-100">
            Ronda {currentRound + 1} de {NUMBER_OF_ROUNDS}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="p-6 md:p-8">
          {!completed ? (
            <motion.div
              key={currentRound}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Instrucción principal */}
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                <h2 className="text-2xl font-bold text-purple-800 mb-4">
                  Instrucciones para esta ronda
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                      1
                    </div>
                    <p className="text-gray-700">
                      Busca la carta número: 
                      <span className="inline-block ml-2 px-4 py-2 bg-white text-3xl font-bold text-purple-600 border-2 border-purple-300 rounded-lg">
                        {cardNumbers[currentRound]}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                      2
                    </div>
                    <p className="text-gray-700">
                      Construye la imagen usando tus vasos de colores según las indicaciones de la carta
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Sección destacada */}
              <div className="flex flex-col items-center bg-yellow-50 p-5 rounded-xl border-2 border-yellow-200 mb-6">
                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                  <FaGlassWhiskey className="text-3xl text-yellow-600" />
                </div>
                <p className="text-center text-yellow-700 font-medium text-lg">
                  Este ejercicio se realiza fuera de la aplicación usando tus vasos físicos
                </p>
              </div>
              
              <div className="mt-8 flex justify-center">
                <motion.button
                  onClick={handleNextRound}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>
                    {currentRound < NUMBER_OF_ROUNDS - 1 
                      ? "Siguiente ronda" 
                      : "Finalizar ejercicio"}
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
                ¡Ejercicio completado!
              </h2>
              
              <div className="bg-purple-50 p-5 rounded-xl border border-purple-200 mb-6">
                <h3 className="text-xl font-bold text-purple-800 mb-3">
                  Cartas utilizadas en este ejercicio:
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {cardNumbers.map((number, index) => (
                    <div 
                      key={index} 
                      className="px-4 py-3 bg-white text-xl font-bold text-purple-600 border-2 border-purple-300 rounded-lg"
                    >
                      Carta #{number}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mb-8">
                <h3 className="font-bold text-yellow-800 mb-3 text-xl">
                  Último paso: Comparte tus creaciones
                </h3>
                <p className="text-gray-700 mb-4">
                  Toma fotos de todas las imágenes que construiste ({NUMBER_OF_ROUNDS} en total) y envíalas por WhatsApp:
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <ol className="list-decimal list-inside space-y-2 text-left">
                    <li className="mb-2">Abre WhatsApp en tu teléfono</li>
                    <li className="mb-2">Envía las fotos de tus construcciones</li>
                    <li>Espera nuestra confirmación de recepción</li>
                  </ol>
                </div>
                
                <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200">
                  <FaWhatsapp className="text-3xl text-green-600 mr-3" />
                  <p className="text-green-700">
                    Al enviar las fotos completarás este ejercicio
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handleFinalComplete}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-xl shadow-lg flex items-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>He enviado las fotos</span>
                <FaWhatsapp className="ml-3 text-xl" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VasosExercise;