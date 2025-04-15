(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            registerServiceWorker();
        });
    } else {
        console.warn("Service Worker is not supported in this browser.");
    }

    function registerServiceWorker() {
        const serviceWorkerPath = '/service-worker.js';  // Path to the Service Worker file
        navigator.serviceWorker.register(serviceWorkerPath, { scope: '/' })
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
                handleServiceWorkerUpdates(registration);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
                alert('Service Worker registration failed. Please try again later.');
            });
    }

    function handleServiceWorkerUpdates(registration) {
        registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        showContentUpdateNotification();
                    } else {
                        console.log('Content is now available offline!');
                    }
                }
            };
        };
    }

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

        document.getElementById('sw-refresh').addEventListener('click', () => {
            window.location.reload();
        });
    }
})();
