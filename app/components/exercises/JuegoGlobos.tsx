"use client";
import { useState, useEffect, useContext } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "../../contexts/UserContext"; // Ajusta la ruta según tu estructura

// Sonidos para el juego
const sonidoAcierto = new Howl({ src: ["/sounds/green.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/red.mp3"] });
const sonidoPop = new Howl({ src: ["/sounds/pop.mp3"] });

interface ElementoJuego {
  valor: number;
  display: string;
}

const JuegoOrdenNumeros = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useUser();
  const [elementos, setElementos] = useState<ElementoJuego[]>([]);
  const [modo, setModo] = useState<"asc" | "desc">("asc");
  const [feedback, setFeedback] = useState<string>("");
  const [juegoCompletado, setJuegoCompletado] = useState(false);
  const [globosExplotados, setGlobosExplotados] = useState<number[]>([]);
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(true);
  const [ultimoCorrecto, setUltimoCorrecto] = useState<number | null>(null);

  // Obtener nivel de dificultad del usuario (1 o 2)
  const dificultad = user?.level || 1;

  const generarElementosAleatorios = () => {
    if (dificultad === 1) {
      // Dificultad 1: Números simples
      const nums = new Set<number>();
      while (nums.size < 10) {
        nums.add(Math.floor(Math.random() * 100) + 1);
      }
      return Array.from(nums).map(num => ({ valor: num, display: num.toString() }));
    } else {
      // Dificultad 2: Operaciones aritméticas
      const elementos: ElementoJuego[] = [];
      const operadores = ['+', '-', '*'];
      
      while (elementos.length < 10) {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const operador = operadores[Math.floor(Math.random() * operadores.length)];
        
        let valor, display;
        
        switch (operador) {
          case '+':
            valor = a + b;
            display = `${a} + ${b}`;
            break;
          case '-':
            // Asegurar que el resultado no sea negativo
            valor = Math.max(a, b) - Math.min(a, b);
            display = `${Math.max(a, b)} - ${Math.min(a, b)}`;
            break;
          case '*':
            valor = a * b;
            display = `${a} × ${b}`;
            break;
          default:
            valor = a + b;
            display = `${a} + ${b}`;
        }
        
        // Asegurar que el resultado no exceda 100 y no se repita
        if (valor <= 100 && !elementos.some(e => e.valor === valor)) {
          elementos.push({ valor, display });
        }
      }
      
      return elementos;
    }
  };

  const iniciarJuego = () => {
    const nuevosElementos = generarElementosAleatorios();
    setElementos(nuevosElementos);
    const nuevoModo = Math.random() > 0.5 ? "asc" : "desc";
    setModo(nuevoModo);
    setGlobosExplotados([]);
    
    // Mensaje según dificultad
    if (dificultad === 1) {
      setFeedback(nuevoModo === "asc" 
        ? "Selecciona el número más pequeño" 
        : "Selecciona el número más grande");
    } else {
      setFeedback(nuevoModo === "asc" 
        ? "Selecciona el resultado más pequeño" 
        : "Selecciona el resultado más grande");
    }
    
    setJuegoCompletado(false);
    setUltimoCorrecto(null);
    setMostrarInstrucciones(false);
  };

  useEffect(() => {
    iniciarJuego();
  }, [dificultad]); // Reiniciar juego cuando cambia la dificultad

  const explotarGlobo = (valor: number) => {
    if (globosExplotados.includes(valor) || juegoCompletado) return;

    sonidoPop.play();

    const disponibles = elementos.filter(e => !globosExplotados.includes(e.valor));
    const esCorrecto = 
      (modo === "asc" && valor === Math.min(...disponibles.map(e => e.valor))) ||
      (modo === "desc" && valor === Math.max(...disponibles.map(e => e.valor)));

    if (esCorrecto) {
      sonidoAcierto.play();
      const nuevosExplotados = [...globosExplotados, valor];
      setGlobosExplotados(nuevosExplotados);
      setUltimoCorrecto(valor);

      if (nuevosExplotados.length === elementos.length) {
        setFeedback("¡Felicidades! Completaste el juego 🎉");
        setJuegoCompletado(true);
        onComplete();
      } else {
        setFeedback("¡Correcto! Continúa con el siguiente");
      }
    } else {
      sonidoError.play();
      const objetivoActual = modo === "asc" 
        ? Math.min(...disponibles.map(e => e.valor)) 
        : Math.max(...disponibles.map(e => e.valor));
      
      if (modo === "asc") {
        setFeedback(valor < objetivoActual 
          ? "❌ Incorrecto (muy bajo)" 
          : "❌ Incorrecto (muy alto)");
      } else {
        setFeedback(valor > objetivoActual 
          ? "❌ Incorrecto (muy alto)" 
          : "❌ Incorrecto (muy bajo)");
      }
    }
  };

  const getColorGlobo = (index: number) => {
    const colores = [
      "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400",
      "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-teal-400",
      "bg-orange-400", "bg-cyan-400"
    ];
    return colores[index % colores.length];
  };

  // Obtener texto para instrucciones según dificultad
  const getTextoInstrucciones = () => {
    if (dificultad === 1) {
      return modo === "asc" 
        ? "CRECIENTE (del menor al mayor)" 
        : "DECRECIENTE (del mayor al menor)";
    } else {
      return modo === "asc" 
        ? "CRECIENTE (del resultado menor al mayor)" 
        : "DECRECIENTE (del resultado mayor al menor)";
    }
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
            Explota los globos en orden {getTextoInstrucciones()}
          </p>
          <p className="mb-4">
            {dificultad === 2 && "Resuelve mentalmente las operaciones y ordena por su resultado. "}
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
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              {dificultad === 1 ? "Ordena los Números" : "Ordena las Operaciones"}
            </h1>
            <div className="text-xl font-semibold mb-6">
              Modo: {modo === "asc" ? "Ascendente (⬆)" : "Descendente (⬇)"}
              <span className="ml-4 text-lg text-gray-600">
                Nivel: {dificultad}
              </span>
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
            {elementos.map((elemento, index) => (
              <motion.div
                key={elemento.valor}
                onClick={() => explotarGlobo(elemento.valor)}
                initial={{ scale: 1 }}
                animate={{
                  scale: globosExplotados.includes(elemento.valor) ? 0 : 1,
                  opacity: globosExplotados.includes(elemento.valor) ? 0 : 1
                }}
                transition={{ type: "spring", damping: 10 }}
                className={`${getColorGlobo(index)} w-full aspect-square rounded-full 
                  flex items-center justify-center cursor-pointer shadow-xl
                  ${globosExplotados.includes(elemento.valor) ? "hidden" : ""}
                  hover:brightness-110 transition-all border-2 border-white`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-4xl font-bold text-white drop-shadow-md text-center">
                  {elemento.display}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center space-y-6 mt-6">
            <div className="text-xl font-semibold bg-white px-6 py-3 rounded-full shadow-md">
              {ultimoCorrecto !== null 
                ? `Último correcto: ${ultimoCorrecto}` 
                : "Selecciona el primer elemento"}
            </div>
            <div className="text-xl font-semibold bg-white px-6 py-3 rounded-full shadow-md">
              Globos restantes: {elementos.length - globosExplotados.length}
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