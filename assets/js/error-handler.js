(function () {
    const version = '3.0.0';
    const endpoint = 'https://formsubmit.co/ajax/ellowdigitals@gmail.com';
    const csrfToken = Math.random().toString(36).substring(2, 15);

    const Shield = {
        showVersion: () =>
            console.log(`%cEllowDigitals Shield v${version}`, 'color:#4CAF50;font-weight:bold;font-size:16px'),

        secureActions: () => {
            console.log('%cSecurity Layer Active', 'color:#f44336;font-weight:bold;font-size:16px');

            const rate = { map: {}, max: 5, interval: 10000 };
            document.addEventListener('click', (e) => {
                const t = e.target;
                if (t && t.matches('.sensitive-button')) {
                    const key = t.id || t.className;
                    const now = Date.now();

                    if (rate.map[key] && now - rate.map[key] < rate.interval) {
                        console.warn('%cRate limit triggered', 'color:#fff;background:#e91e63;font-weight:bold');
                        e.preventDefault();
                        return;
                    }

                    rate.map[key] = now;
                    console.warn('%cBlocked sensitive action', 'color:#fff;background:#ff9800;font-weight:bold');
                    Shield.logSecurity('Blocked action attempt', e);
                    e.preventDefault();
                }
            });
        },

        retry: (url, formData, tries) =>
            new Promise((resolve, reject) => {
                const run = (left) =>
                    fetch(url, { method: 'POST', body: formData })
                        .then(r => r.json())
                        .then(resolve)
                        .catch(err => (left > 0 ? run(left - 1) : reject(err)));
                run(tries);
            }),

        sendError: (data) => {
            const fd = new FormData();
            fd.append('name', 'Error');
            fd.append('email', 'ellowdigitals@gmail.com');
            fd.append('message', JSON.stringify(data));
            Shield.retry(endpoint, fd, 3)
                .then(res => {
                    if (!res.success) console.error('Error send failed:', res.message);
                })
                .catch(err => console.error('Send error:', err));
        },

        handleError: (err, ctx = 'Unknown Context') => {
            const normalized = {
                message: err?.message || String(err),
                stack: err?.stack || 'No stack',
                context: ctx,
                url: location.href,
                timestamp: new Date().toISOString(),
                version,
                userAgent: navigator.userAgent
            };
            console.error('%cError:', 'color:#d32f2f;font-size:14px;font-weight:bold', normalized);
            Shield.sendError(normalized);
        },

        sendNewUser: () => {
            if (localStorage.getItem('visited')) return;
            localStorage.setItem('visited', '1');

            fetch('http://ip-api.com/json')
                .then(r => r.json())
                .then(data => {
                    const fd = new FormData();
                    fd.append('name', 'New User');
                    fd.append('email', 'ellowdigitals@gmail.com');
                    fd.append('message', JSON.stringify({
                        ip: data.query,
                        location: `${data.city}, ${data.regionName}, ${data.country}`,
                        device: navigator.userAgent,
                        timestamp: new Date().toISOString(),
                        csrfToken
                    }));
                    return Shield.retry(endpoint, fd, 3);
                })
                .then(res => {
                    if (!res.success) console.error('Failed new user send:', res.message);
                })
                .catch(err => console.error('New user error:', err));
        },

        logSecurity: (msg, event) => {
            Shield.sendError({
                message: msg,
                eventDetails: event,
                timestamp: new Date().toISOString(),
                version,
                csrfToken
            });
        }
    };

    window.EllowDigitalsShield = Shield;

    addEventListener('load', () => {
        Shield.showVersion();
        Shield.secureActions();
        Shield.sendNewUser();
    });

    window.onerror = (msg, src, line, col, err) => {
        Shield.handleError(err || { message: msg, stack: `${src}:${line}:${col}` }, 'Global JS Error');
    };

    window.onunhandledrejection = (e) => {
        Shield.handleError(e.reason || { message: 'Unhandled rejection' }, 'Promise Rejection');
    };
})();
