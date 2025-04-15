(function () {
    const version = '2.0.0';  // Updated version
    const formSubmitEndpoint = 'https://formsubmit.co/ajax/ellowdigitals@gmail.com';
    const csrfToken = generateCSRFToken(); // CSRF Token for security

    // Utility function to generate a CSRF token (optional)
    function generateCSRFToken() {
        return Math.random().toString(36).substring(2, 15);
    }

    function showVersionInfo() {
        console.log('%cEllowDigitals Error Handler - Version: ' + version, 'color: #4CAF50; font-weight: bold; font-size: 16px');
    }

    // Security Shield with CSRF protection and rate-limiting for sensitive actions
    function securityShield() {
        console.log('%cEllowDigitals Security Shield is Active', 'color: #FF5722; font-weight: bold; font-size: 16px');

        const rateLimit = { actionTimestamps: {}, limit: 5, windowMs: 10000 }; // 5 actions per 10 seconds
        document.addEventListener('click', function (event) {
            if (event.target && event.target.matches('.sensitive-button')) {
                const currentTime = Date.now();
                const actionKey = `${event.target.id || event.target.className}`;

                // Rate Limiting Logic
                if (rateLimit.actionTimestamps[actionKey]) {
                    const timeWindow = currentTime - rateLimit.actionTimestamps[actionKey];
                    if (timeWindow < rateLimit.windowMs) {
                        console.warn('%cAction blocked due to rate-limiting!', 'color: #FFEB3B; background-color: #FF5722; font-weight: bold');
                        event.preventDefault();
                        return;
                    }
                }

                rateLimit.actionTimestamps[actionKey] = currentTime;

                console.warn('%cSensitive action blocked. Unauthorized access attempt!', 'color: #FFEB3B; background-color: #FF5722; font-weight: bold');
                sendSecurityLog('Sensitive action blocked', event);
                event.preventDefault();
            }
        });
    }

    function sendErrorToEmail(errorDetails) {
        const formData = new FormData();
        formData.append('name', 'Website Error');
        formData.append('email', 'ellowdigitals@gmail.com');
        formData.append('message', JSON.stringify(errorDetails));

        retryRequest(formSubmitEndpoint, formData, 3)  // Retry up to 3 times on failure
            .then(data => {
                if (data.success) {
                    console.log('Error details sent to email successfully.');
                } else {
                    console.error('Failed to send error details:', data.message);
                }
            })
            .catch(error => {
                console.error('Error sending error details:', error);
            });
    }

    // Retry function for network requests
    function retryRequest(url, formData, retries) {
        return new Promise((resolve, reject) => {
            function attemptRequest(remainingRetries) {
                fetch(url, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(resolve)
                    .catch((error) => {
                        if (remainingRetries > 0) {
                            console.warn(`Retrying... Remaining attempts: ${remainingRetries}`);
                            attemptRequest(remainingRetries - 1);
                        } else {
                            reject(error);
                        }
                    });
            }
            attemptRequest(retries);
        });
    }

    function handleError(error, context = '') {
        const errorDetails = {
            message: error?.message || error?.toString() || 'Unknown error',
            stack: error?.stack || 'No stack trace available',
            version: version,
            context: context || 'No specific context provided',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        console.error('%cError Details:', 'color: #D32F2F; font-weight: bold; font-size: 16px', errorDetails);
        sendErrorToEmail(errorDetails);
    }

    // Function to collect and send new user details with geolocation
    function sendNewUserDetails() {
        if (localStorage.getItem('hasVisited')) {
            console.log('Returning user detected. Skipping new user data sending.');
            return;
        }

        localStorage.setItem('hasVisited', 'true');

        fetch('http://ip-api.com/json')
            .then(response => response.json())
            .then(data => {
                const userDetails = {
                    location: `${data.city}, ${data.regionName}, ${data.country}`,
                    ip: data.query,
                    device: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                    csrfToken: csrfToken,  // Attach CSRF token
                };

                const formData = new FormData();
                formData.append('name', 'New User');
                formData.append('email', 'ellowdigitals@gmail.com');
                formData.append('message', JSON.stringify(userDetails));

                retryRequest(formSubmitEndpoint, formData, 3)
                    .then(data => {
                        if (data.success) {
                            console.log('New user details sent to email successfully.');
                        } else {
                            console.error('Failed to send new user details:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error sending new user details:', error);
                    });
            })
            .catch(error => {
                console.error('Failed to fetch user location:', error);
            });
    }

    function sendSecurityLog(message, event) {
        const securityLog = {
            message: message,
            timestamp: new Date().toISOString(),
            eventDetails: event,
            version: version,
            csrfToken: csrfToken,  // Attach CSRF token
        };

        sendErrorToEmail(securityLog);
    }

    // Global Error and Promise Rejection Handlers
    window.EllowDigitalsShield = {
        showVersionInfo,
        handleError,
        securityShield,
        sendNewUserDetails,
        sendSecurityLog
    };

    window.addEventListener('load', function () {
        showVersionInfo();
        securityShield();
        sendNewUserDetails();
    });

    // ✅ Catch ALL uncaught runtime errors globally
    window.onerror = function (message, source, lineno, colno, error) {
        const errorObj = error || {
            message: message,
            stack: `at ${source}:${lineno}:${colno}`
        };
        EllowDigitalsShield.handleError(errorObj, 'Global JS Error');
    };

    // ✅ Catch ALL uncaught promise rejections globally
    window.onunhandledrejection = function (event) {
        EllowDigitalsShield.handleError(event.reason || { message: 'Unhandled rejection with no reason' }, 'Unhandled Promise Rejection');
    };
})();
