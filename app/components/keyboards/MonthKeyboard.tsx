'use client';
import { KeyboardWrapper } from './KeyboardWrapper';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MonthKeyboard = ({ onMonthSelect }: { onMonthSelect: (monthNumber: string) => void }) => {
  return (
    <KeyboardWrapper 
      variant="month"
      onKeyPress={(value) => {
        console.log('Valor recibido en KeyboardWrapper:', value); // Debug
        onMonthSelect(value);
      }}
    >
      {months.map((month, index) => (
        <button
          key={month}
          value={(index + 1).toString()} // ¡Importante: debe ser string!
          className="p-4 text-lg bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {month}
        </button>
      ))}
    </KeyboardWrapper>
  );
};