'use client';

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
      <div 
        className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}