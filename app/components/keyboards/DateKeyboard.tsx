// components/keyboards/DateKeyboard.tsx
interface DateKeyboardProps {
  type: 'day' | 'month' | 'year' | 'current';
  onKeyPress: (value: string) => void;
  onValidate?: () => void; // Prop opcional
}

export const DateKeyboard = ({
  type,
  onKeyPress,
  onValidate
}: DateKeyboardProps) => {
  // ... implementación
};