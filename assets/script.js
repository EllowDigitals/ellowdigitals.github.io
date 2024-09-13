document.addEventListener("DOMContentLoaded", () => {
    // Handle Scroll Progress
    const scrollProgress = document.getElementById("scrollProgress");

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
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
});
