"use client";

import { useState, useEffect, useRef } from "react";

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
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [ultimaRespuestaCorrecta, setUltimaRespuestaCorrecta] = useState<number | null>(null);
  const [focoIndex, setFocoIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  // 🔥 Al montar el componente (solo en cliente), genera ejercicios
  useEffect(() => {
    const nuevos = Array.from({ length: 10 }, generarEjercicio);
    setEjercicios(nuevos);
    setRespuestas(Array(10).fill(""));
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [ejercicios]); // Solo enfoca cuando haya ejercicios generados

  useEffect(() => {
    if (ultimaRespuestaCorrecta !== null) {
      const siguienteIndex = ultimaRespuestaCorrecta + 1;
      setTimeout(() => {
        if (inputRefs.current[siguienteIndex]) {
          inputRefs.current[siguienteIndex]?.focus();
          setFocoIndex(siguienteIndex);
        }
      }, 200);
    }
  }, [ultimaRespuestaCorrecta]);

  const handleInputChange = (valor: string) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[focoIndex] += valor;
    setRespuestas(nuevasRespuestas);

    if (parseInt(nuevasRespuestas[focoIndex]) === ejercicios[focoIndex]?.respuestaCorrecta) {
      setUltimaRespuestaCorrecta(focoIndex);
    }
  };

  const handleBorrar = () => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[focoIndex] = "";
    setRespuestas(nuevasRespuestas);
  };

  const generarNuevosEjercicios = () => {
    const nuevos = Array.from({ length: 10 }, generarEjercicio);
    setEjercicios(nuevos);
    setRespuestas(Array(10).fill(""));
    setUltimaRespuestaCorrecta(null);
    setFocoIndex(0);
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }, 100);
  };

  if (ejercicios.length === 0) {
    return <div className="text-center p-10">Cargando ejercicios...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-8xl mx-auto mb-4">
        {ejercicios.map((ejercicio, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md text-center border-2 ${
              respuestas[index] && parseInt(respuestas[index]) === ejercicio.respuestaCorrecta
                ? "bg-green-200 border-green-500"
                : "bg-white"
            }`}
            onClick={() => setFocoIndex(index)}
          >
            <div className="flex items-center justify-center text-4xl font-bold text-blue-700 mb-4 space-x-2">
              <span className="bg-yellow-300 rounded-full px-4 py-2">{ejercicio.num1}</span>
              <span
                className={`px-3 py-1 rounded-full ${
                  ejercicio.operador === "+" ? "bg-green-300" : "bg-red-300"
                }`}
              >
                {ejercicio.operador}
              </span>
              <span className="bg-yellow-300 rounded-full px-4 py-2">{ejercicio.num2}</span>
              <span>= ?</span>
            </div>
            <input
              type="text"
              value={respuestas[index]}
              readOnly
              ref={setInputRef(index)}
              className="mt-4 p-4 border border-gray-400 rounded-lg text-2xl text-center w-full bg-gray-100 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Teclado numérico */}
      <div className="grid grid-cols-10 gap-3 w-full max-w-4xl mt-8">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            onClick={() => handleInputChange(i.toString())}
            className="p-5 text-3xl font-bold bg-blue-500 text-white rounded-2xl shadow-md hover:bg-blue-600 transition"
          >
            {i}
          </button>
        ))}
        <button
          onClick={handleBorrar}
          className="p-5 text-3xl font-bold bg-red-500 text-white rounded-2xl shadow-md hover:bg-red-600 transition"
        >
          ⌫
        </button>
      </div>

      {/* Botón nueva ronda */}
      <button
        onClick={generarNuevosEjercicios}
        className="mt-8 px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-2xl shadow-md hover:bg-green-700 transition"
      >
        🔄 Nueva Ronda
      </button>
    </div>
  );
};

export default MathExercise;

