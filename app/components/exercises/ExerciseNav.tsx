'use client';
import { useUserData } from '../../lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

export default function ExerciseNav() {
  const { userData } = useUserData();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm py-3 px-4 flex items-center justify-between">
      <button 
        onClick={() => router.back()}
        className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
      >
        <FaArrowLeft size={20} />
      </button>
      
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          {userData?.name || 'Usuario'}
        </h2>
        <p className="text-sm text-gray-500">Ejercicios cognitivos</p>
      </div>
      
      <button 
        onClick={() => router.push('/')}
        className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
      >
        <FaHome size={20} />
      </button>
    </header>
  );
}