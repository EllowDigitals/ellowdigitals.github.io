(function () {
    const SECURITY_VERSION = '2.1.0';
    const SECURITY_EMAIL = 'ellowdigitals@gmail.com';
    const REPORT_ENDPOINT = `https://formsubmit.co/ajax/${SECURITY_EMAIL}`;

    console.log(`%c[SECURITY] EllowDigitals Shield v${SECURITY_VERSION} loaded.`, 'color: #00BCD4; font-weight: bold');

    // 🔐 DevTools Detection
    let devToolsDetected = false;
    setInterval(() => {
        const openDevTools = window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160;
        if (openDevTools && !devToolsDetected) {
            devToolsDetected = true;
            reportThreat('Developer Tools Opened');
        }
    }, 1000);

    // 🔐 Click Spam Detection
    const clickEvents = [];
    document.addEventListener('click', () => {
        const now = Date.now();
        clickEvents.push(now);
        while (clickEvents.length && now - clickEvents[0] > 3000) {
            clickEvents.shift();
        }
        if (clickEvents.length > 20) {
            reportThreat('Click Spam Detected');
        }
    });

    // 🔐 Script Injection Detection
    const trustedScripts = Array.from(document.scripts).map(s => s.src || s.textContent);
    setInterval(() => {
        const currentScripts = Array.from(document.scripts).map(s => s.src || s.textContent);
        const suspicious = currentScripts.filter(s => !trustedScripts.includes(s));
        if (suspicious.length) {
            reportThreat('Suspicious Script Injection', { suspicious });
        }
    }, 3000);

    // 🔐 Iframe Embedding Protection
    if (window.top !== window.self) {
        reportThreat('Iframe Embedding Attempt');
        window.top.location = window.location.href;
    }

    // 🔐 Form Protection (Honeypot + Daily Rate Limit + Timing)
    const formSubmissions = {};
    const formTimestamps = new WeakMap();
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (!form || form.tagName !== 'FORM') return;

        const honeypot = form.querySelector('input[name="company"], input[name="hp-field"]');
        if (honeypot && honeypot.value.trim() !== '') {
            e.preventDefault();
            alert('Spam detected. Submission blocked.');
            reportThreat('Honeypot Field Triggered');
            return;
        }

        // Time-based bot detection
        const now = Date.now();
        const firstSeen = formTimestamps.get(form) || now;
        formTimestamps.set(form, firstSeen);
        const timeTaken = now - firstSeen;
        if (timeTaken < 2000) {
            e.preventDefault();
            alert('Form filled too quickly — possible bot.');
            reportThreat('Form Timing Suspicious', { timeTaken });
            return;
        }

        const todayKey = `${form.action}:${new Date().toISOString().slice(0, 10)}`;
        formSubmissions[todayKey] = (formSubmissions[todayKey] || 0) + 1;

        if (formSubmissions[todayKey] > 10) {
            e.preventDefault();
            alert('You’ve reached today’s submission limit.');
            reportThreat('Daily Form Submission Limit Exceeded');
        }
    });

    // 🔐 UX Restrictions
    document.addEventListener('contextmenu', e => {
        e.preventDefault();
        reportThreat('Right-click Attempt');
    });

    document.addEventListener('copy', e => {
        e.preventDefault();
        reportThreat('Copy Attempt');
    });

    // 🔐 Referrer Spoof Detection
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
        reportThreat('Untrusted Referrer Detected', { referrer: document.referrer });
    }

    // 🔐 MutationObserver for DOM Injection Detection
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        reportThreat('Injected Script Detected via DOM Mutation');
                    }
                });
            }
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 📩 Threat Reporter
    function reportThreat(type, extra = {}) {
        const payload = {
            name: 'Security Alert',
            email: SECURITY_EMAIL,
            message: JSON.stringify({
                type,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                ...extra
            })
        };

        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

        fetch(REPORT_ENDPOINT, {
            method: 'POST',
            body: formData
        }).then(() => {
            console.warn(`[SECURITY] Threat Reported: ${type}`);
        }).catch(err => console.error('[SECURITY] Error:', err));
    }
})();

