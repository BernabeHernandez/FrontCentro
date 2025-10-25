const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Ajusta si usas otro puerto (ej. 5173 para Vite)
    specPattern: 'cypress/e2e/gamificacion_ruleta.cy.js', // Solo este archivo
    supportFile: false, // Desactiva soporte si no usas support.js
  },
});