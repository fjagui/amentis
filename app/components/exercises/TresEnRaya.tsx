"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego
const sonidoMovimiento = new Howl({ src: ["/sounds/pulsa.mp3"] });
const sonidoVictoria = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoEmpate = new Howl({ src: ["/sounds/incorrecto.mp3"] });

const TresEnRaya = ({ onComplete }: { onComplete: () => void }) => {
  const [tablero, setTablero] = useState<(string | null)[]>(Array(9).fill(null));
  const [esTurnoJugador, setEsTurnoJugador] = useState<boolean>(true);
  const [ganador, setGanador] = useState<string | null>(null);
  const [empate, setEmpate] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("Tu turno: X");
  const [marcador, setMarcador] = useState({ jugador: 0, maquina: 0, empates: 0 });
  const [partidaActiva, setPartidaActiva] = useState<boolean>(true);

  const mensajesAnimaciones = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  // Comprobar si hay un ganador
  const calcularGanador = (tableroActual: (string | null)[]) => {
    const lineasGanadoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    for (const [a, b, c] of lineasGanadoras) {
      if (
        tableroActual[a] &&
        tableroActual[a] === tableroActual[b] &&
        tableroActual[a] === tableroActual[c]
      ) {
        return tableroActual[a];
      }
    }
    return null;
  };

  // Comprobar si hay empate
  const esEmpate = (tableroActual: (string | null)[]) => {
    return !tableroActual.includes(null) && !calcularGanador(tableroActual);
  };

  // Movimiento de la máquina (IA simple)
  const movimientoMaquina = () => {
    if (!partidaActiva || ganador || empate) return;

    // Intentar ganar
    for (let i = 0; i < 9; i++) {
      if (!tablero[i]) {
        const nuevoTablero = [...tablero];
        nuevoTablero[i] = "O";
        if (calcularGanador(nuevoTablero) === "O") {
          return i;
        }
      }
    }

    // Bloquear jugador
    for (let i = 0; i < 9; i++) {
      if (!tablero[i]) {
        const nuevoTablero = [...tablero];
        nuevoTablero[i] = "X";
        if (calcularGanador(nuevoTablero) === "X") {
          return i;
        }
      }
    }

    // Movimiento aleatorio
    const movimientosDisponibles = tablero
      .map((celda, index) => (celda === null ? index : null))
      .filter((index) => index !== null) as number[];

    const movimientoAleatorio = movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)];
    return movimientoAleatorio;
  };

  // Realizar un movimiento
  const hacerMovimiento = (indice: number) => {
    if (!partidaActiva || tablero[indice] || ganador || empate || !esTurnoJugador) {
      return;
    }

    sonidoMovimiento.play();
    
    const nuevoTablero = [...tablero];
    nuevoTablero[indice] = "X";
    setTablero(nuevoTablero);
    setEsTurnoJugador(false);

    const nuevoGanador = calcularGanador(nuevoTablero);
    if (nuevoGanador) {
      setGanador(nuevoGanador);
      setFeedback("¡Has ganado! 🎉");
      sonidoVictoria.play();
      setMarcador(prev => ({ ...prev, jugador: prev.jugador + 1 }));
      setPartidaActiva(false);
      return;
    }

    if (esEmpate(nuevoTablero)) {
      setEmpate(true);
      setFeedback("¡Empate! 🤝");
      sonidoEmpate.play();
      setMarcador(prev => ({ ...prev, empates: prev.empates + 1 }));
      setPartidaActiva(false);
      return;
    }

    setFeedback("Turno de la máquina: O");
  };

  // Movimiento de la máquina
  useEffect(() => {
    if (!esTurnoJugador && !ganador && !empate) {
      const timer = setTimeout(() => {
        const movimiento = movimientoMaquina();
        
        if (movimiento !== undefined) {
          sonidoMovimiento.play();
          const nuevoTablero = [...tablero];
          nuevoTablero[movimiento] = "O";
          setTablero(nuevoTablero);
          setEsTurnoJugador(true);
          setFeedback("Tu turno: X");

          const nuevoGanador = calcularGanador(nuevoTablero);
          if (nuevoGanador) {
            setGanador(nuevoGanador);
            setFeedback("¡La máquina ganó! 🤖");
            sonidoVictoria.play();
            setMarcador(prev => ({ ...prev, maquina: prev.maquina + 1 }));
            setPartidaActiva(false);
            return;
          }

          if (esEmpate(nuevoTablero)) {
            setEmpate(true);
            setFeedback("¡Empate! 🤝");
            sonidoEmpate.play();
            setMarcador(prev => ({ ...prev, empates: prev.empates + 1 }));
            setPartidaActiva(false);
          }
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [esTurnoJugador, tablero, ganador, empate]);

  // Manejar el final de la partida
  useEffect(() => {
    if (ganador || empate) {
      // Después de 2 segundos, reiniciamos para la siguiente partida
      const timer = setTimeout(() => {
        reiniciarPartida();
        // Llamamos a onComplete para informar que esta partida terminó
        onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [ganador, empate, onComplete]);

  // Reiniciar partida (sin reiniciar el marcador)
  const reiniciarPartida = () => {
    setTablero(Array(9).fill(null));
    setEsTurnoJugador(true);
    setGanador(null);
    setEmpate(false);
    setFeedback("Tu turno: X");
    setPartidaActiva(true);
  };

  // Renderizar celda del tablero
  const renderizarCelda = (indice: number) => {
    return (
      <motion.div
        key={indice}
        onClick={() => hacerMovimiento(indice)}
        className={`w-24 h-24 rounded-xl cursor-pointer shadow-lg flex items-center justify-center text-5xl font-bold ${
          tablero[indice] === "X" 
            ? "bg-blue-500 text-white" 
            : tablero[indice] === "O" 
            ? "bg-red-500 text-white" 
            : "bg-white hover:bg-gray-100"
        } ${
          !partidaActiva || tablero[indice] || ganador || empate || !esTurnoJugador
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
        whileHover={{ scale: !tablero[indice] && partidaActiva && esTurnoJugador ? 1.05 : 1 }}
        whileTap={{ scale: !tablero[indice] && partidaActiva && esTurnoJugador ? 0.95 : 1 }}
      >
        {tablero[indice]}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={feedback}
          {...mensajesAnimaciones}
          className={`text-3xl font-bold text-center mb-4 ${
            feedback.includes("ganó") 
              ? feedback.includes("máquina") 
                ? "text-red-600" 
                : "text-blue-600" 
              : feedback.includes("Empate") 
                ? "text-purple-600" 
                : "text-gray-700"
          }`}
        >
          {feedback}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-4 my-4 bg-gray-200 p-4 rounded-xl">
        {Array(9).fill(null).map((_, index) => renderizarCelda(index))}
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="text-xl font-semibold text-gray-700 bg-white px-6 py-3 rounded-full shadow-md">
          <div className="flex gap-8">
            <div className="text-blue-600">Jugador: {marcador.jugador}</div>
            <div className="text-gray-600">Empates: {marcador.empates}</div>
            <div className="text-red-600">Máquina: {marcador.maquina}</div>
          </div>
        </div>

        <div className="flex gap-6">
          <motion.button
            onClick={reiniciarPartida}
            className="px-8 py-4 bg-blue-600 text-white text-xl rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reiniciar Partida
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TresEnRaya;