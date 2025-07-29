'use client';
import { KeyboardWrapper } from './KeyboardWrapper';

export const AlphaKeyboard = ({ onKeyPress }: { onKeyPress: (letter: string) => void }) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <KeyboardWrapper onKeyPress={onKeyPress} variant="alpha">
      {letters.map((letter) => (
        <button
          key={letter}
          value={letter} // Asegúrate de incluir value
          className="p-4 text-4xl bg-blue-100 hover:bg-blue-200 rounded-lg"
        >
          {letter}
        </button>
      ))}
      <button
        value="BACKSPACE" // Asegúrate de incluir value
        className="p-4 text-4xl bg-red-100 hover:bg-red-200 rounded-lg col-span-2"
      >
        ⌫
      </button>
    </KeyboardWrapper>
  );
};
