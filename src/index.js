import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './Componentes/Temas/ThemeContext'; // Importa el ThemeProvider

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider> {/* Envuelve la app con ThemeProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
