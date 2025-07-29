"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";
import { AnimatePresence, motion } from "framer-motion";

// Sonidos para el juego
const sonidoAcierto = new Howl({ src: ["/sounds/correcto.mp3"] });
const sonidoError = new Howl({ src: ["/sounds/incorrecto.mp3"] });
const sonidoVoltear = new Howl({ src: ["/sounds/pulsa.mp3"] });

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type EmojiSet = {
  name: string;
  emojis: string[];
};

const JuegoDeParejas = ({ onComplete }: { onComplete: () => void }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pairsFound, setPairsFound] = useState(0);
  const [currentSet, setCurrentSet] = useState<EmojiSet | null>(null);
  
  // Definición de los 4 sets de emojis
  const emojiSets: EmojiSet[] = [
    {
      name: "Comida",
      emojis: ["🍎", "🍕", "🍦", "🍔", "🍓", "🍩", "🍉", "🍪"]
    },
    {
      name: "Animales",
      emojis: ["🐶", "🐱", "🦁", "🐸", "🐵", "🦄", "🐧", "🐙"]
    },
    {
      name: "Corazones",
      emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍"]
    },
    {
      name: "Pelotas",
      emojis: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱"]
    }
  ];
  
  const totalPairs = 6; // Número de parejas a encontrar
  
  const mensajesAnimaciones = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  };

  // Seleccionar un set de emojis aleatorio
  const selectRandomSet = () => {
    const randomIndex = Math.floor(Math.random() * emojiSets.length);
    return emojiSets[randomIndex];
  };

  // Inicializar el juego
  const initializeGame = () => {
    const selectedSet = selectRandomSet();
    setCurrentSet(selectedSet);
    
    const emojisToUse = selectedSet.emojis.slice(0, totalPairs);
    const cardPairs = [...emojisToUse, ...emojisToUse];
    
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
    setFeedback(`Tema: ${selectedSet.name} - Encuentra las parejas!`);
    setPairsFound(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (pairsFound === totalPairs) {
      setGameComplete(true);
      setFeedback("¡Felicidades! Has ganado 🎉");
      onComplete();
    }
  }, [pairsFound, onComplete]);

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || isProcessing || flippedCards.length >= 2) {
      return;
    }

    sonidoVoltear.play();
    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

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
        // No es pareja - mostrar por más tiempo
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

      {currentSet && (
        <div className="text-xl font-semibold text-gray-700 bg-white px-6 py-2 rounded-full shadow-md mb-4">
          Tema: {currentSet.name}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 my-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-32 h-32 rounded-xl cursor-pointer shadow-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched 
                ? "bg-white" 
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
            {(card.isFlipped || card.isMatched) ? (
              <div className="w-full h-full flex items-center justify-center">
                <motion.span 
                  className="text-6xl" // Tamaño aumentado del emoji
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {card.value}
                </motion.span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl text-transparent">?</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="text-2xl font-semibold text-gray-700 bg-white px-6 py-3 rounded-full shadow-md">
          Movimientos: {moves} | Parejas: {pairsFound}/{totalPairs}
        </div>

        <div className="flex gap-6">
          <motion.button
            onClick={initializeGame}
            className="px-8 py-4 bg-blue-600 text-white text-xl rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nuevo Juego
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default JuegoDeParejas;