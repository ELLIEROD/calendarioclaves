// 1. Subimos para v3 para forçar o descarte da v2 no cache do navegador
const CACHE_NAME = 'claves-app-v4';

// 2. Incluídos os caminhos dos ícones no ASSETS
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/background-bimbo.png',
  './img/icon-192.png',
  './img/icon-512.png'
];

// Instalação: Baixa os novos assets e ativa imediatamente
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Força o novo SW a assumir sem esperar fechar a aba
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativação: Limpa os caches antigos (v2, v1) e assume os clientes na hora
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[Service Worker Claves] Deletando cache antigo: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle das abas abertas imediatamente
  );
});

// Interceptação de requisições (Modo Offline)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
