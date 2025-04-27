"use client";

import Link from 'next/link'; 
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Importamos framer-motion
import { FaCheck } from "react-icons/fa"; // Importamos el icono de check
import { FaArrowLeft } from "react-icons/fa"; // Icono de flecha
import { useRouter } from "next/navigation";


const MainPage = () => {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState({
    dia: "",
    mes: "",
    año: "",
  });
  const [step, setStep] = useState(1); // Para controlar el paso actual: 1 (nombre), 2 (día), 3 (mes), 4 (año)
  const [validacionFecha, setValidacionFecha] = useState(false);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Función para validar la fecha
  const validarFecha = () => {
    const fechaActual = new Date();
    const fechaIngresada = new Date(
      parseInt(fecha.año),
      parseInt(fecha.mes) - 1, // Los meses en JS empiezan desde 0 (enero)
      parseInt(fecha.dia)
    );

    // Verificar si la fecha es correcta (comparando con la fecha actual)
    if (
      fechaIngresada.getDate() === fechaActual.getDate() &&
      fechaIngresada.getMonth() === fechaActual.getMonth() &&
      fechaIngresada.getFullYear() === fechaActual.getFullYear()
    ) {
      setValidacionFecha(true);
      setStep(5);
    } else {
      alert("La fecha no coincide con la actual.");
    }
  };

  // Función para borrar el último carácter del nombre
  const borrarUltimoCaracterNombre = () => {
    setNombre(nombre.slice(0, -1));
  };

  // Función para borrar el día o el año
  const borrarUltimoCaracterFecha = (campo: "dia" | "año") => {
    setFecha({ ...fecha, [campo]: fecha[campo].slice(0, -1) });
  };

  // Función para borrar el mes
  const borrarMes = () => {
    setFecha({ ...fecha, mes: "" });
  };
  
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <AnimatePresence>
  {step > 1 && (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onClick={() => setStep(step - 1)}
      className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition"
    >
      <FaArrowLeft size={20} />
    </motion.button>
  )}
</AnimatePresence>

      <h1 className="text-5xl font-extrabold text-blue-600 mb-8">¡Bienvenido a haZmente!</h1>

      {/* Paso 1: Ingreso del nombre */}
      {step === 1 && (
        <motion.div
          key="nombre"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-xl"
        >
          <label htmlFor="nombre" className="text-2xl font-medium">Introduce tu nombre:</label>
          <div className="flex items-center mt-4">
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="p-4 border border-gray-300 rounded-lg w-full text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe tu nombre"
            />
            <motion.button
              onClick={() => setStep(2)}
              className="ml-4 p-4 rounded-full bg-green-600 text-white shadow-md hover:bg-green-700 transition transform hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheck size={30} />
            </motion.button>
          </div>

          <div className="grid grid-cols-10 gap-4 mt-4 w-full max-w-5xl">
            {/* Teclado con letras para el nombre */}
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letra) => (
              <button
                key={letra}
                onClick={() => setNombre(nombre + letra)}
                className="boton-teclado bg-blue-500 hover:bg-blue-600"              >
                {letra}
              </button>
            ))}
            {/* Botón de borrado para el nombre */}
            <button
              onClick={borrarUltimoCaracterNombre}
              className="boton-teclado bg-red-500 hover:bg-red-600"
            >
              ⌫
            </button>
          </div>
        </motion.div>
      )}

      {/* Paso 2: Ingreso del día */}
      {step === 2 && (
        <motion.div
          key="dia"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-xl"
        >
          <label htmlFor="dia" className="text-2xl font-medium">Introduce el día:</label>
          <div className="flex items-center mt-4">
            <input
              id="dia"
              type="number"
              value={fecha.dia}
              onChange={(e) => setFecha({ ...fecha, dia: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg w-full text-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Día (1-31)"
            />
            <motion.button
              onClick={() => setStep(3)}
              className="ml-4 p-4 rounded-full bg-green-600 text-white shadow-md hover:bg-green-700 transition transform hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheck size={30} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
            {/* Teclado numérico para el día */}
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onClick={() => setFecha({ ...fecha, dia: fecha.dia + i })}
                className="p-6 text-3xl font-bold bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
              >
                {i}
              </button>
            ))}
            {/* Botón de borrado para el día */}
            <button
              onClick={() => borrarUltimoCaracterFecha("dia")}
              className="p-6 text-3xl font-bold bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              ⌫
            </button>
          </div>
        </motion.div>
      )}

      {/* Paso 3: Selección del mes */}
      {step === 3 && (
        <motion.div
          key="mes"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-xl"
        >
          <label htmlFor="mes" className="text-2xl font-medium">Selecciona el mes:</label>
          <div className="flex items-center mt-4">
            <input
              id="mes"
              type="text"
              value={meses[parseInt(fecha.mes) - 1] || ""}
              readOnly
              className="p-4 border border-gray-300 rounded-lg w-full text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Mes"
            />
            <motion.button
              onClick={() => setStep(4)}
              className="ml-4 p-4 rounded-full bg-yellow-600 text-white shadow-md hover:bg-yellow-700 transition transform hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheck size={30} />
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
            {/* Teclado con meses */}
            {meses.map((mes, index) => (
              <button
                key={index}
                onClick={() => setFecha({ ...fecha, mes: (index + 1).toString() })}
                className="p-6 text-xl font-semibold bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                {mes}
              </button>
            ))}
            {/* Botón de borrado para el mes */}
            <button
              onClick={borrarMes}
              className="p-6 text-3xl font-bold bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              ⌫
            </button>
          </div>
        </motion.div>
      )}

      {/* Paso 4: Ingreso del año (teclado numérico) */}
      {step === 4 && (
        <motion.div
          key="año"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-xl"
        >
          <label htmlFor="año" className="text-2xl font-medium">Introduce el año:</label>
          <div className="flex items-center mt-4">
            <input
              id="año"
              type="number"
              value={fecha.año}
              onChange={(e) => setFecha({ ...fecha, año: e.target.value })}
              className="p-4 border border-gray-300 rounded-lg w-full text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Año (Ej: 2025)"
            />
            <motion.button
              onClick={validarFecha}
              className="ml-4 p-4 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition transform hover:scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FaCheck size={30} />
            </motion.button>
          </div>

          {/* Teclado numérico para el año */}
          <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onClick={() => setFecha({ ...fecha, año: fecha.año + i })}
                className="p-6 text-3xl font-bold bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                {i}
              </button>
            ))}
            {/* Botón de borrado para el año */}
            <button
              onClick={() => borrarUltimoCaracterFecha("año")}
              className="p-6 text-3xl font-bold bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              ⌫
            </button>
          </div>
        </motion.div>
      )}

      {/* Si la fecha es válida, muestra el siguiente paso */}
      
{validacionFecha && (
  <Link href="/math-exercise">  {/* Redirige a la página de MathExercise */}
    <button
      onClick={() => alert("¡Iniciar ejercicios cognitivos!")}
      className="mt-6 px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition"
    >
      Iniciar Ejercicios Cognitivos
    </button>
  </Link>
)}
    </div>
  );
};

export default MainPage;

