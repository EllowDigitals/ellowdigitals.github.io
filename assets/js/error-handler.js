(function () {
    const version = '1.2.0';  // Version of the site
    const formSubmitEndpoint = 'https://formsubmit.co/ajax/ellowdigitals@gmail.com';  // FormSubmit API endpoint for sending data

    // Display version info in console
    function showVersionInfo() {
        console.log('%cEllowDigitals - Version: ' + version, 'color: #4CAF50; font-weight: bold; font-size: 16px');
    }

    // Prevent unauthorized actions (security shield)
    function securityShield() {
        console.log('%cEllowDigitals Security Shield is Active', 'color: #FF5722; font-weight: bold; font-size: 16px');

        document.addEventListener('click', function (event) {
            if (event.target && event.target.matches('.sensitive-button')) {
                console.warn('%cSensitive action blocked. Unauthorized access attempt!', 'color: #FFEB3B; background-color: #FF5722; font-weight: bold');
                sendSecurityLog('Sensitive action blocked', event);
                event.preventDefault(); // Prevent the action from taking place
            }
        });
    }

    // Send error details via FormSubmit to Gmail
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

    // Handle application errors and send reports
    function handleError(error, context = '') {
        const errorDetails = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace available',
            version: version,
            context: context || 'No specific context provided',
            timestamp: new Date().toISOString(),
            url: window.location.href || 'Unknown URL',
            userAgent: navigator.userAgent || 'Unknown user agent',
        };

        console.error('%cError Details:', 'color: #D32F2F; font-weight: bold; font-size: 16px', errorDetails);
        sendErrorToEmail(errorDetails); // Send error to email
    }

    // Fetch user details and send them to Gmail (geo-location, device info)
    function sendNewUserDetails() {
        // Check if user has visited before using localStorage
        if (localStorage.getItem('hasVisited')) {
            console.log('Returning user detected. Skipping new user data sending.');
            return; // Don't send data for returning users
        }

        // Set flag in localStorage to indicate user has visited
        localStorage.setItem('hasVisited', 'true');

        // Retrieve location and device info
        fetch('http://ip-api.com/json')
            .then(response => response.json())
            .then(data => {
                const userDetails = {
                    location: `${data.city}, ${data.regionName}, ${data.country}`,
                    ip: data.query,
                    device: navigator.userAgent,
                    timestamp: new Date().toISOString(),
                };

                // Send new user details via FormSubmit
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

    // Send security log details
    function sendSecurityLog(message, event) {
        const securityLog = {
            message: message,
            timestamp: new Date().toISOString(),
            eventDetails: event,
            version: version,
        };

        sendErrorToEmail(securityLog);  // Use the same email method for security logs
    }

    // Initialize EllowDigitals Shield
    window.EllowDigitalsShield = {
        showVersionInfo: showVersionInfo,
        handleError: handleError,
        securityShield: securityShield,
        sendNewUserDetails: sendNewUserDetails,
        sendSecurityLog: sendSecurityLog
    };

    // Trigger on page load
    window.addEventListener('load', function () {
        showVersionInfo();  // Display version info in console
        securityShield();   // Enable security shield
        sendNewUserDetails(); // Track new user details (only once)
    });
})();
