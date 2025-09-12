const path = require('path');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Desactiva PWA en desarrollo
});

module.exports = withPWA({
  reactStrictMode: true,
  webpack: (config) => {
    // Configuración de alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
      '@lib': path.resolve(__dirname, 'lib')
    };

    return config;
  },
  // Opcional: Configuración para TypeScript (si usas rutas con @)
  typescript: {
    tsconfigPath: './tsconfig.json'
  }
});