'use client';
import { KeyboardWrapper } from './KeyboardWrapper';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const MonthKeyboard = ({ 
  onMonthSelect 
}: { 
  onMonthSelect: (monthNumber: string) => void 
}) => {
  return (
    <KeyboardWrapper 
      onKeyPress={(value) => onMonthSelect(value)} 
      variant="month"
    >
      {months.map((month, index) => (
        <button
          key={month}
          value={(index + 1).toString()}
          className="p-4 text-lg text-center"
        >
          {month}
        </button>
      ))}
    </KeyboardWrapper>
  );
};