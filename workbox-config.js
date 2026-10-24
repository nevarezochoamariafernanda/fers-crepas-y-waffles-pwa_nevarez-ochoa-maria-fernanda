
module.exports = {
  // Carpeta principal de Fer's Crepas & Waffles
  globDirectory: '.',

  // Archivos que estarán disponibles sin conexión
  globPatterns: [
    '**/*.{js,html,json,svg,png,jpg,jpeg,webp,css}'
  ],

  // Archivos y carpetas que no deben guardarse en caché
  globIgnores: [
    '**/node_modules/**/*',
    'servidor-ssr*/**/*',
    'docs/**/*',
    '**/*.report.html',
    'reporte-lighthouse*.html',
    'workbox-config.js'
  ],

  // Nombre del Service Worker
  swDest: 'sw.js',

  // Activar inmediatamente las nuevas versiones
  skipWaiting: true,
  clientsClaim: true,

  // Ignorar parámetros de seguimiento
  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
};
