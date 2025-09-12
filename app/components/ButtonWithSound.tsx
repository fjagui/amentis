// components/ButtonWithSound.tsx
'use client';
import { Howl } from 'howler';
import React, { useEffect, useRef } from 'react';

interface ButtonWithSoundProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  soundSrc?: string;
  playSound?: boolean;
}

export const ButtonWithSound = ({
  soundSrc = '/sounds/pulsa.mp3',
  playSound = true,
  onClick,
  children,
  ...props
}: ButtonWithSoundProps) => {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [soundSrc],
      preload: true,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [soundSrc]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Reproduciendo sonido');
    if (playSound) {
      soundRef.current?.play();
    }
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};