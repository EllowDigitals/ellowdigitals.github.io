"use strict";

// 💡 Utility Shortcuts
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const qs = (selector, parent = document) => parent.querySelector(selector);
const debounce = (fn, delay = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

// 🚀 DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    console.groupCollapsed("%c🚀 Ellowdigitals Scripts Loaded", "color:#fff; background:#2ecc71; padding:4px 10px; border-radius:6px;");
    console.log("%cVersion: v6.0", "color:#222; background:#f39c12; padding:2px 6px; border-radius:4px;");
    console.log("%cLast Updated: 2025-04-16", "color:#999; font-size:12px;");
    console.groupEnd();

    // 📦 Initialize Modules
    updateFooterYear();
    checkLazyLoadSupport();
    ensureMetaDescription();
    handleNavbarLinks();
    initEnrollForm();
});

// 📝 Enroll Form Validation (v3.5)
function initEnrollForm() {
    const form = $("#contactForm");
    const nameInput = $("#name");
    const emailInput = $("#email");
    const messageInput = $("#message");
    const submitBtn = $("button.btn");

    if (!form || !nameInput || !emailInput || !messageInput || !submitBtn) {
        console.warn("[EnrollForm] Required form fields missing.");
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Reset state
        [nameInput, emailInput, messageInput].forEach(resetFieldError);
        let hasError = false;

        // Validations
        if (!nameInput.value.trim()) {
            showError(nameInput, "Please enter your name.");
            hasError = true;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, "Please enter a valid Gmail address.");
            hasError = true;
        }

        if (!messageInput.value.trim()) {
            showError(messageInput, "Please enter your message.");
            hasError = true;
        }

        if (hasError) return;

        // UX feedback
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        // Simulated submission
        setTimeout(() => {
            alert("Form submitted successfully!");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }, 1500);
    });
}

function showError(field, message) {
    field.classList.add("input-error", "shake");
    const error = document.createElement("div");
    error.className = "form-error";
    error.textContent = message;
    field.insertAdjacentElement("afterend", error);
    setTimeout(() => field.classList.remove("shake"), 500);
}

function resetFieldError(field) {
    field.classList.remove("input-error", "shake");
    const error = field.nextElementSibling;
    if (error && error.classList.contains("form-error")) error.remove();
}

// 📆 Dynamic Footer Year
function updateFooterYear() {
    const footerYear = $("#footer-year");
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}

// 💤 Lazy Loading Support Check
function checkLazyLoadSupport() {
    if ("loading" in HTMLImageElement.prototype) {
        console.info("[LazyLoad] Native support enabled.");
    } else {
        console.warn("[LazyLoad] Native lazy loading not supported.");
    }
}

// 🧠 Meta Description Fallback
function ensureMetaDescription() {
    if (!document.querySelector("meta[name='description']")) {
        const fallbackMeta = document.createElement("meta");
        fallbackMeta.name = "description";
        fallbackMeta.content = "Default description for the site.";
        document.head.appendChild(fallbackMeta);
        console.warn("[Meta] Description meta tag was missing. Fallback applied.");
    }
}

// Preloader Logic
document.body.style.overflow = "hidden"; // Disable scroll until fully loaded

const preloader = document.getElementById("preloader");
const loadingText = document.querySelector(".preloader-text");
const loadingLetters = loadingText ? loadingText.querySelectorAll("span") : [];

let progress = 0;
let interval;

// Simulate loading progress
const simulateLoading = () => {
    interval = setInterval(() => {
        if (progress < 100) {
            progress += Math.floor(Math.random() * 10) + 1;
            animateLoadingText(progress);
        } else {
            clearInterval(interval);
            hidePreloader(); // Hide preloader once loading is complete
        }
    }, 150);
};

// Simple fade-in loading animation
const animateLoadingText = (percent) => {
    loadingLetters.forEach((letter, index) => {
        setTimeout(() => {
            letter.style.opacity = (percent > index * 12) ? "1" : "0.3";
        }, index * 40);
    });
};

// Hide preloader with fade-out effect
const hidePreloader = () => {
    if (preloader) {
        preloader.style.transition = "opacity 0.8s ease-out";
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
            document.body.style.overflow = "auto"; // Enable scroll again
            monitorConnectionStatus(); // Start the connection monitor after preloader is hidden
        }, 800); // Wait for fade-out transition before starting the connection monitor
    }
};

// Failsafe in case loading doesn't reach 100%
setTimeout(() => {
    if (progress < 100) {
        clearInterval(interval);
        hidePreloader();
    }
}, 5000);

// Start loading when page is fully loaded
window.addEventListener("load", simulateLoading);

// Function to monitor the connection status and update the UI
function monitorConnectionStatus() {
    const statusEl = document.createElement("div");
    statusEl.id = "connection-status"; // Create a status element
    document.body.appendChild(statusEl); // Add the element to the body

    // Function to show the connection status with the given message and type
    const showStatus = (message, type = "online") => {
        statusEl.textContent = message; // Set the message text
        statusEl.className = ""; // Reset any previous status classes
        statusEl.classList.add("show", type); // Add the active class and the status class
        statusEl.style.display = "block"; // Ensure it is visible

        // Hide the status after a timeout
        setTimeout(() => {
            statusEl.classList.remove("show"); // Fade out the status
            setTimeout(() => {
                statusEl.style.display = "none"; // Remove the element from view after fade-out
            }, 300); // Match the CSS transition duration
        }, 3000); // Show the message for 3 seconds
    };

    // Show welcome message on first visit
    const isFirstVisit = localStorage.getItem("isFirstVisit") === null;
    if (isFirstVisit) {
        localStorage.setItem("isFirstVisit", "false");
        showStatus("Welcome to ElloDigitals!", "welcome");
    } else {
        updateStatus(navigator.onLine); // Check initial connection status
    }

    // Event listeners for connection change
    window.addEventListener("online", () => updateStatus(true));
    window.addEventListener("offline", () => updateStatus(false));

    // Function to update the status based on whether online or offline
    function updateStatus(isOnline) {
        const message = isOnline
            ? "You are now online. All features are available."
            : "You are offline. Some features may not work.";
        const type = isOnline ? "online" : "offline";
        showStatus(message, type);
        localStorage.setItem("lastStatus", type); // Store last connection status
    }
}

// 📱 Optimized Navbar Link Handler (v2.5)
function handleNavbarLinks() {
    const navbar = $("#navbar");
    const navbarCollapse = $("#navbarNav");
    const navbarToggler = $(".navbar-toggler");

    if (!navbar || !navbarCollapse || !navbarToggler) return;

    navbar.addEventListener("click", (e) => {
        const link = e.target.closest(".nav-link");

        if (!link) return;
        if (link.classList.contains("dropdown-toggle")) return;

        if (navbarCollapse.classList.contains("show")) {
            navbarToggler.click();
        }
    });
}
