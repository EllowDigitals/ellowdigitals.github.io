document.addEventListener("DOMContentLoaded", () => {
    // Scroll Progress Bar Throttled
    const scrollProgress = document.getElementById("scrollProgress");
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

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress) {
            scrollProgress.style.width = `${(scrollTop / scrollHeight) * 100}%`;
        }
    };

    if (scrollProgress) {
        window.addEventListener("scroll", throttle(updateScrollProgress, 50));
        updateScrollProgress(); // Initialize on load
    }

    // Preloader and Content Elements
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    // Function to hide preloader
    const hidePreloader = () => {
        if (preloader && content) {
            preloader.style.transition = "opacity 0.5s ease-out";
            preloader.style.opacity = "0";  // Fade out
            setTimeout(() => {
                preloader.style.display = "none";  // Remove from view after fade out
                content.style.display = "block";  // Show content
            }, 500);  // Matches the transition duration (0.5s)
        }
    };

    // Trigger hidePreloader after 2 seconds (or adjust timing as necessary)
    setTimeout(hidePreloader, 2000);

    // Smooth Scroll Implementation
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
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
            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const message = document.getElementById("message");
            let isValid = true;

            const fields = [name, email, message];
            fields.forEach((input) => input && input.classList.remove("is-invalid"));

            if (!name?.value.trim()) {
                name?.classList.add("is-invalid");
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email?.value.trim())) {
                email?.classList.add("is-invalid");
                isValid = false;
            }

            if (!message?.value.trim()) {
                message?.classList.add("is-invalid");
                isValid = false;
            }

            if (isValid) {
                form.submit();
            }
        });
    }

    // Scroll to Top Button with Throttling
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const toggleScrollToTopBtn = () => {
        if (scrollToTopBtn) {
            scrollToTopBtn.style.display = window.scrollY > 20 ? "block" : "none";
        }
    };

    if (scrollToTopBtn) {
        window.addEventListener('scroll', throttle(toggleScrollToTopBtn, 100));
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
        "assets/videos/bgvideo3.mp4"
    ];

    const bgVideo = document.getElementById("bgVideo");
    const videoSource = document.getElementById("videoSource");

    // Function to set a random video
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

    // Optimize video loading with 'canplay' event
    if (bgVideo) {
        bgVideo.addEventListener('canplay', () => {
            bgVideo.play();
        });
        loadRandomVideo(); // Load video on page load
    }
});
