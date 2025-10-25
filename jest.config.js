module.exports = {
    testEnvironment: 'jsdom', // Necesario para pruebas de React
    testMatch: [
      '**/src/Componentes/Cliente/Gamificacion/*.test.jsx', // Solo pruebas para GamificacioRoleta.jsx
    ],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/', // Permite transformar axios
    ],
    moduleNameMapper: {
      '^axios$': '<rootDir>/__mocks__/axios.js', // Usa un mock para axios
    },
  };