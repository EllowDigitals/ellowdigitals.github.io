const VERSION = 'v3.1.0';
const CACHE_NAME = `ellowdigitals-${VERSION}`;
const DEBUG = false;

const FILES_TO_CACHE = [
    '/', '/index.html',
    '/assets/css/preloader.css',
    '/assets/css/styles.css',
    '/assets/js/error-handler.js',
    '/assets/js/security.js',
    '/assets/js/script.js',
    '/assets/js/search.js',
    '/assets/favicon/favicon.ico',
    '/assets/favicon/android-chrome-192x192.png',
    '/assets/favicon/android-chrome-512x512.png',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/favicon-16x16.png',
    '/assets/favicon/favicon-32x32.png',
    '/assets/favicon/site.webmanifest',
    '/assets/images/logo.webp',
    '/assets/images/ghatak.webp',
    '/assets/images/project1.webp',
    '/assets/images/project2.webp',
    '/assets/images/project3.webp',
    '/assets/images/project4.webp',
    '/assets/images/flag.png',
    '/assets/videos/bgvideo0.mp4',
    '/assets/success.html',
    '/offline.html',  // Ensure the offline.html is cached
];

// Install and cache app shell
self.addEventListener('install', (event) => {
    if (DEBUG) console.log(`[SW ${VERSION}] Install`);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE).catch((err) => {
                if (DEBUG) console.error(`[SW ${VERSION}] Cache add error:`, err);
            });
        })
    );
    self.skipWaiting();  // Skip waiting for the new service worker to activate
});

// Activate and clean old caches
self.addEventListener('activate', (event) => {
    if (DEBUG) console.log(`[SW ${VERSION}] Activate`);
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        if (DEBUG) console.log(`[SW ${VERSION}] Deleting old cache: ${key}`);
                        return caches.delete(key);
                    }
                })
            );
        }).catch((err) => {
            if (DEBUG) console.error(`[SW ${VERSION}] Cache deletion error:`, err);
        })
    );
    self.clients.claim(); // Take control of all clients immediately
});

// Fetch strategy: Cache-first with fallback to offline page if offline
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip service worker request itself
    if (request.url.includes('service-worker.js')) return;

    // Handle requests for static assets (GET requests)
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // If we have a cached response, serve it and also update the cache in the background (stale-while-revalidate)
                    if (DEBUG) console.log(`[SW ${VERSION}] Serving from cache: ${request.url}`);
                    event.waitUntil(
                        fetch(request).then((response) => {
                            // Only cache the response if it's valid (status code 200)
                            if (response && response.status === 200) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(request, response.clone());
                                });
                            }
                        }).catch((err) => {
                            if (DEBUG) console.error('[SW] Background update failed', err);
                        })
                    );
                    return cachedResponse;
                }

                // If no cached response, try fetching from network, otherwise return offline page
                return fetch(request).catch(() => {
                    if (DEBUG) console.warn(`[SW ${VERSION}] Fetch failed, serving offline.html for: ${request.url}`);
                    return caches.match('/offline.html'); // Serve offline page on failure
                });
            })
        );
    }
});

// Push notification display
self.addEventListener('push', (event) => {
    const data = event.data?.json() || { body: 'You have a new message!' };
    const options = {
        body: data.body,
        icon: '/assets/favicon/android-chrome-192x192.png',
        badge: '/assets/favicon/android-chrome-512x512.png',
        data: { url: data.url || '/' },
        vibrate: [100, 50, 100],
    };

    event.waitUntil(
        self.registration.showNotification('📢 EllowDigitals', options)
    );
});

// Handle notification click and focus the window
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow(event.notification.data.url);
        })
    );
});

// Background sync for failed requests (Optional)
self.addEventListener('sync', (event) => {
    if (event.tag === 'retry-failed-requests') {
        event.waitUntil(
            // Retry sending failed requests, assuming you have stored them for retry
            retryFailedRequests()
        );
    }
});

// Retry failed requests (Example function)
const retryFailedRequests = () => {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.keys().then((keys) => {
            // Retry fetching or sending failed requests
            // This can be expanded to handle actual requests stored in cache
            keys.forEach((key) => {
                fetch(key)
                    .then((response) => {
                        if (response.ok) {
                            cache.put(key, response);
                        }
                    })
                    .catch((err) => {
                        if (DEBUG) console.warn('[SW] Failed to retry request:', err);
                    });
            });
        });
    });
};
