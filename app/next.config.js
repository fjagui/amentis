const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Desactiva PWA en desarrollo
  });
  
  module.exports = withPWA({
    reactStrictMode: true,
  });