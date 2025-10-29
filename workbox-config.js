module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,svg,json,ico,woff2,woff}"
  ],

  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,

  swDest: "build/service-worker.js",

  runtimeCaching: [
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/productos/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "productos-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, 
        },
      },
    },
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/servicios/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "servicios-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },

      {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/carrito\/carrito\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "carrito-cache",
        expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 },
      },
    },

    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/perfilcliente\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "perfilcliente-cache",
        expiration: { maxEntries: 5, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Citas pendientes
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/citascompletaspendientes\/pendientes\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "citas-pendientes-cache",
        expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 },
      },
    },

    // Citas completadas
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/citascompletaspendientes\/completadas\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "citas-completadas-cache",
        expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 },
      },
    },

    // Misión (Home)
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/misionA\/mision$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "mision-cache",
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Visión (Home)
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/visionA\/vision$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "vision-cache",
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Perfil de la empresa (encabezado y footer)
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/perfilF$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "perfil-empresa-cache",
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Deslinde legal
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/deslinde/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "deslinde-cache",
        expiration: { maxEntries: 5, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Políticas
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/politicas/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "politicas-cache",
        expiration: { maxEntries: 5, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Términos y condiciones
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/terminos/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "terminos-cache",
        expiration: { maxEntries: 5, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/cliente\/misCompras\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "miscompras-cache",
        expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Facturación productos
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/facturacion\/productos\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "facturacion-productos-cache",
        expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },

    // Facturación servicios
    {
      urlPattern: /^https:\/\/backendcentro\.onrender\.com\/api\/facturacion\/servicios\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "facturacion-servicios-cache",
        expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    }
  ],

  // Permite que cualquier ruta SPA cargue index.html offline
  navigateFallback: "/index.html",
};
