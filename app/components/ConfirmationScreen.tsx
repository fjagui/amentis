'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ConfirmationScreen({ 
  userName,
  date,
  onComplete
}: { 
  userName: string;
  date: Date;
  onComplete: () => void;
}) {
  const [greeting, setGreeting] = useState('');
  const [refran, setRefran] = useState('');
  const [formattedDate, setFormattedDate] = useState('');

  const refranes = [
    "La sabiduría viene con los años, pero el aprendizaje es para toda la vida",
    "Año de nieves, año de bienes.",
    "Cuando en marzo mayea, en mayo marcea.",
    "Lluvia en San Juan, quita vino y no da pan.",
    "Si quieres buen melonar, siembra en San Juan.",
    "Por San Blas, la cigüeña verás; y si no la vieres, año de nieves.",
    "Gallina vieja da buen caldo.",
    "Quien siembra vientos, recoge tempestades.",
    "Dime con quién andas y te diré quién eres.",
    "Más sabe el diablo por viejo que por diablo.",
    "A falta de pan, buenas son tortas.",
    "Donde hay confianza, da asco.",
    "No dejes camino viejo por vereda nueva.",
    "En casa del herrero, cuchillo de palo.",
    "El que mucho abarca, poco aprieta.",
    "Al mal tiempo, buena cara",
"No hay mal que por bien no venga",
"Cuando el río suena, agua lleva",
"Camarón que se duerme, se lo lleva la corriente",
"Cada quien cosecha lo que siembra",
"Después de la tormenta, siempre llega la calma",
"El diablo sabe por viejo, no por diablo",
"La experiencia es la madre de la ciencia",
"A viejo león, no le enseñes mañas",
"Más vale maña que fuerza",
"Quien mucho duerme, poco aprende",
"No por mucho madrugar amanece más temprano",
"A quien madruga, Dios lo ayuda",
"En abril, aguas mil",
"Hasta el cuarenta de mayo, no te quites el sayo",
"Agua de mayo, pan para todo el año",
"Cría cuervos y te sacarán los ojos",
"El pez por la boca muere",
"Quien mucho habla, mucho yerra",
"Más vale prevenir que curar",
"Ojos que no ven, corazón que no siente",
"En boca cerrada no entran moscas",
  ];

  const saludos = [
    "¡Qué alegría verte de nuevo",
    "¡Hola",
    "¡Me alegro de verte"
  ];
  const router = useRouter(); // Correcta inicialización
  useEffect(() => {
    setGreeting(saludos[Math.floor(Math.random() * saludos.length)]);
    setRefran(refranes[Math.floor(Math.random() * refranes.length)]);
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    setFormattedDate(date.toLocaleDateString('es-ES', options));
  }, [date]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 }, // Reducido el movimiento vertical inicial
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col items-center justify-start min-h-screen p-6 text-center bg-gradient-to-b from-blue-50 to-white pt-16" // Cambiado a justify-start y añadido pt-16
    >
      <div className="max-w-md w-full space-y-4"> {/* Reducido el espacio vertical */}
        {/* Saludo más compacto */}
        <motion.div variants={itemVariants} className="mb-2"> {/* Reducido margen inferior */}
          <h1 className="text-3xl font-bold text-blue-700"> {/* Tamaño de texto ligeramente reducido */}
            {greeting}, <span className="text-blue-900">{userName}!</span>
          </h1>
        </motion.div>

        {/* Fecha más cerca del saludo */}
        <motion.div variants={itemVariants} className="mb-4"> {/* Margen inferior ajustado */}
          <div className="text-xl text-gray-700 font-medium"> {/* Tamaño de texto reducido */}
            {formattedDate}
          </div>
        </motion.div>

        {/* Separador con refrán más compacto */}
        <motion.div 
          variants={itemVariants}
          className="relative py-4" /* Reducido el padding vertical */
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-200"></div>
          </div>
          <div className="relative px-4">
            <span className="px-4 bg-white text-xl font-bold italic text-gray-700">
              "{refran}"
            </span>
          </div>
        </motion.div>

        {/* Botón más cerca del refrán */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6" /* Margen superior reducido */
        >
          <button
          onClick={() => router.push('/cognitive-exercises')}    
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl text-xl font-semibold transition-all shadow-lg hover:shadow-xl" /* Tamaños ajustados */
          >
            Comenzar Ejercicios
            <span className="block text-sm font-normal mt-1 opacity-90">
              Presiona para empezar
            </span>
          </button>
        </motion.div>

        {/* Mensaje final más compacto */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 text-gray-500 text-md" /* Margen y tamaño reducidos */
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          ¡Recuerda volver mañana!
        </motion.div>
      </div>
    </motion.div>
  );
}