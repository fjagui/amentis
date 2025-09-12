"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { Howl } from "howler";
import { motion } from "framer-motion";
import { useUser } from "../../contexts/UserContext";

// Sonidos para el juego
const sonidoColocar = new Howl({ src: ["/sounds/pulsa.mp3"] });
const sonidoVictoria = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/incorrecto.mp3"] });

type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  isCorrect: boolean | null;
};

type Position = {
  row: number;
  col: number;
};

const SudokuGame = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useUser();
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [feedback, setFeedback] = useState("Selecciona un número y arrástralo a una casilla");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [errors, setErrors] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragPreviewRef = useRef<HTMLDivElement>(null);

  // Determinar dificultad basada en el nivel del usuario
  const getDifficulty = () => {
    const userLevel = user?.level || 1;
    
    if (userLevel <= 2) return 25; // Fácil para niveles 1-2
    if (userLevel <= 4) return 40; // Medio para niveles 3-4
    return 55; // Difícil para nivel 5+
  };

  // Función para generar un Sudoku válido
  const generateSudoku = (emptyCells: number): { puzzle: number[][], solution: number[][] } => {
    // Crear un tablero base vacío
    const baseBoard: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
    
    // Llenar la diagonal de las 3 cajas principales
    fillDiagonalBoxes(baseBoard);
    
    // Resolver el resto del tablero
    solveSudoku(baseBoard);
    
    // Guardar la solución completa
    const solution = baseBoard.map(row => [...row]);
    
    // Crear una copia para el juego y eliminar algunas celdas
    const puzzle = baseBoard.map(row => [...row]);
    removeCells(puzzle, emptyCells);
    
    return { puzzle, solution };
  };

  // Llenar las 3 cajas diagonales
  const fillDiagonalBoxes = (board: number[][]) => {
    for (let i = 0; i < 9; i += 3) {
      fillBox(board, i, i);
    }
  };

  // Llenar una caja 3x3 con números aleatorios
  const fillBox = (board: number[][], row: number, col: number) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(numbers);
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[row + i][col + j] = numbers.pop()!;
      }
    }
  };

  // Barajar array (algoritmo Fisher-Yates)
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Resolver Sudoku usando backtracking
  const solveSudoku = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          shuffleArray(numbers);
          
          for (const num of numbers) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              
              if (solveSudoku(board)) {
                return true;
              }
              
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Verificar si un número puede colocarse en una posición
  const isValidPlacement = (board: number[][], row: number, col: number, num: number): boolean => {
    // Verificar fila
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
    }
    
    // Verificar columna
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) return false;
    }
    
    // Verificar cuadrante 3x3
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }
    
    return true;
  };

  // Eliminar celdas para crear el puzzle
  const removeCells = (board: number[][], emptyCells: number) => {
    let cellsRemoved = 0;
    
    while (cellsRemoved < emptyCells) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        cellsRemoved++;
      }
    }
  };

  // Iniciar el juego
  const startGame = () => {
    const difficulty = getDifficulty();
    const { puzzle, solution } = generateSudoku(difficulty);
    setSolution(solution);
    
    const newBoard: SudokuCell[][] = puzzle.map(row => 
      row.map(cell => ({
        value: cell === 0 ? null : cell,
        isFixed: cell !== 0,
        isCorrect: cell !== 0 ? true : null
      }))
    );
    
    setBoard(newBoard);
    setGameStatus('playing');
    setFeedback("Selecciona un número y arrástralo a una casilla");
    setTime(0);
    setTimerActive(true);
    setErrors(0);
    setSelectedNumber(null);
    setSelectedCell(null);
  };

  // Verificar si el tablero está completo y correcto
  const checkCompletion = (currentBoard: SudokuCell[][]) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentBoard[i][j].value === null || !currentBoard[i][j].isCorrect) {
          return false;
        }
      }
    }
    return true;
  };

  // Colocar un número en una celda
  const placeNumber = (row: number, col: number, number: number) => {
    if (gameStatus !== 'playing' || board[row][col].isFixed) {
      return;
    }

    const newBoard = [...board.map(r => [...r])];
    const isCorrect = solution[row][col] === number;
    
    newBoard[row][col] = {
      ...newBoard[row][col],
      value: number,
      isCorrect
    };
    
    setBoard(newBoard);
    
    if (isCorrect) {
      sonidoColocar.play();
      setFeedback("¡Número colocado correctamente!");
      
      if (checkCompletion(newBoard)) {
        setGameStatus('won');
        sonidoVictoria.play();
        setFeedback("¡Felicidades! Has completado el Sudoku.");
        setTimerActive(false);
      }
    } else {
      sonidoError.play();
      setFeedback("❌ Número incorrecto");
      setErrors(prev => prev + 1);
    }
  };

  // Manejar el inicio del arrastre
  const handleDragStart = (number: number) => {
    setSelectedNumber(number);
    setIsDragging(true);
  };

  // Manejar el final del arrastre
  const handleDragEnd = () => {
    setIsDragging(false);
    setSelectedNumber(null);
  };

  // Manejar la colocación de un número en una celda
  const handleCellDrop = (row: number, col: number) => {
    if (selectedNumber !== null && !board[row][col].isFixed) {
      placeNumber(row, col, selectedNumber);
    }
  };

  // Manejar el clic en una celda (alternativa al arrastre)
  const handleCellClick = (row: number, col: number) => {
    if (selectedNumber !== null && !board[row][col].isFixed) {
      placeNumber(row, col, selectedNumber);
    }
    setSelectedCell({ row, col });
  };

  // Cronómetro
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive) {
      timer = setTimeout(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearTimeout(timer);
  }, [time, timerActive]);

  // Finalizar el juego después de ganar
  useEffect(() => {
    if (gameStatus === 'won') {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameStatus, onComplete]);

  // Inicializar el juego al montar el componente
  useEffect(() => {
    startGame();
  }, [user?.level]); // Reiniciar cuando cambie el nivel del usuario

  // Efecto para el preview de arrastre
  useEffect(() => {
    const handleDrag = (e: MouseEvent) => {
      if (dragPreviewRef.current && isDragging) {
        dragPreviewRef.current.style.left = `${e.clientX - 25}px`;
        dragPreviewRef.current.style.top = `${e.clientY - 25}px`;
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      return () => document.removeEventListener('mousemove', handleDrag);
    }
  }, [isDragging]);

  // Formatear el tiempo en minutos:segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Obtener texto de dificultad basado en el nivel
  const getDifficultyText = () => {
    const difficulty = getDifficulty();
    
    if (difficulty <= 25) return "Fácil";
    if (difficulty <= 40) return "Medio";
    return "Difícil";
  };

  // Función para determinar las clases de borde según la posición de la celda
  const getCellBorderClass = (row: number, col: number) => {
    let borderClass = "";
    
    // Bordes sólidos para separar los bloques 3x3
    if (row % 3 === 2 && row !== 8) {
      borderClass += " border-b-2 border-solid border-gray-600";
    } else {
      borderClass += " border-b border-dashed border-gray-300";
    }
    
    if (col % 3 === 2 && col !== 8) {
      borderClass += " border-r-2 border-solid border-gray-600";
    } else {
      borderClass += " border-r border-dashed border-gray-300";
    }
    
    return borderClass;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 space-y-4">
      {/* Encabezado compacto en una sola línea */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md mb-2 gap-2">
        {/* Feedback del juego */}
        <div className={`text-lg font-bold text-center flex-1 ${
          gameStatus === 'won' ? "text-green-600" : "text-gray-700"
        }`}>
          {feedback}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Tiempo */}
          <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-md">
            <span className="text-red-600 mr-1 text-lg">⏱️</span>
            <span className="font-bold text-sm">{formatTime(time)}</span>
          </div>
          
          {/* Errores */}
          <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-md">
            <span className="text-red-600 mr-1 text-lg">❌</span>
            <span className="font-bold text-sm">{errors}</span>
          </div>
          
          {/* Nivel y dificultad */}
          <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-md">
            <span className="font-bold text-sm text-blue-800">N{user?.level || 1}-{getDifficultyText().charAt(0)}</span>
          </div>
          
          {/* Botón de ayuda */}
          <motion.button
            onClick={() => setShowInstructions(true)}
            className="w-8 h-8 flex items-center justify-center bg-blue-200 text-blue-800 rounded-full text-sm font-bold shadow-md"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ?
          </motion.button>
        </div>
      </div>

      {/* Tablero de Sudoku con bordes mejorados */}
      <div className="grid grid-cols-9 gap-0 bg-gray-600 p-1 rounded-lg border-2 border-gray-600">
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onDrop={() => handleCellDrop(rowIndex, colIndex)}
              onDragOver={(e) => e.preventDefault()}
              className={`w-10 h-10 flex items-center justify-center cursor-pointer font-bold text-lg ${
                cell.isFixed 
                  ? "bg-gray-200 text-gray-800" 
                  : cell.isCorrect === false 
                    ? "bg-red-200 text-red-800" 
                    : "bg-white text-blue-800"
              } ${
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  ? "ring-2 ring-blue-500"
                  : ""
              } ${getCellBorderClass(rowIndex, colIndex)}`}
              whileHover={{ scale: cell.isFixed ? 1 : 1.05 }}
              whileTap={{ scale: cell.isFixed ? 1 : 0.95 }}
            >
              {cell.value !== null ? cell.value : ""}
            </motion.div>
          ))
        )}
      </div>

      {/* Teclado numérico más grande */}
      <div className="grid grid-cols-5 gap-3 mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <motion.div
            key={number}
            draggable
            onDragStart={() => handleDragStart(number)}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedNumber(number)}
            className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-2xl shadow-md ${
              selectedNumber === number
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-800"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {number}
          </motion.div>
        ))}
        <motion.div
          onClick={() => setSelectedNumber(null)}
          className="w-14 h-14 flex items-center justify-center bg-red-500 text-white rounded-lg font-bold text-2xl shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          X
        </motion.div>
      </div>

      {/* Botones de control */}
      <div className="flex gap-4 mt-4">
        <motion.button
          onClick={startGame}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Nuevo Juego
        </motion.button>
      </div>

      {/* Preview de arrastre */}
      {isDragging && selectedNumber && (
        <div
          ref={dragPreviewRef}
          className="fixed w-14 h-14 flex items-center justify-center bg-blue-600 text-white rounded-lg font-bold text-2xl shadow-lg z-50 pointer-events-none"
          style={{ left: -100, top: -100 }}
        >
          {selectedNumber}
        </div>
      )}

      {/* Modal de instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="font-bold text-blue-800 text-xl mb-4">Instrucciones del Sudoku</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Selecciona un número del teclado inferior</li>
              <li>Arrastra el número a una casilla vacía o haz clic en la casilla después de seleccionar un número</li>
              <li>Completa el tablero de manera que cada fila, columna y cuadrante 3x3 contenga los números del 1 al 9 sin repetirse</li>
              <li>Los números incorrectos se marcarán en rojo</li>
              <li>¡Completa todo el tablero para ganar!</li>
              <li>La dificultad se ajusta automáticamente según tu nivel actual: {user?.level || 1}</li>
            </ul>
            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cerrar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SudokuGame;