"use strict";

// 💡 Utility Shortcuts
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
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

    initCoreModules();
});

function initCoreModules() {
    updateFooterYear();
    checkLazyLoadSupport();
    ensureMetaDescription();
    handleNavbarLinks();
    initEnrollForm();
}

// 📆 Dynamic Footer Year
function updateFooterYear() {
    const footerYear = $("#footer-year");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
}

// 💤 Lazy Loading Support Check
function checkLazyLoadSupport() {
    const supported = "loading" in HTMLImageElement.prototype;
    console[supported ? "info" : "warn"](`[LazyLoad] Native lazy loading ${supported ? "enabled" : "not supported"}.`);
}

// 🧠 Meta Description Fallback
function ensureMetaDescription() {
    if (!$("meta[name='description']")) {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = "Default description for the site.";
        document.head.appendChild(meta);
        console.warn("[Meta] Description tag was missing. Added fallback.");
    }
}

// 📱 Navbar Link Interaction
function handleNavbarLinks() {
    const navbar = $("#navbar");
    const navbarCollapse = $("#navbarNav");
    const navbarToggler = $(".navbar-toggler");

    if (!navbar || !navbarCollapse || !navbarToggler) return;

    navbar.addEventListener("click", (e) => {
        const link = e.target.closest(".nav-link");
        if (link && !link.classList.contains("dropdown-toggle") && navbarCollapse.classList.contains("show")) {
            navbarToggler.click();
        }
    });
}

// 📝 Enroll Form Validation
function initEnrollForm() {
    const form = $("#contactForm");
    const name = $("#name");
    const email = $("#email");
    const message = $("#message");
    const submitBtn = $("button.btn");

    if (!form || !name || !email || !message || !submitBtn) {
        console.warn("[EnrollForm] One or more form elements missing.");
        return;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        [name, email, message].forEach(resetFieldError);
        let error = false;

        if (!name.value.trim()) {
            showError(name, "Please enter your name.");
            error = true;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email.value)) {
            showError(email, "Please enter a valid Gmail address.");
            error = true;
        }

        if (!message.value.trim()) {
            showError(message, "Please enter your message.");
            error = true;
        }

        if (error) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        setTimeout(() => {
            alert("Form submitted successfully!");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }, 1500);
    });
}

function showError(field, msg) {
    field.classList.add("input-error", "shake");
    const error = document.createElement("div");
    error.className = "form-error";
    error.textContent = msg;
    field.insertAdjacentElement("afterend", error);
    setTimeout(() => field.classList.remove("shake"), 500);
}

function resetFieldError(field) {
    field.classList.remove("input-error", "shake");
    const error = field.nextElementSibling;
    if (error?.classList.contains("form-error")) error.remove();
}

// ⏳ Preloader + Fade Text
const preloader = $("#preloader");
const loadingText = $(".preloader-text");
const loadingLetters = loadingText ? loadingText.querySelectorAll("span") : [];

let progress = 0;
let loadingInterval;

const simulateLoading = () => {
    loadingInterval = setInterval(() => {
        if (progress < 100) {
            progress += Math.floor(Math.random() * 10) + 1;
            updateLoadingText(progress);
        } else {
            clearInterval(loadingInterval);
            hidePreloader();
        }
    }, 150);
};

const updateLoadingText = (percent) => {
    loadingLetters.forEach((letter, i) => {
        letter.style.opacity = percent > i * 12 ? "1" : "0.3";
    });
};

const hidePreloader = () => {
    if (preloader) {
        preloader.style.transition = "opacity 0.8s ease-out";
        preloader.style.opacity = "0";

        setTimeout(() => {
            preloader.style.display = "none";
            document.body.style.overflow = "auto";
            monitorConnectionStatus();
        }, 800);
    }
};

// Fallback if loading hangs
setTimeout(() => {
    if (progress < 100) {
        clearInterval(loadingInterval);
        hidePreloader();
    }
}, 5000);

// Lock scroll until loaded
document.body.style.overflow = "hidden";
window.addEventListener("load", simulateLoading);

// 🌐 Connection Status UI
function monitorConnectionStatus() {
    const statusEl = document.createElement("div");
    statusEl.id = "connection-status";
    document.body.appendChild(statusEl);

    const showStatus = (msg, type = "online") => {
        statusEl.textContent = msg;
        statusEl.className = `show ${type}`;
        statusEl.style.display = "block";

        setTimeout(() => {
            statusEl.classList.remove("show");
            setTimeout(() => (statusEl.style.display = "none"), 300);
        }, 3000);
    };

    const updateStatus = (online) => {
        const type = online ? "online" : "offline";
        const msg = online
            ? "You are now online. All features are available."
            : "You are offline. Some features may not work.";
        showStatus(msg, type);
        localStorage.setItem("lastStatus", type);
    };

    if (!localStorage.getItem("isFirstVisit")) {
        localStorage.setItem("isFirstVisit", "false");
        showStatus("Welcome to EllowDigitals!", "welcome");
    } else {
        updateStatus(navigator.onLine);
    }

    window.addEventListener("online", () => updateStatus(true));
    window.addEventListener("offline", () => updateStatus(false));
}
