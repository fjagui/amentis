"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego
const sonidoAcierto = new Howl({ src: ["/sounds/green.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/red.mp3"] });
const sonidoClick = new Howl({ src: ["/sounds/blue.mp3"] });

const JuegoTangram = ({ onComplete }: { onComplete: () => void }) => {
  // Figuras disponibles para el tangram
  const figurasTangram = [
    {
      nombre: "Casa",
      silueta: "M50,10 L90,50 L10,50 Z M10,50 L90,50 L50,90 Z",
      solucion: [
        { tipo: "triangulo_grande", x: 50, y: 10, rotacion: 0 },
        { tipo: "triangulo_grande", x: 50, y: 90, rotacion: 180 },
        { tipo: "triangulo_mediano", x: 50, y: 50, rotacion: 270 },
        { tipo: "cuadrado", x: 30, y: 70, rotacion: 0 },
        { tipo: "paralelogramo", x: 70, y: 70, rotacion: 0 },
        { tipo: "triangulo_pequeno", x: 10, y: 50, rotacion: 0 },
        { tipo: "triangulo_pequeno", x: 90, y: 50, rotacion: 180 }
      ]
    },
    {
      nombre: "Gato",
      silueta: "M30,30 L70,30 L90,70 L70,90 L30,90 L10,70 Z",
      solucion: [
        { tipo: "triangulo_grande", x: 30, y: 30, rotacion: 0 },
        { tipo: "triangulo_grande", x: 70, y: 30, rotacion: 90 },
        { tipo: "triangulo_mediano", x: 50, y: 70, rotacion: 180 },
        { tipo: "cuadrado", x: 50, y: 50, rotacion: 45 },
        { tipo: "paralelogramo", x: 70, y: 70, rotacion: 270 },
        { tipo: "triangulo_pequeno", x: 10, y: 70, rotacion: 0 },
        { tipo: "triangulo_pequeno", x: 90, y: 70, rotacion: 180 }
      ]
    },

  ];

  const [figuraActual, setFiguraActual] = useState<any>(null);
  const [mostrarSolucion, setMostrarSolucion] = useState(false);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [figurasCompletadas, setFigurasCompletadas] = useState(0);

  // Generar una nueva figura aleatoria
  const generarNuevaFigura = () => {
    const randomIndex = Math.floor(Math.random() * figurasTangram.length);
    setFiguraActual(figurasTangram[randomIndex]);
    setMostrarSolucion(false);
  };

  // Manejar cuando se completa una figura
  const handleCompletado = () => {
    sonidoAcierto.play();
    setFigurasCompletadas(prev => prev + 1);
    
    if (figurasCompletadas + 1 >= 3) {
      setFiguraActual(null);
      onComplete();
    } else {
      generarNuevaFigura();
    }
  };

  // Mostrar/ocultar solución
  const toggleSolucion = () => {
    sonidoClick.play();
    setMostrarSolucion(!mostrarSolucion);
  };

  useEffect(() => {
    generarNuevaFigura();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-50 p-8 space-y-8">
      {mostrarInstrucciones ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Instrucciones del Tangram</h2>
          <p className="mb-4">
            Recrea la figura mostrada usando las 7 piezas del tangram.
          </p>
          <p className="mb-4">
            Puedes usar el botón de ayuda para ver la solución si lo necesitas.
          </p>
          <motion.button
            onClick={() => setMostrarInstrucciones(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Comenzar
          </motion.button>
        </motion.div>
      ) : figuraActual ? (
        <>
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Juego de Tangram</h1>
            <div className="text-xl font-semibold mb-6">
              Figura: {figuraActual.nombre} ({figurasCompletadas}/3 completadas)
            </div>
          </div>

          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Recrea esta figura:</h2>
            
            <div className="relative border-2 border-gray-300 rounded-lg aspect-square mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path 
                  d={figuraActual.silueta} 
                  fill="black" 
                  stroke="black"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            <div className="flex justify-center gap-6">
              <motion.button
                onClick={toggleSolucion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold shadow-md"
              >
                {mostrarSolucion ? "Ocultar Ayuda" : "Mostrar Ayuda"}
              </motion.button>
              
              <motion.button
                onClick={handleCompletado}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-md"
              >
                Figura Completada
              </motion.button>
            </div>
          </div>

          {/* Área de solución */}
          <AnimatePresence>
            {mostrarSolucion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg mt-4 overflow-hidden"
              >
                <h3 className="text-xl font-semibold mb-4 text-center">Solución:</h3>
                <div className="relative border-2 border-gray-300 rounded-lg aspect-square">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Aquí iría la representación de las piezas en su posición correcta */}
                    <text x="50" y="50" textAnchor="middle" fontSize="8" fill="#666">
                      Visualización de la solución con las piezas del tangram
                    </text>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">¡Juego Completado!</h2>
          <p className="mb-6">Has completado todas las figuras del tangram.</p>
          <motion.button
            onClick={() => {
              setFigurasCompletadas(0);
              generarNuevaFigura();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Jugar de Nuevo
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default JuegoTangram;