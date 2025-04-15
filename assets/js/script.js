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

// 🚀 Init All on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    console.groupCollapsed("%c🚀 Ellowdigitals Scripts Loaded", "color:#fff; background:#2ecc71; padding:4px 10px; border-radius:6px;");
    console.log("%cVersion: v4.6", "color:#222; background:#f39c12; padding:2px 6px; border-radius:4px;");
    console.log("%cLast Updated: 2025-04-11", "color:#999; font-size:12px;");
    console.groupEnd();

    // 📦 Core Initializations
    initEnrollForm();                // 📝 Enroll Form UX (v3.2)
    updateFooterYear();              // 📆 Footer Year Auto (v2.0)
    checkLazyLoadSupport();          // 💤 Lazy Loading Check (v2.1)
    ensureMetaDescription();         // 🧠 Meta Tag Fallback
    monitorConnectionStatus();       // 🔌 Connection Monitor (v3.8)
    handleNavbarLinks();             // 📱 Navbar Mobile Toggle (v1.0)
});

// Form Validation & UX for the Contact Form
function initEnrollForm() {
    const form = $("#contactForm");
    if (!form) return console.warn("[EnrollForm] Form element not found.");

    const nameInput = $("#name");
    const emailInput = $("#email");
    const messageInput = $("#message");
    const submitBtn = $("button.btn");

    if (!nameInput || !emailInput || !messageInput || !submitBtn) {
        console.error("[EnrollForm] Required fields missing in DOM.");
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleFormValidation(nameInput, emailInput, messageInput, submitBtn);
    });
}

function handleFormValidation(nameInput, emailInput, messageInput, submitBtn) {
    // Reset previous errors
    [nameInput, emailInput, messageInput].forEach(field => resetFieldError(field));

    let hasError = false;

    // Name Validation
    if (!nameInput.value.trim()) {
        showError(nameInput, "Please enter your name.");
        hasError = true;
    }

    // Email Validation (Improved Regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, "Please enter a valid Gmail address.");
        hasError = true;
    }

    // Message Validation
    if (!messageInput.value.trim()) {
        showError(messageInput, "Please enter your message.");
        hasError = true;
    }

    if (hasError) return;

    // UX feedback
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // Simulate form submission (for now)
    setTimeout(() => {
        alert("Form submitted successfully!");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }, 1500); // Simulate a delay
}

function showError(field, message) {
    field.classList.add("input-error", "shake");
    const errorMsg = document.createElement("div");
    errorMsg.className = "form-error";
    errorMsg.textContent = message;
    field.insertAdjacentElement("afterend", errorMsg);
    setTimeout(() => field.classList.remove("shake"), 500);
}

function resetFieldError(field) {
    field.classList.remove("input-error", "shake");
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains("form-error")) {
        errorElement.remove();
    }
}

// Footer Year Auto Update v2.0
function updateFooterYear() {
    const footerYear = $(".footer-year");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
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

    // Show Welcome Message for First Time Visits
    if (isFirstVisit) {
        localStorage.setItem('isFirstVisit', 'false');
        statusElement.textContent = "Welcome to our website!";
        statusElement.classList.add("welcome");
        displayConnectionStatus(statusElement);
        setTimeout(() => statusElement.style.display = "none", 5000);
    } else {
        displayConnectionStatus(statusElement);
    }

    // Function to Update Connection Status
    function displayConnectionStatus(statusElement) {
        const updateConnectionStatus = () => {
            if (navigator.onLine) {
                statusElement.textContent = "You are now online.";
                statusElement.classList.replace("offline", "online");
                localStorage.setItem('lastStatus', 'online');
            } else {
                statusElement.textContent = "You are offline. Some features may not work.";
                statusElement.classList.replace("online", "offline");
                localStorage.setItem('lastStatus', 'offline');
            }

            statusElement.style.display = "block";
            statusElement.classList.add("show");
        };

        const lastStatus = localStorage.getItem('lastStatus');
        if (lastStatus) {
            statusElement.textContent = `You were previously ${lastStatus}.`;
            statusElement.classList.add(lastStatus);
        } else {
            updateConnectionStatus();
        }

        window.addEventListener("online", updateConnectionStatus);
        window.addEventListener("offline", updateConnectionStatus);

        setTimeout(() => {
            statusElement.style.display = "none";
            statusElement.classList.remove("show");
        }, 7000);
    }
}

// 📱 Navbar Mobile Toggle (v1.0)
function handleNavbarLinks() {
    const navLinks = $$("#navbarNav .nav-link");
    const navbarToggler = $(".navbar-toggler");
    const navbarCollapse = $("#navbarNav");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            // Close the navbar on mobile if open
            if (navbarCollapse.classList.contains("show")) {
                navbarToggler.click();
            }
        });
    });
}
