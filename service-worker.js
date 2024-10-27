const CACHE_NAME = 'gestao-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/script.js',
    '/styles.css',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Instalando o Service Worker e adicionando arquivos ao cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Arquivos em cache:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar requisições e responder com o cache, se disponível
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Se houver uma resposta em cache, retorná-la
                if (response) {
                    return response;
                }

                // Caso contrário, buscar a requisição na rede e adicionar ao cache
                return fetch(event.request).then((networkResponse) => {
                    // Verificar se a resposta da rede é válida
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    // Se válida, adicionar uma cópia ao cache
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                }).catch((error) => {
                    console.error('Erro ao buscar a requisição na rede:', error);
                });
            })
    );
});

// Atualizar o cache ao ativar o Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});