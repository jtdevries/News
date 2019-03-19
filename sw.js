// importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');
const staticAssets = [
    './',
    './style.css',
    './app.js',
    './fallback.json',
    './images/skittles.jpg'
];

// const wb = new WorkboxSW();

// wb.precache(staticAssets);



self.addEventListener('install', async event => {
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if(url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(req){
    const cache = await caches.open('news-dynamic');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    }   catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}