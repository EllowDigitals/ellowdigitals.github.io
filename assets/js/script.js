"use strict";

// 💡 Utility Shortcuts
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const qs = (sel, parent = document) => parent.querySelector(sel);
const debounce = (fn, delay = 300) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
};

// 🚀 Init All on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    // 📢 Core Script Log First
    console.groupCollapsed("%c🚀 Ellowdigitals Scripts Loaded", "color:#fff; background:#2ecc71; padding:4px 10px; border-radius:6px;");
    console.log("%cVersion: v4.6", "color:#222; background:#f39c12; padding:2px 6px; border-radius:4px;");
    console.log("%cLast Updated: 2025-04-11", "color:#999; font-size:12px;");
    console.groupEnd();

    // 📦 Core Initializations
    initEnrollForm();                 // 📝 Enroll Form UX (v3.2)
    updateFooterYear();               // 📆 Footer Year Auto (v2.0)
    checkLazyLoadSupport();           // 💤 Lazy Loading Check (v2.1)
    ensureMetaDescription();          // 🧠 Meta Tag Fallback
    monitorConnectionStatus();        // 🔌 Connection Monitor (v3.8)
});

// Form Validation & UX for the Contact Form
function initEnrollForm() {
    const form = document.querySelector("#contactForm");
    if (!form) return console.warn("[EnrollForm] Form element not found.");

    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const messageInput = form.querySelector("#message");
    const submitBtn = form.querySelector("button.btn");

    if (!nameInput || !emailInput || !messageInput || !submitBtn) {
        console.error("[EnrollForm] Required fields missing in DOM.");
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Reset previous errors
        [nameInput, emailInput, messageInput].forEach(field => {
            field.classList.remove("input-error", "shake");
            field.nextElementSibling?.classList.contains("form-error") && field.nextElementSibling.remove();
        });

        let hasError = false;

        // Name Validation
        if (!nameInput.value.trim()) {
            showError(nameInput, "Please enter your name.");
            hasError = true;
        }

        // Email Validation
        const isValidEmail = /^[\w.+-]+@gmail\.com$/.test(emailInput.value);
        if (!isValidEmail) {
            showError(emailInput, "Please enter a valid Gmail address.");
            hasError = true;
        }

        // Message Validation
        if (!messageInput.value.trim()) {
            showError(messageInput, "Please enter your message.");
            hasError = true;
        }

        if (hasError) {
            return; // Don't submit if there are errors
        }

        // UX feedback
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        // If everything is valid, you can now submit the form
        form.submit(); // Form will be submitted to FormSubmit
    });

    function showError(field, message) {
        field.classList.add("input-error", "shake");
        const errorMsg = document.createElement("div");
        errorMsg.className = "form-error";
        errorMsg.textContent = message;
        field.insertAdjacentElement("afterend", errorMsg);
        setTimeout(() => field.classList.remove("shake"), 500);
    }
}

// Footer Year Auto Update v2.0
function updateFooterYear() {
    const footerYear = document.querySelector(".footer-year");
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

// 💤 Lazy Load Check v2.1
function checkLazyLoadSupport() {
    if (!("loading" in HTMLImageElement.prototype)) {
        console.warn("[LazyLoad] Native lazy loading not supported.");
    } else {
        console.info("[LazyLoad] Native lazy loading supported.");
    }
}

// 🧠 Meta Description Fallback
function ensureMetaDescription() {
    const metaTag = document.querySelector("meta[name='description']");
    if (!metaTag) {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = "Default description for the site.";
        document.head.appendChild(meta);
        console.warn("[Meta Description] Fallback applied.");
    }
}

// 🔌 Connection Monitor v3.8
function monitorConnectionStatus() {
    const statusElement = document.createElement("div");
    statusElement.id = "connection-status";
    document.body.appendChild(statusElement);

    // Check if the user is visiting for the first time
    const isFirstVisit = localStorage.getItem('isFirstVisit') === null;

    // If it's the first visit, show a welcome message
    if (isFirstVisit) {
        localStorage.setItem('isFirstVisit', 'false'); // Set flag to avoid showing this again
        statusElement.textContent = "Welcome to our website!"; // Display welcome message
        statusElement.classList.add("welcome");
        statusElement.style.display = "block"; // Show the status bar
        statusElement.classList.add("show");  // Apply the sliding animation

        setTimeout(() => {
            statusElement.style.display = "none"; // Hide the welcome message after 5 seconds
            statusElement.classList.remove("show");
        }, 5000);
    } else {
        // Function to update the connection status
        function updateConnectionStatus() {
            if (navigator.onLine) {
                statusElement.textContent = "You are now online.";
                statusElement.classList.remove("offline");
                statusElement.classList.add("online");
                localStorage.setItem('lastStatus', 'online');  // Save last known status
            } else {
                statusElement.textContent = "You are offline. Some features may not work.";
                statusElement.classList.remove("online");
                statusElement.classList.add("offline");
                localStorage.setItem('lastStatus', 'offline');  // Save last known status
            }

            statusElement.style.display = "block"; // Ensure the status bar is visible
            statusElement.classList.add("show");  // Apply the sliding animation
        }

        // Check the last known status from localStorage (optional: show last status)
        const lastStatus = localStorage.getItem('lastStatus');
        if (lastStatus === 'online') {
            statusElement.textContent = "You were previously online.";
            statusElement.classList.add("online");
        } else if (lastStatus === 'offline') {
            statusElement.textContent = "You were previously offline.";
            statusElement.classList.add("offline");
        } else {
            updateConnectionStatus();  // Default to updating the status
        }

        // Listen for changes in connection
        window.addEventListener("online", updateConnectionStatus);
        window.addEventListener("offline", updateConnectionStatus);

        // Auto hide after a longer delay (optional)
        setTimeout(() => {
            statusElement.style.display = "none";
            statusElement.classList.remove("show");  // Remove sliding animation class
        }, 7000); // Adjusted to keep the status visible longer
    }
}

monitorConnectionStatus();
