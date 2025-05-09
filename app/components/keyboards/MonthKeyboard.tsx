// components/MonthKeyboard.tsx
'use client';
import { ButtonWithSound } from '../ButtonWithSound';

const months = [
  'Enera', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MonthKeyboard = ({ onMonthSelect }: { onMonthSelect: (monthNumber: string) => void }) => {
  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
      {months.map((month, index) => (
        <ButtonWithSound
          key={month}
          onClick={() => onMonthSelect((index + 1).toString())}
          className="p-4 text-lg bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {month}
        </ButtonWithSound>
      ))}
    </div>
  );
};