(() => {
    const VERSION = 'v3.1.0';
    const SW_PATH = '/service-worker.js';
    const MANIFEST_PATH = '/assets/favicon/site.webmanifest';
    const CACHE_NAME = `pwa-cache-${VERSION}`;

    const log = (msg, color = '#4CAF50') => {
        console.log(`%c[PWA ${VERSION}] ${msg}`, `color:${color}; font-weight:bold;`);
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

    const injectToastStyles = () => {
        if (document.querySelector('#toast-style')) return;
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: #222;
                color: #fff;
                padding: 12px 20px;
                border-radius: 8px;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                z-index: 10000;
            }
            .toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    };

    const attachManifest = () => {
        if (!document.querySelector('link[rel="manifest"]')) {
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = MANIFEST_PATH;
            document.head.appendChild(link);
            log('Manifest linked 📝');
        }
    };

    const registerServiceWorker = async () => {
        if (!('serviceWorker' in navigator)) {
            log('Service Workers not supported ❌', '#f44336');
            return;
        }

        try {
            const reg = await navigator.serviceWorker.register(SW_PATH, { scope: '/' });
            log('Service Worker registered ✅');
            handleUpdates(reg);
            subscribeForPush(reg); // Stubbed below
        } catch (err) {
            log('Service Worker registration failed ❌', '#e74c3c');
            console.error(err);
        }
    };

    const handleUpdates = (reg) => {
        reg.onupdatefound = () => {
            const newWorker = reg.installing;
            newWorker.onstatechange = () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        toast('🔄 New update available! Please refresh.');
                        log('New version ready for activation. 🔁', '#FFC107');
                    } else {
                        toast('✅ Ready to work offline!');
                        log('App cached for offline use.', '#8BC34A');
                    }
                }
            };
        };
    };

    const subscribeForPush = async (reg) => {
        if (!('PushManager' in window)) {
            log('Push notifications not supported 📵', '#FF9800');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            log('Push permission denied 🛑', '#FF5722');
            return;
        }

        try {
            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY_HERE')
            });

            // Optional: Send subscription to your backend
            log('Push subscribed! 📬');
            console.log(subscription);
        } catch (err) {
            log('Push subscription failed ❌', '#e74c3c');
            console.error(err);
        }
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const raw = atob(base64);
        return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
    };

    // Optional: Check for app updates and notify user
    const checkForAppUpdates = () => {
        const currentVersion = VERSION;
        if (localStorage.getItem('pwa_version') !== currentVersion) {
            localStorage.setItem('pwa_version', currentVersion);
            log('App version updated to the latest version. Refreshing app...');
            toast('🔄 App version updated. Refreshing...');
        }
    };

    // Initialize on load
    window.addEventListener('load', () => {
        injectToastStyles();
        attachManifest();
        registerServiceWorker();
        checkForAppUpdates();
    });
})();
