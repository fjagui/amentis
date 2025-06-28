'use client';
import { useState } from 'react';
import { AlphaKeyboard } from '../keyboards/AlphaKeyboard'; 
import { FaCheck } from 'react-icons/fa';

export default function NameInputStep({
  initialValue = '',
  onNext
}: {
  initialValue?: string;
  onNext: (name: string) => void;
}) {
  const [name, setName] = useState(initialValue);

  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setName(prev => prev.slice(0, -1));
    } else {
      setName(prev => prev + key);
    }
  };

  return (
    <div className="flex flex-col h-full pb-32">
      <div className="space-y-6 flex-1">
        
        {/* Contenedor flex para input y botón */}
        <div className="flex items-center gap-3">
          {/* Input visual */}
          <div className="flex-1 p-4 text-3xl border-2 border-blue-200 rounded-lg min-h-[60px]">
            {name || <span className="text-gray-400">Nombre</span>}
          </div>
          
          {/* Botón circular separado */}
          <button
            onClick={() => onNext(name)}
            disabled={!name.trim()}
            className="flex-shrink-0 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 shadow-lg"
          >
            <FaCheck size={24} />
          </button>
        </div>
      </div>

      <AlphaKeyboard onKeyPress={handleKeyPress} />
    </div>
  );
}