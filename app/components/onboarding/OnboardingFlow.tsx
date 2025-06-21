'use client';
import { useState } from 'react';
import NameInputStep from './NameInputStep';
import DayInputStep from './DayInputStep';
import MonthInputStep from './MonthInputStep';
import YearInputStep from './YearInputStep';
import { UserGreeting } from '../UserGreeting';
import { FaArrowLeft } from 'react-icons/fa';
import { ConfirmationScreen } from '../ConfirmationScreen';

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
    console.log('Estoy dentro de onboarding');
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
        date={new Date()} onComplete={function (): void {
          throw new Error('Function not implemented.');
        } }      />
    );
  }

  return (
    <div className="onboarding-container space-y-6">
      {/* Botón Atrás */}
      {step > 1 && (
        <button
          onClick={handleBack}
          className="fixed left-4 top-4 z-50 flex items-center gap-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
        >
          <FaArrowLeft className="text-blue-600" />
          <span className="sr-only">Volver a {getPreviousStep()}</span>
        </button>
      )}

      <div className="pt-12">
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
            onBack={handleBack}  // Añadimos el manejo de 'onBack'
          />
        )}

        {step === 3 && (
          <MonthInputStep
            initialValue={userData.month}
            onNext={(month) => handleNext({ month })}
            onBack={handleBack}  // Añadimos el manejo de 'onBack'
          />
        )}

        {step === 4 && (
          <YearInputStep
            initialValue={userData.year}
            onNext={(year) => {
              console.log('onNext llamado con:', year); // 🔍 Debug aquí
              return validateDate(year);
            }}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <ConfirmationScreen 
            userName={userData.name}
            date={new Date()}
            onComplete={onComplete} // Redirige a ejercicios
          />
        )}
      </div>
    </div>
  );
}
