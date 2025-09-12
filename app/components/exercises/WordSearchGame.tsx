"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego
const sonidoAcierto = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/incorrecto.mp3"] });
const sonidoCompletado = new Howl({ src: ["/sounds/completado.mp3"] });

type WordSearchGameProps = {
  onComplete: () => void;
  showWords?: boolean;
  timeLimit?: number; // 0 = sin límite de tiempo
};

type Category = {
  name: string;
  allWords: string[];
  wordsPerGame: number;
};

const WordSearchGame = ({ onComplete, showWords = true, timeLimit = 0 }: WordSearchGameProps) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [firstCell, setFirstCell] = useState<{row: number, col: number} | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [wordPositions, setWordPositions] = useState<{word: string, positions: {row: number, col: number}[]}[]>([]);

  const gridSize = 10; // Cambiado a 10x10 para tablet

  const mensajesAnimaciones = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  const directions = [
    { dr: 0, dc: 1 },  // derecha
    { dr: 1, dc: 0 },  // abajo
    { dr: 1, dc: 1 },  // diagonal derecha-abajo
    { dr: 1, dc: -1 }, // diagonal izquierda-abajo
    { dr: 0, dc: -1 }, // izquierda
    { dr: -1, dc: 0 }, // arriba
    { dr: -1, dc: -1 }, // diagonal izquierda-arriba
    { dr: -1, dc: 1 },  // diagonal derecha-arriba
  ];

  // Cargar categorías desde el JSON externo
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/sopaletras/word-categories.json');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          // Seleccionar categoría aleatoria
          const randomCategory = data[Math.floor(Math.random() * data.length)];
          setSelectedCategory(randomCategory);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Seleccionar palabras aleatorias para el juego actual
  const selectRandomWords = (category: Category): string[] => {
    const shuffled = [...category.allWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, category.wordsPerGame);
  };

  // Inicializar el juego
  const initializeGame = () => {
    if (!selectedCategory) return;

    const wordsForThisGame = selectRandomWords(selectedCategory);
    setCurrentWords(wordsForThisGame);

    const newGrid: string[][] = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill('')
    );

    const placedWords: string[] = [];
    const newWordPositions: {word: string, positions: {row: number, col: number}[]}[] = [];
    
    wordsForThisGame.forEach(word => {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        attempts++;
        
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);
        
        const endRow = startRow + direction.dr * (word.length - 1);
        const endCol = startCol + direction.dc * (word.length - 1);
        
        if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) {
          continue;
        }
        
        let conflict = false;
        for (let i = 0; i < word.length; i++) {
          const r = startRow + direction.dr * i;
          const c = startCol + direction.dc * i;
          
          if (newGrid[r][c] !== '' && newGrid[r][c] !== word[i]) {
            conflict = true;
            break;
          }
        }
        
        if (conflict) continue;
        
        // Guardar las posiciones de la palabra
        const positions = [];
        for (let i = 0; i < word.length; i++) {
          const r = startRow + direction.dr * i;
          const c = startCol + direction.dc * i;
          newGrid[r][c] = word[i];
          positions.push({ row: r, col: c });
        }
        
        newWordPositions.push({ word, positions });
        placedWords.push(word);
        placed = true;
      }
    });

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    setGrid(newGrid);
    setWordPositions(newWordPositions);
    setFoundWords([]);
    setFirstCell(null);
    setGameComplete(false);
    setTimeLeft(timeLimit);
    setScore(0);
    setFeedback(`Encuentra las palabras de ${selectedCategory.name}`);
  };

  useEffect(() => {
    if (selectedCategory) {
      initializeGame();
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Si timeLimit es 0, no iniciar el temporizador
    if (timeLimit === 0) return;

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
  }, [timeLeft, gameComplete, timeLimit]);

  useEffect(() => {
    if (currentWords.length > 0 && foundWords.length === currentWords.length) {
      setGameComplete(true);
      const finalScore = (timeLimit > 0 ? timeLeft * 5 : 0) + foundWords.length * 20;
      setScore(finalScore);
      setFeedback("¡Felicidades! Has encontrado todas las palabras 🎉");
      sonidoCompletado.play();
      setTimeout(() => onComplete(), 2000);
    }
  }, [foundWords, currentWords, timeLeft, onComplete, timeLimit]);

  // Verificar si una celda es parte de una palabra encontrada
  const isCellInFoundWord = (row: number, col: number) => {
    return wordPositions.some(wp => 
      foundWords.includes(wp.word) && 
      wp.positions.some(pos => pos.row === row && pos.col === col)
    );
  };

  // Obtener todas las celdas entre dos puntos en línea recta
  const getCellsBetween = (start: {row: number, col: number}, end: {row: number, col: number}) => {
    const dRow = end.row - start.row;
    const dCol = end.col - start.col;
    
    // Verificar si es una línea recta
    if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) {
      return null;
    }
    
    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
    const stepRow = dRow === 0 ? 0 : dRow / Math.abs(dRow);
    const stepCol = dCol === 0 ? 0 : dCol / Math.abs(dCol);
    
    const cells = [];
    for (let i = 0; i <= steps; i++) {
      const row = start.row + i * stepRow;
      const col = start.col + i * stepCol;
      cells.push({ row, col });
    }
    
    return cells;
  };

  // Manejar clic en una celda
  const handleCellClick = (row: number, col: number) => {
    if (gameComplete || isCellInFoundWord(row, col)) {
      return;
    }

    if (!firstCell) {
      // Primera celda seleccionada
      setFirstCell({ row, col });
      setFeedback("Selecciona la última letra de la palabra");
    } else {
      // Segunda celda seleccionada - verificar si forman una palabra
      const cellsBetween = getCellsBetween(firstCell, { row, col });
      
      if (!cellsBetween) {
        sonidoError.play();
        setFeedback("Las celdas no están en línea recta ❌");
        setFirstCell(null);
        return;
      }
      
      // Obtener la palabra formada
      const word = cellsBetween.map(cell => grid[cell.row][cell.col]).join('');
      
      // Verificar si la palabra está en la lista
      if (currentWords.includes(word) && !foundWords.includes(word)) {
        sonidoAcierto.play();
        setFoundWords([...foundWords, word]);
        setFeedback(`¡Encontraste "${word}"! ⚡`);
        setScore(prev => prev + 20);
        setFirstCell(null);
      } else {
        sonidoError.play();
        setFeedback("Palabra no encontrada ❌");
        setFirstCell(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4 md:p-6 space-y-4">
      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key={feedback}
            {...mensajesAnimaciones}
            className={`text-xl font-bold text-center mb-2 ${
              feedback.includes("❌") ? "text-red-600" :
              feedback.includes("¡Felicidades") ? "text-purple-600" :
              "text-gray-700"
            }`}
          >
            {feedback}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {timeLimit > 0 && (
        <div className="text-xl font-semibold bg-green-100 px-4 py-2 rounded-xl shadow-md text-center mb-4">
          Tiempo: <span className="text-2xl text-green-700">{timeLeft}s</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-4">
        {/* Grid de la sopa de letras */}
        <div className="w-full md:w-2/3 bg-white p-3 rounded-xl shadow-lg">
          <div className="grid grid-cols-10 gap-0 border-2 border-gray-800 rounded-lg overflow-hidden">
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => {
                const isFirstCell = firstCell?.row === rowIndex && firstCell?.col === colIndex;
                const isFound = isCellInFoundWord(rowIndex, colIndex);

                return (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      flex items-center justify-center text-xl font-bold 
                      cursor-pointer transition-all duration-200 h-12
                      ${isFound 
                        ? "bg-green-400 text-white" 
                        : isFirstCell
                        ? "bg-blue-300 text-white"
                        : "bg-white hover:bg-gray-100"
                      }
                      ${rowIndex === 0 ? 'border-t-0' : ''}
                      ${colIndex === 0 ? 'border-l-0' : ''}
                      border border-gray-300
                    `}
                    whileHover={{ scale: isFound ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cell}
                  </motion.div>
                );
              })
            ))}
          </div>
        </div>

        {/* Lista de palabras (solo si showWords es true) */}
        {showWords && (
          <div className="w-full md:w-1/3 bg-white p-3 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-center mb-3">{selectedCategory?.name}</h3>
            <div className="grid grid-cols-1 gap-2">
              {currentWords.map(word => (
                <div
                  key={word}
                  className={`p-2 rounded text-center ${
                    foundWords.includes(word)
                      ? "bg-green-100 text-green-800 line-through"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-3">
        <div className="text-lg font-semibold text-gray-700 bg-white px-4 py-2 rounded-full shadow-md text-center">
          Encontradas: {foundWords.length}/{currentWords.length} | Puntuación: {score}
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={initializeGame}
            className="px-5 py-2 bg-blue-600 text-white text-lg rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nuevo Juego
          </motion.button>
        </div>
      </div>

      <div className="mt-2 text-center text-gray-600 text-sm">
        <p>Haz clic en la primera y última letra de la palabra.</p>
        <p>¡Encuentra todas las palabras{timeLimit > 0 ? " antes de que se agote el tiempo" : ""}!</p>
      </div>
    </div>
  );
};

export default WordSearchGame;;