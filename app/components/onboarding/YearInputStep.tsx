'use client';
import { NumericKeyboard } from 'app/components/keyboards/NumericKeyboard';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface YearInputStepProps {
  initialValue: string;
  onNext: (year: string) => void; // Asegúrate de que esté definida
  onBack: () => void;
}

export default function YearInputStep({
  initialValue,
  onNext,
  onBack
}: {
  initialValue: string;
  onNext: (year: string) => void;  // onNext espera un string
  onBack: () => void;
}) {
  console.log('Props recibidas:', { onNext, onBack }); // 🔍 Verifica aquí
  const [year, setYear] = useState(initialValue);
  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setYear(prev => prev.slice(0, -1));
    } else {
      setYear(prev => (prev + key).slice(0, 4)); // Limitar a 4 dígitos
    }
  };

  const handleSubmit = () => {
    if (!year.trim()) return;
    onNext(year); // Solo pasa el año al padre
  };

  return (
    <div className="flex flex-col h-full pb-32">
      <div className="space-y-6 flex-1">
   

        <div className="flex items-center gap-3">
          {/* Input visual */}
          <div className="flex-1 p-4 text-3xl border-2 border-blue-200 rounded-lg min-h-[60px]">
            {year || <span className="text-gray-400">Año</span>}
          </div>

          {/* Botón de validación */}
          <button
              onClick={handleSubmit}
            disabled={!year.trim()}
            className="flex-shrink-0 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
          >
            <FaCheck size={24} />
          </button>
        </div>
      </div>

      <NumericKeyboard 
        onKeyPress={(key) => {
          console.log('[DEBUG] Tecla presionada:', key);
          handleKeyPress(key);
        }}
        showBackspace={true}
      />
    </div>
  );
}


