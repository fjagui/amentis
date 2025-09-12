'use client';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/app/contexts/UserContext';
import NameInputStep from './NameInputStep';
import DayInputStep from './DayInputStep';
import MonthInputStep from './MonthInputStep';
import YearInputStep from './YearInputStep';
import { FaArrowLeft } from 'react-icons/fa';
import { ConfirmationScreen } from '../ConfirmationScreen';
import router from 'next/router';

interface User {
  name: string;
  day: string;
  month: string;
  year: string;
  level: number;
}

// Cambiar la definición de props para que onComplete no espere argumentos
export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
    level: 1
  });
  const { setUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cargar usuarios desde el archivo JSON
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/users.json');
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
        setError('Error al cargar los usuarios. Por favor, recarga la página.');
      }
    };

    loadUsers();
  }, []);

  // Inicializar el audio para el sonido de error
  useEffect(() => {
    audioRef.current = new Audio('sounds/incorrecto.mp3');
  }, []);

  // Reproducir sonido de error cuando haya un error
  useEffect(() => {
    if (error && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Error reproduciendo sonido:", e));
    }
  }, [error]);

  // Limpiar error cuando el usuario interactúa con la interfaz
  useEffect(() => {
    const handleInteraction = () => {
      if (error) {
        setError('');
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleInteraction);
      container.addEventListener('touchstart', handleInteraction);
      container.addEventListener('keydown', handleInteraction);
    }

    return () => {
      if (container) {
        container.removeEventListener('click', handleInteraction);
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('keydown', handleInteraction);
      }
    };
  }, [error]);

  const handleNext = (data: Partial<typeof userData>) => {
    // Paso 1: Verificar nombre
    if (step === 1 && data.name) {
      const existingUser = users.find(user => 
        user.name.toLowerCase() === data.name?.toLowerCase().trim()
      );
      
      if (!existingUser) {
        setError('Usuario no encontrado. Verifica el nombre.');
        return;
      }
      
      // Usuario existe, continuar con el onboarding
      setUserData(prev => ({ 
        ...prev, 
        name: data.name!, 
        level: existingUser.level 
      }));
      setStep(2);
      return;
    }
    
    // Pasos 2-4: Verificación de fecha
    setUserData(prev => ({ ...prev, ...data }));
    
    // Si es el último paso (año), validar la fecha completa
    if (step === 4 && data.year) {
      validateDate(data.year);
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const getPreviousStep = () => {
    switch (step) {
      case 2: return 'Nombre';
      case 3: return 'Día';
      case 4: return 'Mes';
      default: return '';
    }
  };

  const validateDate = (year: string): boolean => {
    const currentDate = new Date();
    const userDate = new Date(
      parseInt(year),
      parseInt(userData.month) - 1,
      parseInt(userData.day)
    );
  
    const isValid = (
      userDate.getDate() === currentDate.getDate() &&
      userDate.getMonth() === currentDate.getMonth() &&
      userDate.getFullYear() === currentDate.getFullYear()
    );
    
    if (isValid) {
      setStep(5); // Redirige a la confirmación
      return true;
    } else {
      setError('La fecha no coincide con la actual. Por favor, verifica.');
      setStep(2); // Vuelve al paso del día
      return false;
    }
  };

 // Función para manejar la finalización del onboarding
const handleCompleteOnboarding = () => {
  // Asegurarse de que todos los datos están completos
  const completeUserData = {
    name: userData.name,
    day: userData.day,
    month: userData.month,
    year: userData.year,
    level: userData.level
  };
  
  console.log("Completando onboarding con datos:", completeUserData);
  
  // Verificar que el nivel esté definido
  if (completeUserData.level === undefined) {
    console.error("Nivel de usuario no definido");
    return;
  }
  setUser(completeUserData);
    
    // Forzar una escritura adicional en localStorage para asegurar
    localStorage.setItem('userData', JSON.stringify(completeUserData));
    
    // Redirigir usando window.location para evitar problemas con el router
    setTimeout(() => {
      window.location.href = '/cognitive-exercises';
    }, 100);
 
};

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Cabecera simplificada */}
          <div className="w-full text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {step === 1 && '¿Cómo te llamas?'}
              {step === 2 && '¿Qué día es hoy?'}
              {step === 3 && '¿En qué mes estamos?'}
              {step === 4 && '¿En qué año estamos?'}
              {step === 5 && `¡Bienvenido ${userData.name}!`}
            </h2>
            {step === 5 && <p className="text-lg text-gray-600 mt-2">Nivel: {userData.level}</p>}
          </div>

          {/* Pasos del onboarding */}
          <div className="space-y-8">
            {step === 1 && (
              <NameInputStep
                initialValue={userData.name}
                onNext={(name) => handleNext({ name })}
              />
            )}

            {step === 2 && (
              <DayInputStep
                initialValue={userData.day}
                onNext={(day) => handleNext({ day })}
                onBack={handleBack}
              />
            )}

            {step === 3 && (
              <MonthInputStep
                initialValue={userData.month}
                onNext={(month) => handleNext({ month })}
                onBack={handleBack}
              />
            )}

            {step === 4 && (
              <YearInputStep
                initialValue={userData.year}
                onNext={(year) => handleNext({ year })}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <ConfirmationScreen 
                userName={userData.name}
                date={new Date()}
                onComplete={handleCompleteOnboarding}
              />
            )}
          </div>

          {/* Mostrar error si existe - Mensaje más grande */}
          {error && (
            <div className="mt-6 mx-auto max-w-md p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center text-base font-medium">
              {error}
            </div>
          )}

          {/* Botón de retroceso centrado */}
          {step > 1 && step < 5 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                <FaArrowLeft className="text-white" />
                <span>Volver a {getPreviousStep()}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}