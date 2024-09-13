// assets/script.js

document.addEventListener('DOMContentLoaded', () => {
    const scrollProgress = document.getElementById('scrollProgress');

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = `${scrollPercentage}%`;
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial update to set the progress bar on page load
});
