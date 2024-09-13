
document.addEventListener("DOMContentLoaded", () => {
    // Handle Scroll Progress
    const scrollProgress = document.getElementById("scrollProgress");

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = `${scrollPercentage}%`;
    };

    // Update scroll progress on scroll
    window.addEventListener("scroll", updateScrollProgress);
    // Initial update for when the page loads
    updateScrollProgress();

    // Handle Preloader
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    // Simulate loading time
    setTimeout(() => {
        preloader.style.opacity = "0";
        preloader.style.transition = "opacity 0.5s ease-out";
        setTimeout(() => {
            preloader.style.display = "none";
            content.style.display = "block";
        }, 500); // Matches the transition duration
    }, 3000); // Adjust time as needed

    // Smooth scroll for "Discover More" and "scroll-down" buttons
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Adjust header appearance on scroll (example)
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
