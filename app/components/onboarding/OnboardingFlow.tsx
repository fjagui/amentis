'use client';
import { useState } from 'react';
import NameInputStep from './NameInputStep';
import DayInputStep from './DayInputStep';
import MonthInputStep from './MonthInputStep';
import YearInputStep from './YearInputStep';

export default function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    day: '',
    month: '',
    year: ''
  });

  // Avanzar al siguiente paso
  const handleNext = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  // Retroceder al paso anterior
  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  // Validar fecha completa
  const validateDate = () => {
    const currentDate = new Date();
    const userDate = new Date(
      parseInt(userData.year),
      parseInt(userData.month) - 1,
      parseInt(userData.day)
    );

    if (
      userDate.getDate() === currentDate.getDate() &&
      userDate.getMonth() === currentDate.getMonth() &&
      userDate.getFullYear() === currentDate.getFullYear()
    ) {
      onComplete(); // Redirige a /cognitive-exercises
    } else {
      alert('La fecha no coincide con la actual. Por favor, verifica.');
      setStep(2); // Vuelve al paso del día
    }
  };

  return (
    <div className="onboarding-container">
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
         initialValue = {userData.month}
         onNext={(month) => handleNext({ month })}
         onBack={() => setStep(2)}
      />
      )}

      {step === 4 && (
        <YearInputStep
          initialValue={userData.year}
          onNext={validateDate}
          onBack={handleBack}
        />
      )}
    </div>
  );
}