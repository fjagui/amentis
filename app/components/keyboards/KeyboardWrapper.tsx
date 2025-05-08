'use client';
import { KeyboardProps } from './types';
import { Howl } from 'howler';
import React from 'react';
import { useEffect, useRef, ReactElement, MouseEvent } from 'react';

// Define el tipo para las props de los botones hijos
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
      src: ['/sounds/pulsa.mp3'],
      preload: true
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const handleKeyPress = (value: string) => {
    soundRef.current?.play();
    onKeyPress(value);
  };

  // Clona los children con tipado seguro
  const childrenWithProps = children && React.Children.map(children, (child) => {
    if (React.isValidElement<KeyboardButtonProps>(child)) {
      return React.cloneElement<KeyboardButtonProps>(child, {
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e);
          handleKeyPress(
            child.props.value || 
            (typeof child.props.children === 'string' ? child.props.children : '')
          );
        }
      });
    }
    return child;
  });

  return (

 // Agrega este caso para el variant "month"
<div className={`keyboard-${
  variant === 'numeric' ? 'numeric' : 
  variant === 'alpha' ? 'alpha' : 
  'month'
} bg-gray-100 p-4 rounded-lg`}><div className="grid grid-cols-10 gap-2">
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