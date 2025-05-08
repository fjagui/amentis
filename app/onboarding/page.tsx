'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NameInputStep from '../components/onboarding/NameInputStep';
import DayInputStep from '../components/onboarding/DayInputStep';
import ProgressBar from '../components/onboarding/ProgressBar';
import Layout from '../components/Layout';
import MonthInputStep from '../components/onboarding/MonthInputStep';
import YearInputStep from '../components/onboarding/YearInputStep';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    day: '',
    month: '',
    year: ''
  });
    // Calcula el progreso (25% por paso)
    const progress = step * 25;
 
  const handleNext = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

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
      router.push('/cognitive-exercises');
    } else {
      alert('La fecha no coincide con la actual');
    }
  };

  return (
    <Layout>
      <ProgressBar progress={step * 25} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4">
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
            onComplete={validateDate}
            onBack={handleBack}
          />
        )}
      </div>
    </Layout>
  );
}