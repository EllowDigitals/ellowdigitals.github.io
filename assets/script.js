document.addEventListener("DOMContentLoaded", () => {
    // Helper Function to Throttle Event Handlers
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // Scroll Progress Bar
    const scrollProgress = document.getElementById("scrollProgress");
    const updateScrollProgress = throttle(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress) {
            scrollProgress.style.width = `${(scrollTop / scrollHeight) * 100}%`;
        }
    }, 50);

    if (scrollProgress) {
        window.addEventListener("scroll", updateScrollProgress);
        updateScrollProgress(); // Initialize on load
    }

    // Preloader and Content Elements
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    const hidePreloader = () => {
        if (preloader && content) {
            preloader.style.transition = "opacity 0.5s ease-out";
            preloader.style.opacity = "0"; // Fade out
            setTimeout(() => {
                preloader.style.display = "none"; // Remove from view
                content.style.display = "block"; // Show content
            }, 500); // Matches the transition duration
        }
    };

    setTimeout(hidePreloader, 2000);

    // Smooth Scroll Implementation
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetElement = document.querySelector(link.getAttribute("href"));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector("header");
    if (header) {
        window.addEventListener("scroll", throttle(() => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }, 50));
    }

    // Form Validation with Improved Error Handling
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const fields = {
                name: document.getElementById("name"),
                email: document.getElementById("email"),
                message: document.getElementById("message"),
            };
            let isValid = true;

            Object.keys(fields).forEach((key) => {
                const field = fields[key];
                if (field) {
                    field.classList.remove("is-invalid");
                    if (!field.value.trim()) {
                        field.classList.add("is-invalid");
                        isValid = false;
                    }
                }
            });

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (fields.email && !emailPattern.test(fields.email.value.trim())) {
                fields.email.classList.add("is-invalid");
                isValid = false;
            }

            if (isValid) {
                form.submit();
            }
        });
    }

    // Scroll to Top Button with Throttling
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const toggleScrollToTopBtn = throttle(() => {
        if (scrollToTopBtn) {
            scrollToTopBtn.style.display = window.scrollY > 20 ? "block" : "none";
        }
    }, 100);

    if (scrollToTopBtn) {
        window.addEventListener("scroll", toggleScrollToTopBtn);
        toggleScrollToTopBtn(); // Initial check

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Random Video Loading with Error Handling and Optimization
    const videos = [
        "assets/videos/bgvideo0.mp4",
        "assets/videos/bgvideo1.mp4",
        "assets/videos/bgvideo2.mp4",
        "assets/videos/bgvideo3.mp4",
    ];

    const bgVideo = document.getElementById("bgVideo");
    const videoSource = document.getElementById("videoSource");

    const loadRandomVideo = () => {
        if (bgVideo && videoSource) {
            try {
                const randomVideo = videos[Math.floor(Math.random() * videos.length)];
                videoSource.src = randomVideo;
                bgVideo.load();
            } catch (error) {
                console.error("Error loading video:", error);
            }
        }
    };

    if (bgVideo) {
        bgVideo.addEventListener("canplay", () => {
            bgVideo.play();
        });
        loadRandomVideo(); // Load video on page load
    }

    // Disable F12 and Inspect Element
    const disableDevTools = () => {
        window.addEventListener("keydown", (event) => {
            if (
                event.key === "F12" ||
                (event.ctrlKey && event.shiftKey && event.key === "I")
            ) {
                event.preventDefault();
                return false;
            }
        });

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            return false;
        });
    };

    disableDevTools();
});
