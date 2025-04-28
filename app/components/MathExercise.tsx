"use client";  // Asegúrate de que este componente es de cliente

import { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa"; // Asegúrate de tener instalado react-icons
import { motion } from "framer-motion"; // Asegúrate de tener instalado framer-motion

interface Ejercicio {
  num1: number;
  num2: number;
  operador: "+" | "-";
  respuestaCorrecta: number;
}

const generarEjercicio = (): Ejercicio => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const esSuma = Math.random() > 0.5;
  const operador = esSuma || num2 > num1 ? "+" : "-";
  const respuestaCorrecta = operador === "+" ? num1 + num2 : num1 - num2;
  return { num1, num2, operador, respuestaCorrecta };
};

const MathExercise = () => {
  const [ejercicioActual, setEjercicioActual] = useState<Ejercicio | null>(null);
  const [respuestas, setRespuestas] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Estado para verificar si la respuesta es correcta o incorrecta
  const [currentExercise, setCurrentExercise] = useState<number>(1); // Contador de ejercicios
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Generar el primer ejercicio cuando el componente se monta
  useEffect(() => {
    const ejercicio = generarEjercicio();
    setEjercicioActual(ejercicio);
    setRespuestas(""); // Limpiar respuesta anterior
    setIsCorrect(null); // Resetear estado
    if (inputRef.current) {
      inputRef.current.focus(); // Focalizar el input del primer ejercicio
    }
  }, []);

  const handleInputChange = (valor: string) => {
    setRespuestas((prev) => prev + valor);
  };

  const handleBorrar = () => {
    setRespuestas(""); // Limpiar la respuesta del ejercicio
    setIsCorrect(null); // Resetear el estado de respuesta correcta o incorrecta
  };

  const handleValidar = () => {
    if (parseInt(respuestas) === ejercicioActual?.respuestaCorrecta) {
      setIsCorrect(true); // Establecer la respuesta como correcta
      if (currentExercise < 10) {
        // Pausa de 2 segundos antes de cargar el siguiente ejercicio
        setTimeout(() => {
          const siguienteEjercicio = generarEjercicio();
          setEjercicioActual(siguienteEjercicio);
          setRespuestas(""); // Limpiar respuesta anterior
          setCurrentExercise(currentExercise + 1); // Avanzar al siguiente ejercicio
          setIsCorrect(null); // Resetear estado de respuesta correcta o incorrecta
        }, 2000); // Pausa de 2 segundos
      } else {
        alert("¡Has completado los 10 ejercicios!");
      }
    } else {
      setIsCorrect(false); // Respuesta incorrecta
    }
  };

  if (!ejercicioActual) {
    return <div className="text-center p-10">Cargando ejercicio...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        {/* Contador de ejercicio */}
        <div className="text-xl font-bold text-gray-700 mb-4">
          <span>Ejercicio {currentExercise} de 10</span>
        </div>

        {/* Marco envolviendo operación y input */}
        <div
          className={`w-full max-w-3xl p-6 mb-6 rounded-xl border-4 ${isCorrect === true ? 'border-green-500 bg-green-100' : isCorrect === false ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-gray-50'}`}
        >
          {/* Operación */}
          <div className="flex items-center justify-center text-6xl font-bold text-blue-700 mb-4 space-x-2">
            <span className="bg-yellow-300 rounded-full px-6 py-4 text-5xl">{ejercicioActual.num1}</span>
            <span
              className={`px-6 py-4 rounded-full text-5xl ${
                ejercicioActual.operador === "+" ? "bg-green-300" : "bg-red-300"
              }`}
            >
              {ejercicioActual.operador}
            </span>
            <span className="bg-yellow-300 rounded-full px-6 py-4 text-5xl">{ejercicioActual.num2}</span>
            <span className="text-5xl">= ?</span>
          </div>

          {/* Input para la respuesta */}
          <div className="flex items-center">
            <input
              type="text"
              value={respuestas}
              onChange={(e) => handleInputChange(e.target.value)}
              readOnly={false}
              ref={inputRef}
              className="mt-4 p-4 border-2 rounded-lg text-4xl text-center w-full bg-gray-100 cursor-pointer"
            />
            {/* Botón de validación con icono check */}
            <motion.button
              onClick={handleValidar}
              className="ml-4 p-4 rounded-full bg-green-600 text-white shadow-md hover:bg-green-700 transition transform hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheck size={30} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Teclado numérico */}
      <div className="grid grid-cols-10 gap-3 w-full max-w-4xl mt-8">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleInputChange(i.toString())}
            className="p-6 text-4xl font-bold bg-blue-500 text-white rounded-2xl shadow-md hover:bg-blue-600 transition"
          >
            {i}
          </button>
        ))}
        <button
          onClick={handleBorrar}
          className="p-6 text-4xl font-bold bg-red-500 text-white rounded-2xl shadow-md hover:bg-red-600 transition"
        >
          ⌫
        </button>
      </div>

      {/* Botón nueva ronda */}
      {currentExercise <= 10 && (
        <button
          onClick={() => {
            setEjercicioActual(generarEjercicio());
            setRespuestas(""); // Limpiar respuesta
          }}
          className="mt-8 px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-2xl shadow-md hover:bg-green-700 transition"
        >
          🔄 Nueva Ronda
        </button>
      )}
    </div>
  );
};

export default MathExercise;

