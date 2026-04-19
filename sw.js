const CACHE_NAME = 'master-vault-v2'; // version updated

const urlsToCache = [
    './',
    './index.html',
    './dashboard.html',
    './style.css',
    './script.js',
    './firebase-config.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// INSTALL
self.addEventListener('install', event => {
    self.skipWaiting(); // activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// ACTIVATE (clean old cache)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// FETCH (network first, fallback to cache)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(event.request))
    );
});