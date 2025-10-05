"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { motion } from "framer-motion";

// Sonidos para el juego
const sonidoRevelar = new Howl({ src: ["/sounds/pulsa.mp3"] });
const sonidoVictoria = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoMina = new Howl({ src: ["/sounds/incorrecto.mp3"] });
const sonidoBandera = new Howl({ src: ["/sounds/bandera.mp3"] });

// Constante para el tamaño del tablero
const BOARD_SIZE = 8;
const MINES_COUNT = 10; // Número de minas

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const Buscaminas = ({ onComplete }: { onComplete: () => void }) => {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagsCount, setFlagsCount] = useState(MINES_COUNT);
  const [feedback, setFeedback] = useState("Pulsa cualquier casilla para empezar");
  const [firstClick, setFirstClick] = useState(true);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [actionMode, setActionMode] = useState<'reveal' | 'flag'>('reveal');
  const [showInstructions, setShowInstructions] = useState(false);

  // Inicializar el tablero
  const initializeBoard = () => {
    const newBoard: Cell[][] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      newBoard.push(row);
    }
    return newBoard;
  };

  // Colocar minas evitando la posición del primer clic
  const placeMines = (board: Cell[][], row: number, col: number) => {
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      
      const isFirstClickArea = 
        Math.abs(r - row) <= 1 && 
        Math.abs(c - col) <= 1;
      
      if (!board[r][c].isMine && !isFirstClickArea) {
        board[r][c].isMine = true;
        minesPlaced++;
      }
    }
    return board;
  };

  // Calcular minas adyacentes
  const calculateAdjacentMines = (board: Cell[][]) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!board[i][j].isMine) {
          let count = 0;
          
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              
              if (
                ni >= 0 && ni < BOARD_SIZE && 
                nj >= 0 && nj < BOARD_SIZE &&
                board[ni][nj].isMine
              ) {
                count++;
              }
            }
          }
          
          board[i][j].adjacentMines = count;
        }
      }
    }
    return board;
  };

  // Iniciar el juego después del primer clic
  const startGame = (row: number, col: number) => {
    let newBoard = initializeBoard();
    newBoard = placeMines(newBoard, row, col);
    newBoard = calculateAdjacentMines(newBoard);
    setBoard(newBoard);
    setFirstClick(false);
    setTimerActive(true);
    setFeedback("¡Juego iniciado! Encuentra las minas.");
  };

  // Revelar una celda
  const revealCell = (row: number, col: number) => {
    if (gameStatus !== 'playing' || board[row][col].isFlagged) {
      return;
    }

    if (firstClick) {
      startGame(row, col);
      sonidoRevelar.play();
      return;
    }

    const newBoard = [...board.map(row => [...row])];
    
    if (newBoard[row][col].isMine) {
      newBoard[row][col].isRevealed = true;
      setBoard(newBoard);
      setGameStatus('lost');
      sonidoMina.play();
      setFeedback("¡Boom! Has perdido.");
      setTimerActive(false);
      return;
    }

    const revealRecursive = (r: number, c: number) => {
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || newBoard[r][c].isRevealed) {
        return;
      }

      newBoard[r][c].isRevealed = true;
      
      if (newBoard[r][c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
              revealRecursive(r + dr, c + dc);
            }
          }
        }
      }
    };

    revealRecursive(row, col);
    setBoard(newBoard);
    sonidoRevelar.play();
    checkWin(newBoard);
  };

  // Alternar bandera
  const toggleFlag = (row: number, col: number) => {
    if (gameStatus !== 'playing' || board[row][col].isRevealed || flagsCount === 0 && !board[row][col].isFlagged) {
      return;
    }

    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    
    const flagChange = newBoard[row][col].isFlagged ? -1 : 1;
    setFlagsCount(prev => prev + flagChange);
    
    sonidoBandera.play();
    setFeedback(newBoard[row][col].isFlagged ? "Bandera colocada" : "Bandera removida");
    checkWin(newBoard);
  };

  // Manejar acción en celda según el modo seleccionado
  const handleCellAction = (row: number, col: number) => {
    if (actionMode === 'reveal') {
      revealCell(row, col);
    } else {
      toggleFlag(row, col);
    }
  };

  // Alternar modo de acción
  const toggleActionMode = () => {
    setActionMode(prevMode => prevMode === 'reveal' ? 'flag' : 'reveal');
    setFeedback(actionMode === 'reveal' ? "Modo: Marcar Minas" : "Modo: Revelar Celdas");
  };

  // Verificar si se ganó el juego
  const checkWin = (currentBoard: Cell[][]) => {
    let allNonMinesRevealed = true;
    let allMinesFlagged = true;
    
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = currentBoard[i][j];
        
        if (!cell.isMine && !cell.isRevealed) {
          allNonMinesRevealed = false;
        }
        
        if (cell.isMine && !cell.isFlagged) {
          allMinesFlagged = false;
        }
      }
    }
    
    if (allNonMinesRevealed || allMinesFlagged) {
      setGameStatus('won');
      sonidoVictoria.play();
      setFeedback("¡Felicidades! Has ganado.");
      setTimerActive(false);
    }
  };

  // Reiniciar el juego
  const resetGame = () => {
    setBoard(initializeBoard());
    setGameStatus('playing');
    setFlagsCount(MINES_COUNT);
    setFeedback("Pulsa cualquier casilla para empezar");
    setFirstClick(true);
    setTime(0);
    setTimerActive(false);
    setActionMode('reveal');
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

  // Finalizar el juego después de ganar/perder
  useEffect(() => {
    if (gameStatus !== 'playing') {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [gameStatus, onComplete]);

  // Inicializar el tablero al montar el componente
  useEffect(() => {
    resetGame();
  }, []);

  // Renderizar una celda
  const renderCell = (row: number, col: number) => {
    const cell = board[row]?.[col] || {
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0
    };
    
    let content = "";
    let bgColor = "bg-gray-300";
    let textColor = "text-black";
    
    if (cell.isRevealed) {
      bgColor = "bg-gray-100";
      
      if (cell.isMine) {
        content = "💣";
        bgColor = "bg-red-500";
      } else if (cell.adjacentMines > 0) {
        content = cell.adjacentMines.toString();
        
        switch (cell.adjacentMines) {
          case 1: textColor = "text-blue-600"; break;
          case 2: textColor = "text-green-600"; break;
          case 3: textColor = "text-red-600"; break;
          case 4: textColor = "text-purple-600"; break;
          default: textColor = "text-black"; break;
        }
      }
    } else if (cell.isFlagged) {
      content = "🚩";
    }
    
    return (
      <motion.div
        key={`${row}-${col}`}
        onClick={() => handleCellAction(row, col)}
        className={`w-16 h-16 flex items-center justify-center border border-gray-400 cursor-pointer font-bold text-xl ${bgColor} ${
          gameStatus !== 'playing' ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        whileHover={{ scale: gameStatus === 'playing' && !cell.isRevealed ? 1.1 : 1 }}
        whileTap={{ scale: gameStatus === 'playing' ? 0.95 : 1 }}
      >
        <span className={textColor}>{content}</span>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 space-y-4">
      {/* Encabezado compacto con banderas, tiempo y botón de ayuda */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-2">
        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md">
          <span className="text-red-600 mr-2 text-2xl">🚩</span>
          <span className="font-bold text-xl">{flagsCount}</span>
        </div>
        
        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-md">
          <span className="text-gray-600 mr-2 text-2xl">⏱️</span>
          <span className="font-bold text-xl">{time}s</span>
        </div>
        
        <motion.button
          onClick={() => setShowInstructions(true)}
          className="w-12 h-12 flex items-center justify-center bg-blue-200 text-blue-800 rounded-full text-xl font-bold shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ?
        </motion.button>
      </div>

      {/* Feedback del juego */}
      <div className={`text-xl font-bold text-center mb-2 w-full max-w-2xl ${
        gameStatus === 'won' ? "text-green-600" : 
        gameStatus === 'lost' ? "text-red-600" : "text-gray-700"
      }`}>
        {feedback}
      </div>

      {/* Botón único para alternar modo */}
      <div className="mb-2">
        <motion.button
          onClick={toggleActionMode}
          className={`px-6 py-3 rounded-lg font-bold text-lg ${
            actionMode === 'reveal' 
              ? 'bg-blue-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionMode === 'reveal' ? 'Revelar Celdas' : 'Marcar Minas'}
        </motion.button>
      </div>

      {/* Tablero de juego */}
      <div className="grid grid-cols-8 gap-1 bg-gray-400 p-2 rounded-lg max-w-2xl">
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
          const row = Math.floor(index / BOARD_SIZE);
          const col = index % BOARD_SIZE;
          return renderCell(row, col);
        })}
      </div>

      {/* Botón de reinicio */}
      <div className="mt-2">
        <motion.button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reiniciar Juego
        </motion.button>
      </div>

      {/* Modal de instrucciones */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="font-bold text-blue-800 text-xl mb-4">Instrucciones del Buscaminas</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Pulsa cualquier casilla para comenzar el juego</li>
              <li>Usa el botón para alternar entre:
                <ul className="list-circle pl-5 mt-1">
                  <li><strong>Revelar Celdas</strong>: Descubre lo que hay en la celda</li>
                  <li><strong>Marcar Minas</strong>: Coloca una bandera donde creas que hay una mina</li>
                </ul>
              </li>
              <li>Los números indican cuántas minas hay en las casillas adyacentes</li>
              <li>¡Cuidado! Si revelas una mina, pierdes el juego</li>
              <li>Encuentra todas las minas para ganar</li>
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

export default Buscaminas;