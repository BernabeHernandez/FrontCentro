import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './Componentes/Temas/ThemeContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("Service Worker registrado:", reg);
      })
      .catch((err) => {
        console.log("Error al registrar Service Worker:", err);
      });
  });
}
