import React, { useState, useEffect } from 'react';
import LayoutConEncabezado from './Componentes/Layouts/LayoutConEncabezado';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext';
import ErrorBoundary from './Paginas/Error505Global';
import PaginaError500j from './Paginas/PaginaError500';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './Componentes/ScrollToTop';
import SplashScreen from './splash-screen';
import LocationPermission from './Componentes/LocationPermission/LocationPermission';

// IMPORTA EL TOAST DE RED
import NetworkStatusToast from './Componentes/NetworkStatusToast';

// AÑADIDO: Import de Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

// URLs ESTÁTICAS A PRECARGAR 
const STATIC_API_URLS = [
  'https://backendcentro.onrender.com/api/productos',
  'https://backendcentro.onrender.com/api/serviciosConDes/todos-con-y-sin-descuento',
  'https://backendcentro.onrender.com/api/misionA/mision',
  'https://backendcentro.onrender.com/api/visionA/vision',
  'https://backendcentro.onrender.com/api/perfilF',
  'https://backendcentro.onrender.com/api/deslindes/ultimo',
  'https://backendcentro.onrender.com/api/politica/ultimo',
  'https://backendcentro.onrender.com/api/terminos/ultimo',
];

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    const preloadStaticData = async () => {
      if (!('caches' in window)) return;

      const apiCache = await caches.open('static-api-cache');
      const imageCache = await caches.open('cloudinary-images');

      const promises = STATIC_API_URLS.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-cache',
          });

          // Cachear API
          const apiClone = response.clone();
          await apiCache.put(url, apiClone);
          console.log(`[App] API cacheada: ${url}`);

          // Extraer imágenes del JSON
          if (response.ok) {
            let data;
            try {
              data = await response.clone().json();
            } catch {
              return;
            }

            const items = Array.isArray(data) ? data : (data.data || []);
            const imageUrls = items
              .map(item => item.imagen)
              .filter(img => img && img.includes('res.cloudinary.com'));

            // Cachear cada imagen
            const imgPromises = imageUrls.map(async (imgUrl) => {
              try {
                const imgRes = await fetch(imgUrl, { cache: 'no-cache' });
                if (imgRes.ok) {
                  const imgClone = imgRes.clone();
                  await imageCache.put(imgUrl, imgClone);
                  console.log(`[App] Imagen cacheada: ${imgUrl.split('/').pop()}`);
                }
              } catch (err) {
                console.warn(`[App] Falló imagen: ${imgUrl}`, err);
              }
            });

            await Promise.all(imgPromises);
          }
        } catch (err) {
          console.warn(`[App] Falló API: ${url}`, err);
          const fallback = new Response(JSON.stringify({
            error: true,
            message: "Sin conexión",
            data: []
          }), { headers: { 'Content-Type': 'application/json' } });
          await apiCache.put(url, fallback);
        }
      });

      await Promise.all(promises);
      console.log('[App] Precarga completa: APIs + Imágenes (Productos y Servicios)');
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.update();
          console.log('[App] Service Worker actualizado forzosamente');
        } catch (err) {
          console.warn('[App] Error al actualizar SW:', err);
        }
      }
    };

    const timer = setTimeout(preloadStaticData, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    setTimeout(() => setShowLocationPrompt(true), 300);
  };

  const handleLocationGranted = (position) => {
    console.log('Ubicación permitida:', position.coords.latitude, position.coords.longitude);
    setShowLocationPrompt(false);
  };

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

          {/* Permiso de ubicación */}
          {showLocationPrompt && (
            <LocationPermission
              onPermissionGranted={handleLocationGranted}
              onPermissionDenied={handleLocationDenied}
            />
          )}
          <NetworkStatusToast />
        </ErrorBoundary>
      </LayoutConEncabezado>

      {/* VERCEL ANALYTICS – Se monta una sola vez y trackea todas las rutas */}
      <Analytics />
    </AuthProvider>
  );
};

export default App;