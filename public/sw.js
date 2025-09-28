const CACHE_NAME = 'ubs-pereiro-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/src/assets/logo-pereiro.png',
  '/medicacoes-auto-custo'
];

// Instalando o service worker e cacheando os recursos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força ativação imediata do SW novo
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Ativando o service worker, limpando caches antigos e assumindo controle imediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim()) // assume controle imediato das páginas
  );
});

// Intercepta requisições e responde com cache ou fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
E no seu arquivo JS principal (por exemplo index.js ou App.js), adicione esse código para forçar recarregamento da página quando o SW atualizar:
js
Copiar código
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
