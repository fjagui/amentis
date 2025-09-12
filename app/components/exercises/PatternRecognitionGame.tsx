"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego
const sonidoAcierto = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/incorrecto.mp3"] });
const sonidoCompletado = new Howl({ src: ["/sounds/completado.mp3"] });

type ContentType = 'numbers' | 'letters' | 'emojis' | 'symbols';

const PatternRecognitionGame = ({ onComplete }: { onComplete: () => void }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [target, setTarget] = useState<string>('');
  const [correctCells, setCorrectCells] = useState<boolean[][]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [score, setScore] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [foundTargets, setFoundTargets] = useState(0);
  const [contentType, setContentType] = useState<ContentType>('numbers');

  const gridSize = 8;

  // Conjuntos de contenido ampliados (como en el ejemplo inicial)
  const contentSets = {
    numbers: Array.from({ length: 11 }, (_, i) => i.toString()), // 0-10
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', 
      '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', 
      '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', 
      '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', 
      '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣',
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹',
      '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉',
      '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋',
      '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️',
      '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐'
    ],
    symbols: [
      '@', '#', '$', '%', '&', '*', '!', '?', '€', '£', '¥', '¢', '§', '¶', 
      '©', '®', '™', '°', '±', '÷', '=', '≠', '≈', '∞', '√', '∆', '∑', '∏',
      'π', '∫', 'μ', 'σ', 'θ', 'λ', 'α', 'β', 'γ', 'δ', '→', '←', '↑', '↓',
      '↔', '↕', '↨', '⇐', '⇑', '⇒', '⇓', '⇔', '∀', '∃', '∄', '∅', '∇', '∈',
      '∉', '∋', '∌', '∍', '∎', '∏', '∐', '∑', '−', '∓', '∔', '∕', '∖', '∗',
      '∘', '∙', '√', '∛', '∜', '∝', '∞', '∟', '∠', '∡', '∢', '∣', '∤', '∥',
      '∦', '∧', '∨', '∩', '∪', '∫', '∬', '∭', '∮', '∯', '∰', '∱', '∲', '∳',
      '■', '□', '▢', '▣', '▤', '▥', '▦', '▧', '▨', '▩', '▪', '▫', '▬', '▭',
      '▮', '▯', '▰', '▱', '▲', '△', '▴', '▵', '▶', '▷', '▸', '▹', '►', '▻',
      '▼', '▽', '▾', '▿', '◀', '◁', '◂', '◃', '◄', '◅', '◆', '◇', '◈', '◉',
      '◊', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗',
      '◘', '◙', '◚', '◛', '◜', '◝', '◞', '◟', '◠', '◡', '◢', '◣', '◤', '◥',
      '◦', '◧', '◨', '◩', '◪', '◫', '◬', '◭', '◮', '◯', '◰', '◱', '◲', '◳',
      '◴', '◵', '◶', '◷', '◸', '◹', '◺', '◻', '◼', '◽', '◾', '◿'
    ]
  };

  const contentTypeLabels = {
    numbers: 'Números',
    letters: 'Letras',
    emojis: 'Emoticonos',
    symbols: 'Símbolos'
  };

  const mensajesAnimaciones = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  // Seleccionar un tipo de contenido aleatorio
  const getRandomContentType = (): ContentType => {
    const types: ContentType[] = ['numbers', 'letters', 'emojis', 'symbols'];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Seleccionar un subconjunto aleatorio de elementos
  const getRandomSubset = (array: string[], size: number): string[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  };

  // Inicializar el juego
  const initializeGame = () => {
    const newContentType = getRandomContentType();
    setContentType(newContentType);
    
    // Seleccionar 10 elementos aleatorios del conjunto grande
    const subsetSize = 10;
    const randomSubset = getRandomSubset(contentSets[newContentType], subsetSize);
    
    const newGrid: string[][] = [];
    const newCorrectCells: boolean[][] = [];
    
    for (let i = 0; i < gridSize; i++) {
      newGrid[i] = [];
      newCorrectCells[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const randomIndex = Math.floor(Math.random() * randomSubset.length);
        newGrid[i][j] = randomSubset[randomIndex];
        newCorrectCells[i][j] = false;
      }
    }
    
    // Seleccionar un objetivo aleatorio del subconjunto
    const targetIndex = Math.floor(Math.random() * randomSubset.length);
    const newTarget = randomSubset[targetIndex];
    setTarget(newTarget);
    
    // Calcular cuántas veces aparece el objetivo
    let count = 0;
    newGrid.forEach(row => {
      row.forEach(cell => {
        if (cell === newTarget) count++;
      });
    });
    
    // Asegurarse de que el objetivo aparece al menos 5 veces
    if (count < 5) {
      // Si no aparece suficiente, forzar algunas apariciones adicionales
      let forcedCount = 0;
      const maxForced = 5 - count;
      
      for (let i = 0; i < gridSize && forcedCount < maxForced; i++) {
        for (let j = 0; j < gridSize && forcedCount < maxForced; j++) {
          if (newGrid[i][j] !== newTarget && Math.random() > 0.7) {
            newGrid[i][j] = newTarget;
            forcedCount++;
          }
        }
      }
      count += forcedCount;
    }
    
    setTotalTargets(count);
    setFoundTargets(0);
    setGrid(newGrid);
    setCorrectCells(newCorrectCells);
    setGameComplete(false);
    setTimeLeft(120);
    setScore(0);
    setFeedback(`Encuentra todos los "${newTarget}"`);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !gameComplete) {
      setGameComplete(true);
      setFeedback("¡Tiempo agotado! Intenta de nuevo");
      return;
    }

    if (!gameComplete) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameComplete]);

  useEffect(() => {
    if (foundTargets > 0 && foundTargets === totalTargets) {
      setGameComplete(true);
      const finalScore = timeLeft * 10 + foundTargets * 5;
      setScore(finalScore);
      setFeedback("¡Felicidades! Has encontrado todos 🎉");
      sonidoCompletado.play();
      setTimeout(() => onComplete(), 2000);
    }
  }, [foundTargets, totalTargets, timeLeft, onComplete]);

  const handleCellClick = (row: number, col: number) => {
    if (gameComplete || correctCells[row][col]) {
      return;
    }

    if (grid[row][col] === target) {
      sonidoAcierto.play();
      const newCorrectCells = [...correctCells];
      newCorrectCells[row][col] = true;
      setCorrectCells(newCorrectCells);
      setFoundTargets(prev => prev + 1);
      setFeedback("¡Correcto! ⚡");
      // Sumar puntos por acierto
      setScore(prev => prev + 10);
    } else {
      sonidoError.play();
      setFeedback("Elemento incorrecto ❌");
      // Restar puntos por error
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  // Estilos diferentes según el tipo de contenido
  const getGridStyle = () => {
    switch(contentType) {
      case 'numbers': return "bg-blue-50";
      case 'letters': return "bg-purple-50";
      case 'emojis': return "bg-yellow-50";
      case 'symbols': return "bg-teal-50";
      default: return "bg-blue-50";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 md:p-8 space-y-6">
      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key={feedback}
            {...mensajesAnimaciones}
            className={`text-2xl md:text-3xl font-bold text-center mb-4 ${
              feedback.includes("❌") ? "text-red-600" :
              feedback.includes("¡Felicidades") ? "text-purple-600" :
              "text-gray-700"
            }`}
          >
            {feedback}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between w-full max-w-2xl mb-6 gap-4">
        <div className="text-xl md:text-2xl font-semibold bg-blue-100 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-md text-center">
          Tipo: <span className="text-blue-700">{contentTypeLabels[contentType]}</span>
        </div>
        <div className="text-xl md:text-2xl font-semibold bg-blue-100 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-md text-center">
          Buscar: <span className="text-3xl md:text-4xl text-blue-700">{target}</span>
        </div>
        <div className="text-xl md:text-2xl font-semibold bg-green-100 px-4 md:px-6 py-2 md:py-3 rounded-xl shadow-md text-center">
          Tiempo: <span className="text-3xl md:text-4xl text-green-700">{timeLeft}s</span>
        </div>
      </div>

      <div className={`w-full max-w-2xl p-4 rounded-2xl shadow-lg ${getGridStyle()}`}>
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 rounded-lg overflow-hidden">
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  flex items-center justify-center text-xl md:text-2xl font-bold 
                  cursor-pointer transition-all duration-200 h-12 md:h-16
                  ${correctCells[rowIndex][colIndex] 
                    ? "bg-green-400 text-white" 
                    : "bg-white hover:bg-gray-100"
                  }
                  ${rowIndex === 0 ? 'border-t-0' : ''}
                  ${colIndex === 0 ? 'border-l-0' : ''}
                  border border-gray-300
                `}
                whileHover={{ scale: correctCells[rowIndex][colIndex] ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cell}
              </motion.div>
            ))
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 md:space-y-6">
        <div className="text-xl md:text-2xl font-semibold text-gray-700 bg-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-md text-center">
          Encontrados: {foundTargets}/{totalTargets} | Puntuación: {score}
        </div>

        <div className="flex gap-4 md:gap-6">
          <motion.button
            onClick={initializeGame}
            className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white text-lg md:text-xl rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nuevo Juego
          </motion.button>
        </div>
      </div>

      <div className="mt-4 text-center text-gray-600">
        <p>Haz clic en todos los elementos que coincidan con el objetivo.</p>
        <p>¡Encuentra todos antes de que se agote el tiempo!</p>
      </div>
    </div>
  );
};

export default PatternRecognitionGame;