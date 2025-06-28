"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego
const sonidoAcierto = new Howl({ src: ["/sounds/green.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/red.mp3"] });
const sonidoPop = new Howl({ src: ["/sounds/pop.mp3"] });

const JuegoOrdenNumeros = ({ onComplete }: { onComplete: () => void }) => {
  const [numeros, setNumeros] = useState<number[]>([]);
  const [modo, setModo] = useState<"asc" | "desc">("asc");
  const [feedback, setFeedback] = useState<string>("");
  const [juegoCompletado, setJuegoCompletado] = useState(false);
  const [globosExplotados, setGlobosExplotados] = useState<number[]>([]);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [ultimoCorrecto, setUltimoCorrecto] = useState<number | null>(null);

  const generarNumerosAleatorios = () => {
    const nums = new Set<number>();
    while (nums.size < 10) {
      nums.add(Math.floor(Math.random() * 100) + 1);
    }
    return Array.from(nums);
  };

  const iniciarJuego = () => {
    const nuevosNumeros = generarNumerosAleatorios();
    setNumeros(nuevosNumeros);
    const nuevoModo = Math.random() > 0.5 ? "asc" : "desc";
    setModo(nuevoModo);
    setGlobosExplotados([]);
    setFeedback(nuevoModo === "asc" 
      ? "Selecciona el número más pequeño" 
      : "Selecciona el número más grande");
    setJuegoCompletado(false);
    setUltimoCorrecto(null);
    setMostrarInstrucciones(false);
  };

  useEffect(() => {
    iniciarJuego();
  }, []);

  const explotarGlobo = (numero: number) => {
    if (globosExplotados.includes(numero) || juegoCompletado) return;

    sonidoPop.play();

    const disponibles = numeros.filter(n => !globosExplotados.includes(n));
    const esCorrecto = 
      (modo === "asc" && numero === Math.min(...disponibles)) ||
      (modo === "desc" && numero === Math.max(...disponibles));

    if (esCorrecto) {
      sonidoAcierto.play();
      const nuevosExplotados = [...globosExplotados, numero];
      setGlobosExplotados(nuevosExplotados);
      setUltimoCorrecto(numero);

      if (nuevosExplotados.length === numeros.length) {
        setFeedback("¡Felicidades! Completaste el juego 🎉");
        setJuegoCompletado(true);
        onComplete();
      } else {
        setFeedback("¡Correcto! Continúa con el siguiente");
      }
    } else {
      sonidoError.play();
      const objetivoActual = modo === "asc" 
        ? Math.min(...disponibles) 
        : Math.max(...disponibles);
      
      if (modo === "asc") {
        setFeedback(numero < objetivoActual 
          ? "❌ Número incorrecto (muy bajo)" 
          : "❌ Número incorrecto (muy alto)");
      } else {
        setFeedback(numero > objetivoActual 
          ? "❌ Número incorrecto (muy alto)" 
          : "❌ Número incorrecto (muy bajo)");
      }
    }
  };

  const getColorGlobo = (numero: number) => {
    const colores = [
      "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400",
      "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-teal-400",
      "bg-orange-400", "bg-cyan-400"
    ];
    return colores[numeros.indexOf(numero) % colores.length];
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-sky-50 p-8 space-y-8">
      {mostrarInstrucciones ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Instrucciones</h2>
          <p className="mb-4">
            Explota los globos en orden {modo === "asc" 
              ? "CRECIENTE (del menor al mayor)" 
              : "DECRECIENTE (del mayor al menor)"}
          </p>
          <p className="mb-4">
            El juego te indicará si tu selección es correcta o no.
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
      ) : (
        <>
          <div className="text-center w-full">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Ordena los Números</h1>
            <div className="text-xl font-semibold mb-6">
              Modo: {modo === "asc" ? "Ascendente (⬆)" : "Descendente (⬇)"}
            </div>
            
            {/* Área fija para el feedback */}
            <div className="h-16 flex items-center justify-center mb-4">
              <div className={`text-2xl font-bold ${
                feedback.includes("❌") ? "text-red-500" : 
                feedback.includes("¡Felicidades") ? "text-purple-500" : 
                "text-green-500"
              }`}>
                {feedback}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 w-full max-w-2xl">
            {numeros.map((numero) => (
              <motion.div
                key={numero}
                onClick={() => explotarGlobo(numero)}
                initial={{ scale: 1 }}
                animate={{
                  scale: globosExplotados.includes(numero) ? 0 : 1,
                  opacity: globosExplotados.includes(numero) ? 0 : 1
                }}
                transition={{ type: "spring", damping: 10 }}
                className={`${getColorGlobo(numero)} w-full aspect-square rounded-full 
                  flex items-center justify-center cursor-pointer shadow-xl
                  ${globosExplotados.includes(numero) ? "hidden" : ""}
                  hover:brightness-110 transition-all border-2 border-white`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl font-bold text-white drop-shadow-md">{numero}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-6 mt-6">
            <div className="text-xl font-semibold bg-white px-6 py-3 rounded-full shadow-md">
              {ultimoCorrecto !== null 
                ? `Último correcto: ${ultimoCorrecto}` 
                : "Selecciona el primer número"}
            </div>
            <div className="text-xl font-semibold bg-white px-6 py-3 rounded-full shadow-md">
              Globos restantes: {numeros.length - globosExplotados.length}
            </div>

            <div className="flex gap-6">
              <motion.button
                onClick={iniciarJuego}
                className="px-8 py-4 bg-blue-600 text-white text-xl rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reiniciar Juego
              </motion.button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JuegoOrdenNumeros;