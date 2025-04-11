// Shooting Stars Animation
function createShootingStars() {
    const container = document.querySelector('.space-background');
    const starCount = 15; // Increased from 5 to 15 for more visible shooting stars
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        
        // Start from right side (120% to ensure they start off-screen)
        star.style.left = `${120 + Math.random() * 20}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random delay and duration
        const delay = Math.random() * 10;
        const duration = 2 + Math.random() * 3;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        
        container.appendChild(star);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create shooting stars
    createShootingStars();

    // Smooth scrolling for navigation
    document.querySelectorAll('.floating-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
