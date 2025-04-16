const CACHE_NAME = 'ellowdigitals-v2';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/preloader.css',
    '/assets/css/styles.css',
    '/pwa-init.js',
    '/assets/js/error-handler.js',
    '/assets/js/security.js',
    '/assets/favicon/android-chrome-192x192.png',
    '/assets/favicon/android-chrome-512x512.png',
    '/assets/favicon/apple-touch-icon.png',
    '/assets/favicon/favicon-16x16.png',
    '/assets/favicon/favicon-32x32.png',
    '/assets/favicon/favicon.ico',
    '/assets/favicon/site.webmanifest',
    '/assets/images/flag.png',
    '/assets/images/ghatak.webp',
    '/assets/images/logo.webp',
    '/assets/images/project1.webp',
    '/assets/images/project2.webp',
    '/assets/images/project3.webp',
    '/assets/images/project4.webp',
    '/assets/videos/bgvideo0.mp4',
    '/robots.txt',
    '/README.md',
    '/license.txt',
    '/LICENSE',
    '/google7c06ba0fd23ccdce.html',
    '/CNAME',
    '/assets/success.html'
];

const VERSION = 'v2.0.0';

// Install event - cache all necessary files
self.addEventListener('install', event => {
    console.log(`%c[Service Worker v${VERSION}] Installing...`, 'color: #4CAF50; font-weight: bold;');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                console.log(`%c[Service Worker v${VERSION}] Files cached successfully!`, 'color: #4CAF50; font-weight: bold;');
            })
            .catch(err => {
                console.error(`%c[Service Worker v${VERSION}] Failed to cache during install:`, 'color: #e74c3c;', err);
            })
    );
    self.skipWaiting(); // Activate worker immediately
});

// Activate event - clear old caches
self.addEventListener('activate', event => {
    console.log(`%c[Service Worker v${VERSION}] Activating...`, 'color: #3498db; font-weight: bold;');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log(`%c[Service Worker v${VERSION}] Deleting old cache: ${key}`, 'color: #e67e22;');
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim(); // Take control of all clients
});

// Fetch event - serve from cache first, fall back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log(`%c[Service Worker v${VERSION}] Serving from cache: ${event.request.url}`, 'color: #8e44ad;');
                    return response;
                }
                console.log(`%c[Service Worker v${VERSION}] Fetching from network: ${event.request.url}`, 'color: #2980b9;');
                return fetch(event.request);
            })
            .catch(err => {
                console.warn(`%c[Service Worker v${VERSION}] Fetch failed:`, 'color: #f39c12;', err);
            })
    );
});

// Push event - display notification
self.addEventListener('push', event => {
    const message = event.data ? event.data.text() : 'New content available!';
    const options = {
        body: message,
        icon: '/assets/favicon/android-chrome-192x192.png',
        badge: '/assets/favicon/android-chrome-512x512.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/' // default click action
        }
    };

    event.waitUntil(
        self.registration.showNotification('📢 EllowDigitals', options)
    );
});

// Optional: Handle notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
