"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Layout from './components/Layout';

const MainPage = () => {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState({
    dia: "",
    mes: "",
    año: "",
  });
  const [step, setStep] = useState(1);
  const [validacionFecha, setValidacionFecha] = useState(false);
  const [progress, setProgress] = useState(25);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    setProgress(step * 25);
  }, [step]);

  const validarFecha = () => {
    const fechaActual = new Date();
    const fechaIngresada = new Date(
      parseInt(fecha.año),
      parseInt(fecha.mes) - 1,
      parseInt(fecha.dia)
    );

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

  const borrarUltimoCaracterNombre = () => {
    setNombre(nombre.slice(0, -1));
  };

  const borrarUltimoCaracterFecha = (campo: "dia" | "año") => {
    setFecha({ ...fecha, [campo]: fecha[campo].slice(0, -1) });
  };

  const borrarMes = () => {
    setFecha({ ...fecha, mes: "" });
  };

  return (
    <Layout currentProgress={progress}>
      {/* Encabezado unificado */}
      <div className="sticky top-0 z-10 bg-white py-3 px-4 shadow-sm flex items-center justify-between">
        <AnimatePresence>
          {step > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => setStep(step - 1)}
              className="p-3 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
            >
              <FaArrowLeft size={20} />
            </motion.button>
          )}
          {step <= 1 && <div className="w-10"></div>} {/* Espacio para alineación */}
        </AnimatePresence>
        
        <h1 className="text-2xl font-bold text-blue-800 text-center flex-1">
          ¡Bienvenido a AMENTIS!
        </h1>
        
        <div className="w-10"></div> {/* Espacio para mantener simetría */}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {/* Paso 1: Nombre */}
        {step === 1 && (
          <motion.div
            key="nombre"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-2xl text-gray-700 mb-3">
                Introduce tu nombre:
              </label>
              <div className="flex gap-3 items-center">
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="flex-1 p-4 text-2xl border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                  placeholder="Escribe tu nombre"
                />
                <button
                  onClick={() => setStep(2)}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaCheck size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Paso 2: Día */}
        {step === 2 && (
          <motion.div
            key="dia"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-2xl text-gray-700 mb-3">
                Introduce el día:
              </label>
              <div className="flex gap-3 items-center">
                <input
                  value={fecha.dia}
                  onChange={(e) => setFecha({ ...fecha, dia: e.target.value })}
                  className="flex-1 p-4 text-2xl border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                  placeholder="Día (1-31)"
                />
                <button
                  onClick={() => setStep(3)}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaCheck size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Paso 3: Mes */}
        {step === 3 && (
          <motion.div
            key="mes"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-2xl text-gray-700 mb-3">
                Selecciona el mes:
              </label>
              <div className="flex gap-3 items-center">
                <input
                  value={meses[parseInt(fecha.mes) - 1] || ""}
                  readOnly
                  className="flex-1 p-4 text-2xl border-2 border-blue-200 rounded-lg bg-white"
                  placeholder="Mes"
                />
                <button
                  onClick={() => setStep(4)}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaCheck size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Paso 4: Año */}
        {step === 4 && (
          <motion.div
            key="año"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-2xl text-gray-700 mb-3">
                Introduce el año:
              </label>
              <div className="flex gap-3 items-center">
                <input
                  value={fecha.año}
                  onChange={(e) => setFecha({ ...fecha, año: e.target.value })}
                  className="flex-1 p-4 text-2xl border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300"
                  placeholder="Año (Ej: 2025)"
                />
                <button
                  onClick={validarFecha}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaCheck size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Validación exitosa */}
        {validacionFecha && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => router.push("/math-exercise")}
              className="px-8 py-4 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 transition"
            >
              Comenzar Ejercicios
            </button>
          </motion.div>
        )}
      </div>

      {/* Teclados fijos */}
      {step === 1 && (
        <div className="sticky bottom-0 bg-white pt-4 pb-6 px-4 border-t border-gray-200">
          <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letra) => (
              <button
                key={letra}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setNombre(nombre + letra);
                }}
                className="p-4 text-5xl bg-blue-100 hover:bg-blue-200 rounded-lg"
              >
                {letra}
              </button>
            ))}
            <button
              onClick={borrarUltimoCaracterNombre}
              className="p-4 text-5xl bg-red-100 hover:bg-red-200 rounded-lg"
            >
              ⌫
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="sticky bottom-0 bg-white pt-4 pb-6 px-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setFecha({ ...fecha, dia: fecha.dia + i.toString() });
                }}
                className="p-4 text-5xl bg-blue-100 hover:bg-blue-200 rounded-lg"
              >
                {i}
              </button>
            ))}
            <button
              onClick={() => borrarUltimoCaracterFecha("dia")}
              className="p-4 text-5xl bg-red-100 hover:bg-red-200 rounded-lg"
            >
              ⌫
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="sticky bottom-0 bg-white pt-4 pb-6 px-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {meses.map((mes, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setFecha({ ...fecha, mes: (index + 1).toString() });
                }}
                 className="p-4 text-2xl bg-blue-100 hover:bg-blue-200 rounded-lg min-h-[70px] flex items-center justify-center" /* Aumentado tamaño */
        >
                {mes}
              </button>
            ))}
            <button
              onClick={borrarMes}
              className="p-3 text-5xl bg-red-100 hover:bg-red-200 rounded-lg"
            >
              ⌫
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="sticky bottom-0 bg-white pt-4 pb-6 px-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.currentTarget.blur();
                  setFecha({ ...fecha, año: fecha.año + i.toString() });
                }}
                className="p-4 text-5xl bg-blue-100 hover:bg-blue-200 rounded-lg"
              >
                {i}
              </button>
            ))}
            <button
              onClick={() => borrarUltimoCaracterFecha("año")}
              className="p-4 text-5xl bg-red-100 hover:bg-red-200 rounded-lg"
            >
              ⌫
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MainPage;