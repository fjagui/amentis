"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";

// Cargar los sonidos
const correcto = new Howl({ src: ["/sounds/correcto.mp3"] });
const incorrecto = new Howl({ src: ["/sounds/incorrecto.mp3"] });

const ReadingComprehension = ({ onComplete }: { onComplete: () => void }) => {
  const [historiaActual, setHistoriaActual] = useState<any>(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState<any[]>([]);
  const [currentPreguntaIndex, setCurrentPreguntaIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [leido, setLeido] = useState<boolean>(false);
  const [preguntaActual, setPreguntaActual] = useState<number>(1);
  const [respuestasCorrectas, setRespuestasCorrectas] = useState<number>(0);
  const [completado, setCompletado] = useState<boolean>(false);

  // Cargar y seleccionar historia basada en la fecha
  useEffect(() => {
    const mesActual = new Date().getMonth() + 1; // 1-12
    fetch('lecturas/'+mesActual+'.json')
      .then((response) => response.json())
      .then((data) => {
        const hoy = new Date();
        const diaDelMes = hoy.getDate();
        
        // Seleccionar historia basada en el día del mes
        const historiaIndex = diaDelMes % data.length;
        
        //setHistoriaActual(data[historiaIndex]);
        setHistoriaActual(data[3]);

      });
  }, []);

  if (!historiaActual) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Cargando historia del día...</div>
      </div>
    );
  }

  const handleRespuesta = (respuestaSeleccionada: number) => {
    const pregunta = historiaActual.preguntas[currentPreguntaIndex];
    const esCorrecta = pregunta.respuestaCorrecta === respuestaSeleccionada;

    setRespuestasUsuario((prev) => [...prev, { preguntaId: pregunta.id, esCorrecta }]);

    if (esCorrecta) {
      setFeedback("¡Respuesta correcta!");
      correcto.play();
      setRespuestasCorrectas(respuestasCorrectas + 1);
    } else {
      setFeedback("Respuesta incorrecta. Intenta de nuevo.");
      incorrecto.play();
    }

    if (currentPreguntaIndex < historiaActual.preguntas.length - 1) {
      setTimeout(() => {
        setPreguntaActual((prev) => prev + 1);
        setCurrentPreguntaIndex((prev) => prev + 1);
        setFeedback(null);
      }, 1500);
    } else {
      setCompletado(true);
    }
  };

  const handlePasarPreguntas = () => {
    setLeido(true);
  };

  const handleReintentar = () => {
    setLeido(false);
    setRespuestasUsuario([]);
    setPreguntaActual(1);
    setCurrentPreguntaIndex(0);
    setRespuestasCorrectas(0);
    setFeedback(null);
    setCompletado(false);
  };

  const textoConSaltos = historiaActual.texto.replace(/\n/g, "<br />");

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 pt-10">
      {!leido && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl p-8 mb-6 rounded-xl border-4 border-gray-300 bg-white shadow-lg"
        >
          <div className="text-sm text-gray-500 mb-2">
            Historia del día {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">{historiaActual.titulo}</h2>
          <div
            className="text-xl text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: textoConSaltos }}
          />
        </motion.div>
      )}

      {!leido && (
        <motion.button
          onClick={handlePasarPreguntas}
          className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-md hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continuar a las preguntas
        </motion.button>
      )}

      {leido && !completado && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-3xl p-6 mb-6 rounded-xl border-4 border-gray-300 bg-white shadow-lg"
        >
          <div className="text-lg font-semibold text-gray-600 mb-3">
            Pregunta {preguntaActual} de {historiaActual.preguntas.length}
          </div>

          <div className="mb-6">
            <div className="text-xl font-semibold mb-4">
              {historiaActual.preguntas[currentPreguntaIndex].pregunta}
            </div>
            <div className="space-y-3">
              {historiaActual.preguntas[currentPreguntaIndex].opciones.map(
                (opcion: string, i: number) => (
                  <motion.button
                    key={i}
                    onClick={() => handleRespuesta(i)}
                    className="w-full p-4 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-600 transition text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {opcion}
                  </motion.button>
                )
              )}
            </div>
          </div>

          {feedback && (
            <div className={`mt-4 text-lg font-bold ${
              feedback.includes("incorrecta") ? "text-red-500" : "text-green-500"
            }`}>
              {feedback}
            </div>
          )}
        </motion.div>
      )}

      {completado && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-green-600 mb-4">
            ¡Ejercicio completado!
          </div>
          <div className="text-xl mb-6">
            Puntuación: {respuestasCorrectas} de {historiaActual.preguntas.length}
          </div>
          
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={handleReintentar}
              className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Repetir ejercicio
            </motion.button>
            
            <motion.button
              onClick={onComplete}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Finalizar
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReadingComprehension;