// ==========================================================================
// Main Interactivity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize fade-in animations
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    // Simple delay to let the initial page render before animating
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 2. Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Optional: Add intersection observer for scroll animations on other sections
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Example of adding class to elements to be animated on scroll
    const socialCards = document.querySelectorAll('.social-card');
    const qrCard = document.querySelector('.qr-card');
    
    socialCards.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    if (qrCard) {
        qrCard.classList.add('fade-in-up');
        qrCard.style.transitionDelay = '0.3s';
        observer.observe(qrCard);
    }
});
