'use client';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { ButtonWithSound } from '../ButtonWithSound'; // Importa el nuevo componente

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function MonthStep({
  initialValue = '',
  onNext,
  onBack
}: {
  initialValue?: string;
  onNext: (month: string) => void;
  onBack: () => void;
}) {
  const [selectedMonth, setSelectedMonth] = useState(initialValue);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-3">
        ¿En qué mes estamos?
      </h2>

      {/* Input + Botón de validación */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 p-4 text-2xl border-2 border-blue-200 rounded-lg bg-white min-h-[60px]">
          {selectedMonth ? months[parseInt(selectedMonth) - 1] : 'Mes'}
        </div>
        <ButtonWithSound
          onClick={() => onNext(selectedMonth)}
          disabled={!selectedMonth}
          className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaCheck size={24} />
        </ButtonWithSound>
      </div>

      {/* Teclado de meses con ButtonWithSound */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        {months.map((month, index) => (
          <ButtonWithSound
            key={month}
            onClick={() => setSelectedMonth((index + 1).toString())}
            className={`p-4 text-xl text-center rounded-lg transition ${
              selectedMonth === (index + 1).toString()
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
          >
            {month}
          </ButtonWithSound>
        ))}
      </div>

      
    </div>
  );
}