const CACHE_NAME = "ellowdigitals-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/assets/icons/EllowDigitals.ico",
    "/assets/icons/apple-touch-icon.png",
    // Add other assets you want to cache here
];

// Installation event - caching files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});

// Activation event - clearing old caches
self.addEventListener("activate", (event) => {
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

// Fetch event - serving cached content
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response; // Return the cached version
            }
            return fetch(event.request); // Perform network request if not in cache
        })
    );
});
