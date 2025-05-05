// /app/reading-comprehension/page.tsx

import ReadingComprehension from "../components/ReadingComprehension";
import Layout from '../components/Layout';

const Page = () => {
  return (
    <Layout>
    <div className="min-h-screen bg-gray-100 p-4">
    <h2 className="text-4xl font-bold text-gray-800">Título del Ejercicio</h2>
    <p className="text-2xl text-gray-600">Instrucciones del ejercicio...</p> <ReadingComprehension />
    </div>
    </Layout>
  );
};

export default Page;
