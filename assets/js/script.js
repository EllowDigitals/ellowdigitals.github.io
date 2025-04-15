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
    console.log("%cVersion: v5.0", "color:#222; background:#f39c12; padding:2px 6px; border-radius:4px;");
    console.log("%cLast Updated: 2025-04-15", "color:#999; font-size:12px;");
    console.groupEnd();

    // 📦 Initialize Modules
    updateFooterYear();
    checkLazyLoadSupport();
    ensureMetaDescription();
    monitorConnectionStatus();
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
// 🔌 Responsive & Animated Connection Status Notifier v3.0
function monitorConnectionStatus() {
    const statusEl = document.createElement("div");
    statusEl.id = "connection-status";
    document.body.appendChild(statusEl);

    const showStatus = (message, type = "online") => {
        statusEl.textContent = message;
        statusEl.className = ""; // Reset all classes
        statusEl.classList.add("show", type);
        statusEl.style.display = "block";

        setTimeout(() => {
            statusEl.classList.remove("show");
            setTimeout(() => {
                statusEl.style.display = "none";
            }, 300); // Match the CSS transition
        }, 7000);
    };

    // Show welcome message on first visit
    const isFirstVisit = localStorage.getItem("isFirstVisit") === null;
    if (isFirstVisit) {
        localStorage.setItem("isFirstVisit", "false");
        showStatus("Welcome to our website!", "welcome");
    } else {
        updateStatus(navigator.onLine);
    }

    // Connection change listeners
    window.addEventListener("online", () => updateStatus(true));
    window.addEventListener("offline", () => updateStatus(false));

    function updateStatus(isOnline) {
        const message = isOnline
            ? "You are now online."
            : "You are offline. Some features may not work.";
        const type = isOnline ? "online" : "offline";
        showStatus(message, type);
        localStorage.setItem("lastStatus", type);
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
