export type KeyboardKey = {
    value: string;
    display: string | React.ReactNode;
    className?: string;
  };
  

  // En types.ts
export interface KeyboardProps {
    onKeyPress: (value: string) => void;
    customKeys?: Array<{
      value: string;
      display?: string;
      className?: string;
    }>;
    variant?: 'numeric' | 'alpha' | 'date' | 'month'; // O cualquier otro valor que se ajuste a tus necesidades
  }
  