const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // URL base de tu aplicación
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Patrón para encontrar pruebas
    supportFile: false, // Desactiva soporte si no usas un archivo support.js
  },
});