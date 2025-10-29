// src/App.js
import React, { useState } from 'react';
import LayoutConEncabezado from './Componentes/Layouts/LayoutConEncabezado';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext';
import ErrorBoundary from './Paginas/Error505Global';
import PaginaError500j from './Paginas/PaginaError500';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './Componentes/ScrollToTop';
import SplashScreen from './splash-screen';
import LocationPermission from './Componentes/LocationPermission/LocationPermission'; // ← NUEVO

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const handleSplashFinish = () => {
    setShowSplash(false);
    // Mostrar el diálogo de ubicación solo después del splash
    setTimeout(() => setShowLocationPrompt(true), 300);
  };

  // 2. Permiso de ubicación concedido
  const handleLocationGranted = (position) => {
    console.log('Ubicación permitida:', position.coords.latitude, position.coords.longitude);
    setShowLocationPrompt(false);
    // Aquí puedes guardar en contexto, localStorage, o usar en la app
  };

  // 3. Permiso denegado
  const handleLocationDenied = (error) => {
    console.log('Ubicación denegada:', error.message);
    setShowLocationPrompt(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} duration={2000} />;
  }

  return (
    <AuthProvider>
      <LayoutConEncabezado>
        <ErrorBoundary fallback={<PaginaError500j />}>
          <ScrollToTop />
          <AppRouter />
          {showLocationPrompt && (
            <LocationPermission
              onPermissionGranted={handleLocationGranted}
              onPermissionDenied={handleLocationDenied}
            />
          )}
        </ErrorBoundary>
      </LayoutConEncabezado>
    </AuthProvider>
  );
};

export default App;