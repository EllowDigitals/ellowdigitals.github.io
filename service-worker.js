// 🚀 Service Worker: Enhanced with Offline Capabilities
(function () {
    // Check if the browser supports Service Worker API
    if ('serviceWorker' in navigator) {
        // Attempt to register the Service Worker on window load
        window.addEventListener('load', () => {
            registerServiceWorker();
        });
    } else {
        console.warn("Service Worker is not supported in this browser.");
    }

    // Function to register the service worker
    function registerServiceWorker() {
        const serviceWorkerPath = '/service-worker.js';  // Path to the service worker file

        // Attempting to register the Service Worker
        navigator.serviceWorker.register(serviceWorkerPath, { scope: '/' })
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);

                // Listen for updates to the service worker
                handleServiceWorkerUpdates(registration);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
                alert('Service Worker registration failed. Please try again later.');
            });
    }

    // Handle Service Worker Updates
    function handleServiceWorkerUpdates(registration) {
        registration.onupdatefound = () => {
            const installingWorker = registration.installing;

            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        // New content is available, notify the user
                        showContentUpdateNotification();
                    } else {
                        // Service Worker has been installed for the first time
                        console.log('Content is now available offline!');
                    }
                }
            };
        };
    }

    // Function to show notification when new content is available
    function showContentUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.id = 'sw-update-notification';
        updateNotification.innerHTML = `
            <p>New content is available. Please <a href="#" id="sw-refresh">refresh</a> to update.</p>
        `;
        updateNotification.style.position = 'fixed';
        updateNotification.style.bottom = '20px';
        updateNotification.style.left = '20px';
        updateNotification.style.backgroundColor = '#333';
        updateNotification.style.color = '#fff';
        updateNotification.style.padding = '10px';
        updateNotification.style.borderRadius = '5px';

        document.body.appendChild(updateNotification);

        // Refresh button click handler
        document.getElementById('sw-refresh').addEventListener('click', () => {
            window.location.reload();
        });
    }
})();
