'use client';
import { KeyboardProps } from './types';
import { Howl } from 'howler';
import React, { useEffect, useRef, MouseEvent } from 'react';

interface KeyboardButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  value?: string;
  children?: React.ReactNode;
  className?: string;
}

export const KeyboardWrapper = ({
  onKeyPress,
  customKeys = [],
  variant = 'numeric',
  children
}: KeyboardProps & { children?: React.ReactNode }) => {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/pulsa.mp3'], // Ruta del sonido
      preload: true
    });

    return () => {
      soundRef.current?.unload(); // Asegúrate de liberar el sonido cuando ya no sea necesario
    };
  }, []);
  const handleKeyPress = (value: string) => {
    soundRef.current?.stop(); // Detiene sonido previo
    soundRef.current?.play();
    
    // Asegura que el valor sea string y evita duplicados
    const processedValue = String(value).trim();
    console.log('Key pressed:', processedValue); // Debug
    
    onKeyPress(processedValue);
  };

  // Clona los children con el manejo de onClick y prop de valor
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<KeyboardButtonProps>(child)) {
      return React.cloneElement(child, {
        ...child.props,
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e);
          const value = child.props.value || 
                       (typeof child.props.children === 'string' ? child.props.children : '');
          handleKeyPress(value);
        }
      });
    }
    return child;
  });

  return (
    <div className={`keyboard-${variant} bg-gray-100 p-4 rounded-lg`}>
      <div className={`grid ${variant === 'month' ? 'grid-cols-3' : variant === 'alpha' ? 'grid-cols-10' : 'grid-cols-10'} gap-2`}>
        {childrenWithProps}
        {customKeys.map((key) => (
          <button
            key={key.value}
            onClick={() => handleKeyPress(key.value)}
            className={`key-${key.value} p-4 text-2xl rounded-lg ${key.className || 'bg-white'}`}
          >
            {key.display || key.value}
          </button>
        ))}
      </div>
    </div>
  );
};
