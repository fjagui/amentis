"use client";

import { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { Howl } from "howler";

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

// Cargar los sonidos
const correcto = new Howl({ src: ["/sounds/correcto.mp3"] });
const incorrecto = new Howl({ src: ["/sounds/incorrecto.mp3"] });
const boton = new Howl({ src: ["/sounds/pulsa.mp3"] });

const MathExercise = ({ onComplete }: { onComplete: () => void; }) => {
  const [ejercicioActual, setEjercicioActual] = useState<Ejercicio | null>(null);
  const [respuestas, setRespuestas] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentExercise, setCurrentExercise] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement | null>(null);

// Efecto para notificar completado
useEffect(() => {
  if (currentExercise === 10 && isCorrect) {
    const timer = setTimeout(() => {
      onComplete(); // Notifica al ExerciseManager
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [currentExercise, isCorrect, onComplete]);

  
  useEffect(() => {
    const ejercicio = generarEjercicio();
    setEjercicioActual(ejercicio);
    setRespuestas("");
    setIsCorrect(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (valor: string) => {
    setRespuestas((prev) => prev + valor);
    boton.play();
  };

  const handleBorrar = () => {
    setRespuestas("");
    setIsCorrect(null);
    boton.play(); // Reproduce el sonido al borrar
  };

  const handleValidar = () => {
    if (parseInt(respuestas) === ejercicioActual?.respuestaCorrecta) {
      setIsCorrect(true);
      correcto.play();
      if (currentExercise < 10) {
        setTimeout(() => {
          const siguienteEjercicio = generarEjercicio();
          setEjercicioActual(siguienteEjercicio);
          setRespuestas("");
          setCurrentExercise(currentExercise + 1);
          setIsCorrect(null);
        }, 2000);
      } 
    } else {
      setIsCorrect(false);
      incorrecto.play();
    }
  };

  if (!ejercicioActual) {
    return <div className="text-center p-10">Cargando ejercicio...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-2 py-4"> {/* Reducido padding lateral */}
      <div className="text-center w-full max-w-2xl"> {/* Ajustado ancho máximo */}
        <div className="text-xl font-bold text-gray-700 mb-3">
          <span>Ejercicio {currentExercise} de 10</span>
        </div>

        <div
          className={`w-full p-4 mb-4 rounded-xl border-4 ${isCorrect === true ? 'border-green-500 bg-green-100' : isCorrect === false ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-gray-50'}`}
        >
          <div className="flex items-center justify-center text-5xl font-bold text-blue-700 mb-3 space-x-2">
            <span className="bg-yellow-300 rounded-full px-4 py-2">{ejercicioActual.num1}</span>
            <span className={`px-4 py-2 rounded-full ${ejercicioActual.operador === "+" ? "bg-green-300" : "bg-red-300"}`}>
              {ejercicioActual.operador}
            </span>
            <span className="bg-yellow-300 rounded-full px-4 py-2">{ejercicioActual.num2}</span>
            <span>= ?</span>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              value={respuestas}
              onChange={(e) => handleInputChange(e.target.value)}
              className="mt-3 p-3 border-2 rounded-lg text-3xl text-center w-full bg-gray-100"
            />
            <motion.button
              onClick={handleValidar}
              className="ml-3 p-3 rounded-full bg-green-600 text-white"
            >
              <FaCheck size={24} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Teclado numérico en una sola línea */}
      <div className="w-full max-w-2xl">
        <div className="flex flex-wrap justify-center gap-2 mb-2"> {/* Una sola línea con wrap */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              onClick={() => handleInputChange(num.toString())}
              className="p-4 text-5xl font-bold bg-blue-500 text-white rounded-xl min-w-[60px]"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleBorrar}
            className="p-4 text-3xl font-bold bg-red-500 text-white rounded-xl min-w-[120px]"
          >
            ⌫
          </button>
        </div>
      </div>

      {currentExercise <= 10 && (
        <button
          onClick={() => {
            setEjercicioActual(generarEjercicio());
            setRespuestas("");
          }}
          className="mt-4 px-6 py-3 bg-green-600 text-white font-bold text-lg rounded-xl"
        >
          🔄 Nueva Ronda
        </button>
      )}
    </div>
  );
};
export default MathExercise;