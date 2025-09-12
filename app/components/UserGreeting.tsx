// components/UserGreeting.tsx
'use client';
import { useEffect, useState } from 'react';

interface UserGreetingProps {
  userName?: string;
}

export function UserGreeting({ userName }: UserGreetingProps) {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Formatear fecha en español
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    setCurrentDate(new Date().toLocaleDateString('es-ES', options));
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Logo AMENTIS - reemplaza con tu logo real */}
      <div className="text-xl font-bold text-blue-600">AMENTIS</div>
      
      {/* Mensaje dinámico */}
      <div className="text-sm text-gray-600">
        {userName ? (
          <span>Hola, <span className="font-medium">{userName}</span>. Hoy es {currentDate}</span>
        ) : (
          <span>Hoy es {currentDate}</span>
        )}
      </div>
    </div>
  );
}