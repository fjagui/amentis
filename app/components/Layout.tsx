'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import logo from '@/public/logo.png';

type LayoutProps = {
  children: ReactNode;
  currentProgress?: number;
};

export default function Layout({ children, currentProgress = 0 }: LayoutProps) {
  return (
    <div className="flex flex-col h-full mx-1"> {/* Añadido mx-4 para márgenes laterales */}
      {/* Header con margen interno */}
      <header className="bg-white shadow-sm py-3 px-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Image
            src={logo}
            alt="Amentis Logo"
            width={56}
            height={56}
            className="rounded-full border-2 border-blue-200"
          />
          <h1 className="text-3xl font-bold text-blue-800">AMENTIS</h1>
        </div>
      </header>

      {/* Barra de progreso con márgenes */}
      <div className="bg-white py-2 flex-shrink-0 px-4"> {/* Añadido px-4 */}
        <div className="max-w-4xl mx-auto">
          <div className="h-3 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido principal con márgenes */}
      <main className="flex-1 overflow-hidden px-4"> {/* Añadido px-4 */}
        <div className="max-w-4xl mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Footer con márgenes */}
      <footer className="bg-white py-3 border-t border-gray-200 flex-shrink-0 px-4"> {/* Añadido px-4 */}
        <div className="max-w-4xl mx-auto flex justify-between gap-3">
          <button className="px-6 py-3 bg-gray-100 text-blue-800 rounded-xl hover:bg-gray-200 transition text-xl">
            Volver
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xl">
            Siguiente
          </button>
        </div>
      </footer>
    </div>
  );
}