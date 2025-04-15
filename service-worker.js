// Service Worker: Check if the browser supports service workers and register it
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);

                // Handle service worker updates
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available and can be served
                                alert('New content is available, please refresh the page.');
                            } else {
                                // First time service worker installation
                                console.log('Content is now available offline!');
                            }
                        }
                    };
                };
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}