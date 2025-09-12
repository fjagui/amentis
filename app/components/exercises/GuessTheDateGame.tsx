"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import MonthInputStep from '../onboarding/MonthInputStep';
import YearInputStep from '../onboarding/YearInputStep';
import DayInputStep from '../onboarding/DayInputStep';
import { FaArrowLeft } from "react-icons/fa";

const correcto = new Howl({ src: ["/sounds/correcto.mp3"] });
const incorrecto = new Howl({ src: ["/sounds/incorrecto.mp3"] });

interface HistoricalEvent {
  id: number;
  evento: string;
  fecha: string;
  pista: string;
  tipoFecha: "completa" | "mes-dia" | "año";
}

const GuessTheDateGame = ({ onComplete }: { onComplete: () => void }) => {
  const [allEvents, setAllEvents] = useState<HistoricalEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState<HistoricalEvent | null>(null);
  const [usedEventIds, setUsedEventIds] = useState<number[]>([]);
  const [userGuess, setUserGuess] = useState<{ 
    day: string; 
    month: string; 
    year: string 
  }>({ day: "", month: "", year: "" });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [currentInputStep, setCurrentInputStep] = useState<'day' | 'month' | 'year' | null>('day');
  const [completedEvents, setCompletedEvents] = useState(0);
  const [lastFieldCompleted, setLastFieldCompleted] = useState(false);

  // Cargar todos los eventos al inicio
  useEffect(() => {
    fetch('events/events.json')
      .then(response => response.json())
      .then(data => {
        setAllEvents(data);
        selectNewEvent(data, []);
      });
  }, []);

  // Seleccionar un nuevo evento evitando repeticiones recientes
  const selectNewEvent = (events: HistoricalEvent[], usedIds: number[]) => {
    const availableEvents = events.filter(event => !usedIds.includes(event.id));
    
    if (availableEvents.length === 0) {
      const newEvent = events[Math.floor(Math.random() * events.length)];
      setCurrentEvent(newEvent);
      setUsedEventIds([newEvent.id]);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    const newEvent = availableEvents[randomIndex];
    
    setCurrentEvent(newEvent);
    setUsedEventIds(prev => [...prev, newEvent.id]);
  };

  // Configurar el paso de entrada cuando cambia el evento actual
  useEffect(() => {
    if (currentEvent) {
      // Siempre comenzar con el día
      setCurrentInputStep('day');
      setUserGuess({ day: "", month: "", year: "" });
      setFeedback(null);
      setShowHint(false);
      setAttempts(0);
      setLastFieldCompleted(false);
    }
  }, [currentEvent]);

  const getDateComponents = () => {
    if (!currentEvent) return { day: "", month: "", year: "" };
    
    const [day, month, year] = currentEvent.fecha.split("/");
    
    // Función para eliminar ceros iniciales
    const formatComponent = (val: string) => val.replace(/^0+/, '');
    
    switch(currentEvent.tipoFecha) {
      case "mes-dia":
        return { 
          day: formatComponent(day), 
          month: formatComponent(month), 
          year: "" 
        };
      case "año":
        return { 
          day: "", 
          month: "", 
          year: formatComponent(year) 
        };
      default:
        return { 
          day: formatComponent(day), 
          month: formatComponent(month), 
          year: formatComponent(year) 
        };
    }
  };

  const targetDate = getDateComponents();

  // Función para obtener el nombre del mes
  const getMonthName = (monthNumber: string) => {
    if (!monthNumber) return "";
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const monthIndex = parseInt(monthNumber) - 1;
    return monthIndex >= 0 && monthIndex < 12 ? months[monthIndex] : monthNumber;
  };

  // Construir cadena de fecha en formato natural
  const buildNaturalDateString = () => {
    if (!userGuess.day && !userGuess.month && !userGuess.year) {
      return "Introduce la fecha";
    }

    let dateString = "";
    
    // Añadir día si está presente
    if (userGuess.day) {
      dateString += userGuess.day;
    }
    
    // Añadir mes si está presente
    if (userGuess.month) {
      if (dateString) dateString += " de ";
      dateString += getMonthName(userGuess.month);
    }
    
    // Añadir año si está presente
    if (userGuess.year) {
      if (dateString) dateString += " de ";
      dateString += userGuess.year;
    }
    
    return dateString;
  };

  // Nuevo orden: día -> mes -> año
  const handleDayNext = (day: string) => {
    const newGuess = { ...userGuess, day };
    setUserGuess(newGuess);
    
    if (!currentEvent) return;
    
    if (currentEvent.tipoFecha === "mes-dia") {
      setCurrentInputStep('month');
    } else if (currentEvent.tipoFecha === "completa") {
      setCurrentInputStep('month');
    }
  };

  const handleMonthNext = (month: string) => {
    const newGuess = { ...userGuess, month };
    setUserGuess(newGuess);
    
    if (!currentEvent) return;
    
    if (currentEvent.tipoFecha === "mes-dia") {
      setLastFieldCompleted(true);
    } else if (currentEvent.tipoFecha === "completa") {
      setCurrentInputStep('year');
    }
  };

  const handleYearNext = (year: string) => {
    const newGuess = { ...userGuess, year };
    setUserGuess(newGuess);
    setLastFieldCompleted(true);
  };

  // Efecto para manejar la verificación automática cuando se completa el último campo
  useEffect(() => {
    if (lastFieldCompleted) {
      setTimeout(() => {
        handleSubmit();
        setLastFieldCompleted(false);
      }, 100);
    }
  }, [lastFieldCompleted]);

  // Volver al paso anterior
  const handleBack = () => {
    if (currentInputStep === 'month') {
      setCurrentInputStep('day');
    } else if (currentInputStep === 'year') {
      setCurrentInputStep('month');
    } else {
      setCurrentInputStep(null);
    }
  };

  const handleSubmit = () => {
    if (!currentEvent) return;
    
    // Verificar si tenemos todos los datos necesarios
    const requiredFields = [];
    if (currentEvent.tipoFecha === "completa") {
      if (!userGuess.day) requiredFields.push("día");
      if (!userGuess.month) requiredFields.push("mes");
      if (!userGuess.year) requiredFields.push("año");
    } 
    else if (currentEvent.tipoFecha === "mes-dia") {
      if (!userGuess.day) requiredFields.push("día");
      if (!userGuess.month) requiredFields.push("mes");
    } 
    else if (currentEvent.tipoFecha === "año") {
      if (!userGuess.year) requiredFields.push("año");
    }

    if (requiredFields.length > 0) {
      setFeedback(`Faltan datos: ${requiredFields.join(", ")}`);
      return;
    }

    let isCorrect = true;
    
    if (currentEvent.tipoFecha === "completa") {
      isCorrect = (
        userGuess.day === targetDate.day && 
        userGuess.month === targetDate.month && 
        userGuess.year === targetDate.year
      );
    } 
    else if (currentEvent.tipoFecha === "mes-dia") {
      isCorrect = (
        userGuess.day === targetDate.day && 
        userGuess.month === targetDate.month
      );
    } 
    else if (currentEvent.tipoFecha === "año") {
      isCorrect = (userGuess.year === targetDate.year);
    }

    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setFeedback("¡Correcto! Has acertado la fecha.");
      correcto.play();
      
      // Incrementar contador de eventos completados
      const newCompletedEvents = completedEvents + 1;
      setCompletedEvents(newCompletedEvents);

      setTimeout(() => {
        if (newCompletedEvents < 2) {
          // Mostrar otro evento
          selectNewEvent(allEvents, usedEventIds);
        } else {
          // Completar después de 2 eventos
          onComplete();
        }
      }, 2000);
    } else {
      setFeedback("Fecha incorrecta. Intenta de nuevo.");
      incorrecto.play();
      
      if (attempts >= 1 && !showHint) {
        setShowHint(true);
      }
    }
  };

  const handleSkip = () => {
    if (!currentEvent) return;
    selectNewEvent(allEvents, usedEventIds);
  };

  if (allEvents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Cargando eventos históricos...</div>
      </div>
    );
  }

  if (!currentEvent) return null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 pt-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl p-8 mb-6 rounded-xl border-4 border-gray-300 bg-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          {/* Mostrar botón de volver solo si no estamos en el primer paso (día) */}
          {currentInputStep && currentInputStep !== 'day' && (
            <button 
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <FaArrowLeft className="mr-2" /> Volver
            </button>
          )}
          
        </div>
        
        <div className="mb-4">
          <p className="text-3xl font-semibold text-blue-600">
            {currentEvent.evento}
          </p>
        </div>

        {showHint && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-base font-semibold text-yellow-700">Pista:</p>
            <p className="text-base">{currentEvent.pista}</p>
          </div>
        )}

        {/* Mostrar cadena de fecha en formato natural */}
        <div className="mb-6 flex justify-center">
          <div className="text-2xl font-bold bg-blue-100 px-6 py-3 rounded-lg min-w-[300px] text-center">
            {buildNaturalDateString()}
          </div>
        </div>

        <div className="min-h-[300px]">
          {currentInputStep === 'day' && (
            <DayInputStep
              initialValue={userGuess.day}
              onNext={handleDayNext}
              onBack={() => {}} // No hay acción para el primer paso
            />
          )}
          
          {currentInputStep === 'month' && (
            <MonthInputStep
              initialValue={userGuess.month}
              onNext={handleMonthNext}
              onBack={handleBack}
            />
          )}
          
          {currentInputStep === 'year' && (
            <YearInputStep
              initialValue={userGuess.year}
              onNext={handleYearNext}
              onBack={handleBack}
            />
          )}
        </div>

        {feedback && (
          <div className={`mt-4 text-lg font-bold text-center ${
            feedback.includes("Correcto") ? "text-green-500" : "text-red-500"
          }`}>
            {feedback}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GuessTheDateGame;