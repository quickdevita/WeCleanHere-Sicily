self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('wecleanheresicily-cache').then((cache) => {
            return cache.addAll([
                '/',
                'index.html',
                'assets/styles/style.css',
                'js/main.js',
                'manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
