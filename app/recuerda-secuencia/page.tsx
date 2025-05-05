// /app/recuerda-secuencia/page.tsx

import RecuerdaSecuencia from "@/app/components/RecuerdaSecuencia";
import Layout from "../components/Layout";
const Page = () => {
  return (
    <Layout>
    <div className="text-center space-y-8">
      <h2 className="text-4xl font-bold text-gray-800">Título del Ejercicio</h2>
      <RecuerdaSecuencia />
    </div>
    </Layout>
  );
  
};

export default Page;
