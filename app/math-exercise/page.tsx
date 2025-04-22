// app/math-exercise.js
import MathExercise from '../components/MathExercise'; // Importar el componente

export default function MathExercisePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-3">Ejercicio de Sumas y Restas</h1>
        <MathExercise />  {/* El componente que ya creamos */}
      </div>
    </div>
  );
}
