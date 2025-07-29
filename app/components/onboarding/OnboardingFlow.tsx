'use client';
import { useState } from 'react';
import NameInputStep from './NameInputStep';
import DayInputStep from './DayInputStep';
import MonthInputStep from './MonthInputStep';
import YearInputStep from './YearInputStep';
import { UserGreeting } from '../UserGreeting';
import { FaArrowLeft } from 'react-icons/fa';
import { ConfirmationScreen } from '../ConfirmationScreen';
import Image from 'next/image';

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    day: '',
    month: '',
    year: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleNext = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
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
      setStep(5); // Redirige a ejercicios
      return true;
    } else {
      alert('La fecha no coincide con la actual. Por favor, verifica.');
      setStep(2); // Vuelve al paso del día
      return false;
    }
  };

  if (showConfirmation) {
    return (
      <ConfirmationScreen 
        userName={userData.name}
        date={new Date()} 
        onComplete={() => {}} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Cabecera simplificada */}
          <div className="w-full text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {step === 1 && '¿Cómo te llamas?'}
              {step === 2 && '¿Qué día es hoy?'}
              {step === 3 && '¿En qué mes estamos?'}
              {step === 4 && '¿En qué año estamos?'}
            </h2>
          </div>


          {/* Barra de progreso */}
          
          {/*step > 1 && step < 5 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">
                  Paso {step} de 5
                </span>
                <span className="text-sm font-medium text-blue-700">
                  {Math.round((step / 5) * 100)}% completado
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          )*/}
        

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
                onNext={(year) => {
                  return validateDate(year);
                }}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <ConfirmationScreen 
                userName={userData.name}
                date={new Date()}
                onComplete={onComplete}
              />
            )}
          </div>

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