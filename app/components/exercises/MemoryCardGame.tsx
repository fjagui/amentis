"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego (puedes reutilizar los mismos o añadir nuevos)
const sonidoAcierto = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/incorrecto.mp3"] });
const sonidoVoltear = new Howl({ src: ["/sounds/pulsa.mp3"] });

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const JuegoDeParejas = ({ onComplete }: { onComplete: () => void }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pairsFound, setPairsFound] = useState(0);
  
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  const totalPairs = 6; // Número de parejas a encontrar
  
  const mensajesAnimaciones = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  // Inicializar el juego
  const initializeGame = () => {
    // Crear pares de cartas
    const emojisToUse = emojis.slice(0, totalPairs);
    const cardPairs = [...emojisToUse, ...emojisToUse];
    
    // Barajar las cartas
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        value: emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
    setFeedback("¡Encuentra todas las parejas!");
    setPairsFound(0);
  };

  // Efecto para inicializar el juego al montar el componente
  useEffect(() => {
    initializeGame();
  }, []);

  // Efecto para verificar si el juego está completo
  useEffect(() => {
    if (pairsFound === totalPairs) {
      setGameComplete(true);
      setFeedback("¡Felicidades! Has ganado 🎉");
      onComplete();
    }
  }, [pairsFound, onComplete]);

  // Manejar el clic en una carta
  const handleCardClick = (id: number) => {
    // No hacer nada si la carta ya está volteada o emparejada, o si ya hay 2 cartas volteadas
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || isProcessing || flippedCards.length >= 2) {
      return;
    }

    // Voltear la carta
    sonidoVoltear.play();
    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    // Si es la segunda carta volteada, verificar si hay pareja
    if (flippedCards.length === 1) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      
      const firstCard = cards.find(card => card.id === flippedCards[0]);
      const secondCard = newCards.find(card => card.id === id);
      
      if (firstCard?.value === secondCard?.value) {
        // Pareja encontrada
        sonidoAcierto.play();
        setFeedback("¡Pareja encontrada! ⚡");
        
        setTimeout(() => {
          const matchedCards = newCards.map(card =>
            card.id === flippedCards[0] || card.id === id 
              ? { ...card, isMatched: true } 
              : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setIsProcessing(false);
          setPairsFound(prev => prev + 1);
        }, 1000);
      } else {
        // No es pareja
        sonidoError.play();
        setFeedback("Inténtalo de nuevo ❌");
        
        setTimeout(() => {
          const resetCards = newCards.map(card =>
            card.id === flippedCards[0] || card.id === id 
              ? { ...card, isFlipped: false } 
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8 space-y-6">
      <AnimatePresence mode="wait">
        {feedback ? (
          <motion.div
            key={feedback}
            {...mensajesAnimaciones}
            className={`text-3xl font-bold text-center mb-4 ${
              feedback.includes("❌") ? "text-red-600" :
              feedback.includes("¡Felicidades") ? "text-purple-600" :
              "text-gray-700"
            }`}
          >
            {feedback}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4 my-8">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-24 h-24 flex items-center justify-center text-4xl rounded-xl cursor-pointer shadow-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched 
                ? "bg-white transform rotate-y-180" 
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: card.isFlipped || card.isMatched ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.6s",
              pointerEvents: card.isMatched ? "none" : "auto"
            }}
            whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {(card.isFlipped || card.isMatched) && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {card.value}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="text-2xl font-semibold text-gray-700 bg-white px-6 py-3 rounded-full shadow-md">
          Movimientos: {moves} | Parejas: {pairsFound}/{totalPairs}
        </div>

        <div className="flex gap-8">
          <motion.button
            onClick={initializeGame}
            className="px-8 py-4 bg-blue-600 text-white text-xl rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reiniciar Juego
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default JuegoDeParejas;