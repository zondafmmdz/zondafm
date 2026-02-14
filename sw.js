const CACHE_NAME = 'zonda-fm-v1';
const ASSETS = [
  './',
  './index.html',
  './logo.png',
  './manifest.json',
  'https://vjs.zencdn.net/7.20.3/video-js.css',
  'https://vjs.zencdn.net/7.20.3/video.min.js'
];

// Instalación: Guardar archivos básicos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpiar cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Estrategia de red: Intentar cargar de internet, si falla usar caché
// Pero para el stream HLS (.m3u8), siempre ir a la red
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('.m3u8') || event.request.url.includes('.ts')) {
    return; // No cachear el streaming de video
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
