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
  const [ejercicioActual, setEjercicioActual] = useState<Ejercicio | null>(null);
  const [respuestas, setRespuestas] = useState<string>("");
  const [ultimaRespuestaCorrecta, setUltimaRespuestaCorrecta] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Generar el primer ejercicio cuando el componente se monta
  useEffect(() => {
    const ejercicio = generarEjercicio();
    setEjercicioActual(ejercicio);
    setRespuestas(""); // Limpiar respuesta anterior
    if (inputRef.current) {
      inputRef.current.focus(); // Focalizar el input del primer ejercicio
    }
  }, []);

  useEffect(() => {
    if (ultimaRespuestaCorrecta !== null) {
      // Avanzar al siguiente ejercicio después de una respuesta correcta
      const siguienteEjercicio = generarEjercicio();
      setEjercicioActual(siguienteEjercicio);
      setRespuestas(""); // Limpiar respuesta anterior
      setUltimaRespuestaCorrecta(null);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus(); // Focalizar el input para el siguiente ejercicio
        }
      }, 200);
    }
  }, [ultimaRespuestaCorrecta]);

  const handleInputChange = (valor: string) => {
    setRespuestas((prev) => prev + valor);

    if (parseInt(respuestas + valor) === ejercicioActual?.respuestaCorrecta) {
      setUltimaRespuestaCorrecta(1); // Marcamos la respuesta como correcta
    }
  };

  const handleBorrar = () => {
    setRespuestas(""); // Limpiar la respuesta del ejercicio
  };

  if (!ejercicioActual) {
    return <div className="text-center p-10">Cargando ejercicio...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <div className="flex items-center justify-center text-4xl font-bold text-blue-700 mb-4 space-x-2">
          <span className="bg-yellow-300 rounded-full px-4 py-2">{ejercicioActual.num1}</span>
          <span
            className={`px-3 py-1 rounded-full ${
              ejercicioActual.operador === "+" ? "bg-green-300" : "bg-red-300"
            }`}
          >
            {ejercicioActual.operador}
          </span>
          <span className="bg-yellow-300 rounded-full px-4 py-2">{ejercicioActual.num2}</span>
          <span>= ?</span>
        </div>
        <input
          type="text"
          value={respuestas}
          onChange={(e) => handleInputChange(e.target.value)}
          readOnly={false}
          ref={inputRef}
          className="mt-4 p-4 border border-gray-400 rounded-lg text-2xl text-center w-full bg-gray-100 cursor-pointer"
        />
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
        onClick={() => {
          setEjercicioActual(generarEjercicio());
          setRespuestas(""); // Limpiar respuesta
        }}
        className="mt-8 px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-2xl shadow-md hover:bg-green-700 transition"
      >
        🔄 Nueva Ronda
      </button>
    </div>
  );
};

export default MathExercise;
