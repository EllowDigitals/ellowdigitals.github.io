(function () {
    const version = '1.2.0';
    const formSubmitEndpoint = 'https://formsubmit.co/ajax/ellowdigitals@gmail.com';

    function showVersionInfo() {
        console.log('%cEllowDigitals - Version: ' + version, 'color: #4CAF50; font-weight: bold; font-size: 16px');
    }

    function securityShield() {
        console.log('%cEllowDigitals Security Shield is Active', 'color: #FF5722; font-weight: bold; font-size: 16px');

        document.addEventListener('click', function (event) {
            if (event.target && event.target.matches('.sensitive-button')) {
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

        fetch(formSubmitEndpoint, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
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
                };

                const formData = new FormData();
                formData.append('name', 'New User');
                formData.append('email', 'ellowdigitals@gmail.com');
                formData.append('message', JSON.stringify(userDetails));

                fetch(formSubmitEndpoint, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.json())
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
        };

        sendErrorToEmail(securityLog);
    }

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
