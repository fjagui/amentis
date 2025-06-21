'use client';
import { KeyboardWrapper } from './KeyboardWrapper';

export const NumericKeyboard = ({ 
  onKeyPress,
  showBackspace = true
}: { 
  onKeyPress: (num: string) => void;
  showBackspace?: boolean;
}) => {
  console.log('[DEBUG] Props en NumericKeyboard:', { onKeyPress }); // Verifica aquí
  return (
    <KeyboardWrapper onKeyPress={onKeyPress} variant="numeric">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
        <button
          key={num}
          value={num.toString()}
          className="p-4 text-3xl bg-blue-100 hover:bg-blue-200 rounded-lg"
          // ¡No usar onClick aquí!
        >
          {num}
        </button>
      ))}
      {showBackspace && (
        <button
          value="BACKSPACE"
          className="p-4 text-3xl bg-red-100 hover:bg-red-200 rounded-lg col-span-2"
        >
          ⌫
        </button>
      )}
    </KeyboardWrapper>
  );
};