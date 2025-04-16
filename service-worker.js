const CACHE_NAME = 'ellowdigitals-v2';
const VERSION = 'v2.0.0';
const DEBUG = false; // Set to true for verbose logs during development

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
    '/assets/success.html',
    '/offline.html'
];

// Install event
self.addEventListener('install', event => {
    if (DEBUG) console.log(`[SW ${VERSION}] Installing...`);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => DEBUG && console.log(`[SW ${VERSION}] Files cached.`))
            .catch(err => console.error(`[SW ${VERSION}] Install cache error:`, err))
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
    if (DEBUG) console.log(`[SW ${VERSION}] Activating...`);
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        if (DEBUG) console.log(`[SW ${VERSION}] Deleting old cache: ${key}`);
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    if (DEBUG) console.log(`[SW ${VERSION}] Cache hit: ${event.request.url}`);
                    return cachedResponse;
                }

                return fetch(event.request)
                    .catch(() => {
                        console.warn(`[SW ${VERSION}] Offline fallback for: ${event.request.url}`);
                        return caches.match('/offline.html');
                    });
            })
            .catch(err => {
                console.error(`[SW ${VERSION}] Fetch error:`, err);
                return caches.match('/offline.html');
            })
    );
});

// Push notifications
self.addEventListener('push', event => {
    const message = event.data?.text() || 'New content available!';
    const options = {
        body: message,
        icon: '/assets/favicon/android-chrome-192x192.png',
        badge: '/assets/favicon/android-chrome-512x512.png',
        vibrate: [200, 100, 200],
        data: { url: '/' }
    };
    event.waitUntil(
        self.registration.showNotification('📢 EllowDigitals', options)
    );
});

// Notification click
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
