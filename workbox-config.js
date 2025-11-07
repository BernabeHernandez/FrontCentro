const { generateSW } = require('workbox-build');

generateSW({
  globDirectory: 'build/',
  globPatterns: ['**/*.{html,js,css,png,jpg,svg,json,ico,woff2,woff}'],
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  swDest: 'build/service-worker.js',

  // PRECACHEO DE APIs ESTÁTICAS AL INSTALAR 
  additionalManifestEntries: [
    { url: 'https://backendcentro.onrender.com/api/productos', revision: null },
    { url: 'https://backendcentro.onrender.com/api/serviciosConDes/todos-con-y-sin-descuento', revision: null },
    { url: 'https://backendcentro.onrender.com/api/misionA/mision', revision: null },
    { url: 'https://backendcentro.onrender.com/api/visionA/vision', revision: null },
    { url: 'https://backendcentro.onrender.com/api/perfilF', revision: null },
    { url: 'https://backendcentro.onrender.com/api/deslindes/ultimo', revision: null },
    { url: 'https://backendcentro.onrender.com/api/politica/ultimo', revision: null },
    { url: 'https://backendcentro.onrender.com/api/terminos/ultimo', revision: null },
  ],

  runtimeCaching: [
    // APIs ESTÁTICAS (StaleWhileRevalidate) 
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/(productos|serviciosConDes\/todos-con-y-sin-descuento|misionA\/mision|visionA\/vision|perfilF|deslindes\/ultimo|politica\/ultimo|terminos\/ultimo)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-api-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200, 500] },
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              if (!response || response.status >= 500) {
                return new Response(JSON.stringify({
                  error: true,
                  message: "Datos no disponibles offline",
                  data: []
                }), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
              return response;
            }
          }
        ]
      },
    },

    //IMÁGENES DE CLOUDINARY (CacheFirst)
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*\.(jpg|jpeg|png|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cloudinary-images',
        expiration: {
          maxEntries: 300,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    //APIs DINÁMICAS
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/carrito\/carrito\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'carrito-cache', expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/perfilcliente\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'perfilcliente-cache', expiration: { maxEntries: 5, maxAgeSeconds: 7 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/citascompletaspendientes\/(pendientes|completadas)\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'citas-cache', expiration: { maxEntries: 40, maxAgeSeconds: 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/cliente\/misCompras\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'miscompras-cache', expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/facturacion\/(productos|servicios)\/.*$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'facturacion-cache', expiration: { maxEntries: 40, maxAgeSeconds: 7 * 24 * 60 * 60 } },
    },
  ],

  skipWaiting: true,
  clientsClaim: true,

  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/, /service-worker\.js$/],
}).catch(err => console.error(err));