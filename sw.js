// sw.js
self.addEventListener('install', evt => {
  // se instala sin esperar activación manual
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  // toma el control de todas las páginas bajo su scope
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  // por ahora no interceptamos nada: dejamos pasar
  // en el futuro aquí podrías cachear assets, rutas, etc.
});
