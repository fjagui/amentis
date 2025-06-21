"use client";  // Asegúrate de que este componente es de cliente

import { useState, useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa"; // Asegúrate de tener instalado react-icons
import { motion } from "framer-motion"; // Asegúrate de tener instalado framer-motion
import { Howl } from "howler";  // Importar howler.js para los sonidos

// Cargar los sonidos
const correcto = new Howl({ src: ["/sounds/correcto.mp3"] }); // Sonido de acierto
const incorrecto = new Howl({ src: ["/sounds/incorrecto.mp3"] }); // Sonido de error
const boton = new Howl({ src: ["/sounds/pulsa.mp3"] }); // Sonido al pulsar el botón

const ReadingComprehension = ({ onComplete }: { onComplete: () => void; }) =>  {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [ejercicioActual, setEjercicioActual] = useState<any>(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState<any[]>([]);
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [leido, setLeido] = useState<boolean>(false); // Para saber si el usuario ha leído el texto
  const [preguntaActual, setPreguntaActual] = useState<number>(1); // Indicador de la pregunta actual
  const [respuestasCorrectas, setRespuestasCorrectas] = useState<number>(0); // Contador de respuestas correctas
  const [completado, setCompletado] = useState<boolean>(false); // Para saber si el ejercicio ha terminado
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Cargar los ejercicios de la API o el archivo JSON
  useEffect(() => {
    fetch("/text.json") // Ruta al archivo JSON con los textos
      .then((response) => response.json())
      .then((data) => setEjercicioActual(data[0])); // Usamos el primer ejercicio del JSON
  }, []);

  if (!ejercicioActual) {
    return <div className="text-center p-10">Cargando ejercicio...</div>;
  }

  const handleRespuesta = (respuestaSeleccionada: number) => {
    const pregunta = ejercicioActual.preguntas[currentPreguntaIndex];
    const esCorrecta = pregunta.respuestaCorrecta === respuestaSeleccionada;

    setRespuestasUsuario((prev) => [...prev, { preguntaId: pregunta.id, esCorrecta }]);

    if (esCorrecta) {
      setFeedback("¡Respuesta correcta!");
      correcto.play(); // Sonido de acierto
      setRespuestasCorrectas(respuestasCorrectas + 1); // Incrementar el contador de respuestas correctas
    } else {
      setFeedback("Respuesta incorrecta. Intenta de nuevo.");
      incorrecto.play(); // Sonido de error
    }

    // Avanzar a la siguiente pregunta
    if (currentPreguntaIndex < ejercicioActual.preguntas.length - 1) {
      setTimeout(() => {
        setPreguntaActual((prev) => prev + 1); // Aumentar el indicador de pregunta
        setCurrentPreguntaIndex((prev) => prev + 1);
        setFeedback(null); // Resetear el feedback
      }, 1500); // Pausa de 1.5 segundos antes de pasar a la siguiente pregunta
    } else {
      // Si hemos terminado todas las preguntas, mostrar mensaje de finalización
      setCompletado(true); // Marcar el ejercicio como completado
      return;
    }
  };

  const handlePasarPreguntas = () => {
    setLeido(true); // Marcar que el usuario ha leído el texto y puede pasar a las preguntas
  };

  // Reemplazar los saltos de línea con <br /> en el texto
  const textoConSaltos = ejercicioActual.texto.replace(/\n/g, "<br />");

  // Reiniciar todo el ejercicio
  const handleReintentar = () => {
    setLeido(false);
    setRespuestasUsuario([]);
    setPreguntaActual(1);
    setCurrentPreguntaIndex(0);
    setRespuestasCorrectas(0);
    setFeedback(null);
    setCompletado(false); // Resetear estado de completado
  };

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      {/* Texto para lectura con marco y estilos mejorados */}
      {!leido && (
        <div className="w-full max-w-3xl p-8 mb-6 rounded-xl border-4 border-gray-300 bg-white shadow-lg">
          <h2 className="text-4xl font-bold text-gray-700 mb-4 text-center">{ejercicioActual.titulo}</h2>
          <div
            className="text-xl text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: textoConSaltos }}
          />
        </div>
      )}

      {/* Botón para pasar a las preguntas */}
      {!leido && (
        <motion.button
          onClick={handlePasarPreguntas}
          className="mt-4 px-8 py-4 bg-blue-600 text-white font-bold text-xl rounded-2xl shadow-md hover:bg-blue-700 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Leer todo, ahora responder
        </motion.button>
      )}

      {/* Mostrar las preguntas una vez que se haya leído el texto */}
      {leido && (
        <div className="w-full max-w-3xl p-8 mb-6 rounded-xl border-4 border-gray-300 bg-white shadow-lg">
          {/* Indicador de la pregunta */}
          <div className="text-xl font-bold text-gray-700 mb-4">
            Pregunta {preguntaActual} de {ejercicioActual.preguntas.length}
          </div>

          {/* Mostrar la pregunta actual */}
          <div className="mb-6">
            <div className="text-2xl font-semibold">{ejercicioActual.preguntas[currentPreguntaIndex].pregunta}</div>
            <div className="space-y-6 mt-4">
              {ejercicioActual.preguntas[currentPreguntaIndex].opciones.map((opcion: string, i: number) => (
                <div
                  key={i}
                  className="p-6 bg-blue-500 text-white text-2xl font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                  <button onClick={() => handleRespuesta(i)} className="w-full">
                    {opcion}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback sobre la respuesta */}
          {feedback && (
            <div className={`mt-6 text-2xl font-bold ${feedback.includes("incorrecta") ? "text-red-500" : "text-green-500"}`}>
              {feedback}
            </div>
          )}
        </div>
      )}

      {/* Botón para volver a intentar */}
      {completado && (
        <motion.button
          onClick={handleReintentar}
          className="mt-6 px-8 py-4 bg-gray-600 text-white font-bold text-xl rounded-2xl shadow-md hover:bg-gray-700 transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Volver a intentar
        </motion.button>
      )}
    </div>
  );
};

export default ReadingComprehension;

