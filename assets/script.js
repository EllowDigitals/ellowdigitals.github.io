document.addEventListener("DOMContentLoaded", () => {
    // Handle Scroll Progress
    const scrollProgress = document.getElementById("scrollProgress");
    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = `${(scrollTop / scrollHeight) * 100}%`;
    };
    window.addEventListener("scroll", updateScrollProgress);
    updateScrollProgress();

    // Handle Preloader
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");
    setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.transition = "opacity 0.5s ease-out";
        setTimeout(() => {
            preloader.style.display = "none";
            content.style.display = "block";
        }, 500); // Matches the transition duration
    }, 3000); // Adjust time as needed

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
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
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    });

    // Form Validation
    const form = document.getElementById("contactForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const message = document.getElementById("message");
        let isValid = true;

        // Clear previous error messages
        form.querySelectorAll(".form-control").forEach((input) => {
            input.classList.remove("is-invalid");
        });

        // Name Validation
        if (name.value.trim() === "") {
            name.classList.add("is-invalid");
            isValid = false;
        }

        // Email Validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            email.classList.add("is-invalid");
            isValid = false;
        }

        // Message Validation
        if (message.value.trim() === "") {
            message.classList.add("is-invalid");
            isValid = false;
        }

        // If Form is Valid, Submit
        if (isValid) {
            form.submit();
        }
    });

    // Show the button when the user scrolls down
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const handleScroll = () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check to display/hide button based on current scroll position
});

// Scroll to the top of the page when the button is clicked
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
