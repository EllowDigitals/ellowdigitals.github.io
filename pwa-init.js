(function () {
    const version = '3.0.0';
    const swPath = '/service-worker.js';
    const manifestPath = '/assets/favicon/site.webmanifest';

    const log = (msg, color = '#4CAF50') => {
        console.log(`%c[PWA v${version}] ${msg}`, `color:${color}; font-weight:bold;`);
    };

    const toast = (msg, duration = 4000) => {
        const el = document.createElement('div');
        el.className = 'toast';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.classList.add('show'), 100);
        setTimeout(() => el.classList.remove('show'), duration - 300);
        setTimeout(() => el.remove(), duration);
    };

    const addToastStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: #fff;
                padding: 12px 20px;
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                z-index: 9999;
            }
            .toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    };

    const registerServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(swPath, { scope: '/' })
                .then(reg => {
                    log('Service Worker registered ✅');
                    handleUpdates(reg);
                })
                .catch(err => {
                    log('Service Worker registration failed ❌', '#e74c3c');
                    console.error(err);
                });
        } else {
            log('Service Worker not supported in this browser 🚫', '#ff9800');
        }
    };

    const handleUpdates = (reg) => {
        reg.onupdatefound = () => {
            const worker = reg.installing;
            worker.onstatechange = () => {
                if (worker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        toast('🔄 New content available. Refresh to update.');
                        log('New version available. Prompting user to refresh.', '#f39c12');
                    } else {
                        toast('✅ Content is available offline!');
                        log('Content cached for offline use.');
                    }
                }
            };
        };
    };

    const requestPushPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                log('Push notifications enabled 🔔', '#00BCD4');
                // Push registration logic here (e.g., using VAPID + backend)
            } else {
                log('Push notifications not granted 🚫', '#ff9800');
            }
        } else {
            log('Push notifications not supported 🚫', '#ff9800');
        }
    };

    const setupManifest = () => {
        if (!document.querySelector('link[rel="manifest"]')) {
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = manifestPath;
            document.head.appendChild(link);
            log('PWA Manifest attached 📝');
        }
    };

    window.addEventListener('load', () => {
        addToastStyles();
        setupManifest();
        registerServiceWorker();
        requestPushPermission();
    });
})();
