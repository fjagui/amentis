// app/math-exercise.js
import MathExercise from '../components/MathExercise'; // Importar el componente
import Layout from '../components/Layout';
export default function MathExercisePage() {
  return (
    <Layout>
    {/* Contenido específico del ejercicio aquí */}
    <div className="text-center space-y-8">
      <h2 className="text-4xl font-bold text-gray-800">Título del Ejercicio</h2>
      <p className="text-2xl text-gray-600">Instrucciones del ejercicio...</p>
      <MathExercise /> {/* Componentes interactivos del ejercicio */}
    </div>
  </Layout>
  );
}
