'use client';
import { NumericKeyboard } from 'app/components/keyboards/NumericKeyboard';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

export default function DayInputStep({
  initialValue,
  onNext,
  onBack
}: {
  initialValue: string;
  onNext: (day: string) => void;
  onBack: () => void;
}) {
  const [day, setDay] = useState(initialValue);

  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setDay(prev => prev.slice(0, -1));
    } else {
      setDay(prev => (prev + key).slice(0, 4)); // Limitar a 2 dígitos
    }
  };

  return (
      <div className="flex flex-col h-full pb-32">
        <div className="space-y-6 flex-1">
          
          
          {/* Contenedor flex para input y botón */}
          <div className="flex items-center gap-3">
            {/* Input visual */}
            <div className="flex-1 p-4 text-3xl border-2 border-blue-200 rounded-lg min-h-[60px]">
              {day || <span className="text-gray-400">Día</span>}
            </div>
            
            {/* Botón circular separado */}
            <button
              onClick={() => onNext(day)}
              disabled={!day.trim()}
              className="flex-shrink-0 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
            >
              <FaCheck size={24} />
            </button>
          </div>
        </div>
      <NumericKeyboard 
        onKeyPress={handleKeyPress} 
        showBackspace={true}
      />
    </div>
  );
}