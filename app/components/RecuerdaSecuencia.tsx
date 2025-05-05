"use client";

import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

const sonidoRojo = new Howl({ src: ["/sounds/red.mp3"] });
const sonidoVerde = new Howl({ src: ["/sounds/green.mp3"] });
const sonidoAzul = new Howl({ src: ["/sounds/blue.mp3"] });
const sonidoAmarillo = new Howl({ src: ["/sounds/yellow.mp3"] });

const RecuerdaSecuencia = () => {
  const colores = ["red", "green", "blue", "yellow"];
  const [secuencia, setSecuencia] = useState<string[]>([]);
  const [jugadorSecuencia, setJugadorSecuencia] = useState<string[]>([]);
  const [nivel, setNivel] = useState<number>(1);
  const [jugando, setJugando] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [botonesActivos, setBotonesActivos] = useState<string[]>([]);
  const mensajesAnimaciones = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 20 }  };
  const generarSecuencia = () => {
    const nuevaSecuencia = Array.from({ length: nivel }, () => 
      colores[Math.floor(Math.random() * colores.length)]
    );
    setSecuencia(nuevaSecuencia);
  };

  const reproducirSecuencia = (sec: string[]) => {
    setFeedback(`Nivel ${nivel}: Memoriza ${sec.length} color${sec.length > 1 ? "es" : ""}`);
    sec.forEach((color, index) => {
      setTimeout(() => iluminarBoton(color), (index + 1) * 1000);
    });
  };

  const iluminarBoton = (color: string) => {
    setBotonesActivos(prev => [...prev, color]);
    obtenerSonido(color).play();
    setTimeout(() => {
      setBotonesActivos(prev => prev.filter(c => c !== color));
    }, 800);
  };

  const obtenerSonido = (color: string) => {
    switch(color) {
      case "red": return sonidoRojo;
      case "green": return sonidoVerde;
      case "blue": return sonidoAzul;
      case "yellow": return sonidoAmarillo;
      default: return sonidoRojo;
    }
  };

  const handleBotonClick = (color: string) => {
    if (!jugando || botonesActivos.length > 0) return;

    const nuevaSecuencia = [...jugadorSecuencia, color];
    setJugadorSecuencia(nuevaSecuencia);
    iluminarBoton(color);

    setTimeout(() => {
      if (nuevaSecuencia[nuevaSecuencia.length - 1] !== secuencia[nuevaSecuencia.length - 1]) {
        manejarError();
        return;
      }

      if (nuevaSecuencia.length === secuencia.length) {
        if (nivel === 5) {
          setFeedback("¡Victoria final! 🎉");
          setJugando(false);
        } else {
          setFeedback("¡Nivel superado! ⚡");
          setTimeout(() => {
            setNivel(prev => prev + 1);
            setJugadorSecuencia([]);
          }, 1500);
        }
      }
    }, 500);
  };

  const manejarError = () => {
    setFeedback("❌ Secuencia incorrecta");
    setJugando(false);
    setTimeout(() => {
      setNivel(1);
      setSecuencia([]);
      setJugadorSecuencia([]);
      setFeedback(null);
    }, 2000);
  };

  const iniciarJuego = () => {
    setJugando(true);
    setNivel(1);
    setFeedback("Iniciando nivel 1...");
    setTimeout(generarSecuencia, 1500);
  };

  const reiniciarJuego = () => {
    setJugando(false);
    setFeedback("Juego reiniciado");
    setTimeout(() => {
      setNivel(1);
      setSecuencia([]);
      setJugadorSecuencia([]);
      setFeedback(null);
    }, 1000); // Esperar a que termine la animación
  };

  useEffect(() => {
    if (jugando && nivel > 1) {
      setFeedback(`Siguiente nivel: ${nivel}`);
      setTimeout(() => {
        generarSecuencia();
        setFeedback(null);
      }, 1500); // Mostrar mensaje antes de generar secuencia
    }
  }, [nivel]);

  useEffect(() => {
    if (secuencia.length > 0 && jugando) {
      reproducirSecuencia(secuencia);
      setTimeout(() => setFeedback("¡Tu turno! 👆"), (secuencia.length + 1) * 1000);
    }
  }, [secuencia]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 space-y-10">
      <motion.h1 
        className="text-5xl font-bold text-gray-800 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Memoria de Secuencias
      </motion.h1>

      
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback}
            {...mensajesAnimaciones}
            className={`text-3xl font-bold text-center ${
              feedback.includes("❌") ? "text-red-600" :
              feedback.includes("¡Victoria") ? "text-purple-600" :
              "text-gray-700"
            }`}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-10 my-12">
        {colores.map((color) => (
          <motion.div
            key={color}
            onClick={() => handleBotonClick(color)}
            className={`w-40 h-40 rounded-full cursor-pointer shadow-2xl transition-all duration-300 ${
              botonesActivos.includes(color) 
                ? "opacity-100 scale-110" 
                : "opacity-50 hover:opacity-70"
            }`}
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="text-3xl font-semibold text-gray-700 bg-white px-8 py-4 rounded-full shadow-md">
          Nivel: {nivel}/5
        </div>

        <div className="flex gap-8">
          <motion.button
            onClick={iniciarJuego}
            className="px-12 py-6 bg-blue-600 text-white text-2xl rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={jugando}
          >
            {jugando ? "En progreso..." : "Nuevo Juego"}
          </motion.button>

          <motion.button
            onClick={reiniciarJuego}
            className="px-12 py-6 bg-red-600 text-white text-2xl rounded-2xl font-bold shadow-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reiniciar
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default RecuerdaSecuencia;