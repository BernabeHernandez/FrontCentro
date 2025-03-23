import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './Componentes/Temas/ThemeContext'; 

// Crear la raíz con 'createRoot'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Usar 'root.render' para renderizar la aplicación
root.render(
  <React.StrictMode>
    <ThemeProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
