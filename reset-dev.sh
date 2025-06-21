#!/bin/bash

echo "🧹 Limpiando caché y dependencias..."
rm -rf .next node_modules package-lock.json

echo "📦 Instalando dependencias..."
npm install

echo "🚀 Iniciando servidor de desarrollo..."
npm run dev