// Create floating meteors (language icons)
function createMeteors() {
    const languages = [
        { name: 'JavaScript', level: 'Advanced' },
        { name: 'Python', level: 'Advanced' },
        { name: 'HTML/CSS', level: 'Expert' },
        { name: 'React', level: 'Intermediate' },
        { name: 'Node.js', level: 'Intermediate' }
    ];
    
    const space = document.querySelector('.space-background');
    const meteorCount = languages.length;
    
    for (let i = 0; i < meteorCount; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // Random starting position at edges
        const startX = Math.random() > 0.5 ? -50 : 110;
        const startY = Math.random() * 100;
        
        // Random ending position
        const endX = Math.random() * 100;
        const endY = Math.random() * 100;
        
        // Random size (20-40px)
        const size = Math.random() * 20 + 20;
        
        // Random animation duration (20-40s)
        const duration = Math.random() * 20 + 20;
        
        meteor.style.left = `${startX}%`;
        meteor.style.top = `${startY}%`;
        meteor.style.width = `${size}px`;
        meteor.style.height = `${size}px`;
        meteor.style.background = 'white';
        meteor.style.borderRadius = '50%';
        meteor.style.position = 'absolute';
        
        // Create animation
        const animation = meteor.animate(
            [
                { left: `${startX}%`, top: `${startY}%`, opacity: 0 },
                { left: `${endX}%`, top: `${endY}%`, opacity: 1 }
            ],
            {
                duration: duration * 1000,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'linear'
            }
        );
        
        // Add hover effect
        meteor.addEventListener('mouseenter', () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'meteor-tooltip';
            tooltip.innerHTML = `
                <strong>${languages[i].name}</strong>
                <br>
                ${languages[i].level}
            `;
            meteor.appendChild(tooltip);
        });
        
        meteor.addEventListener('mouseleave', () => {
            const tooltip = meteor.querySelector('.meteor-tooltip');
            if (tooltip) {
                meteor.removeChild(tooltip);
            }
        });
        
        space.appendChild(meteor);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createMeteors();
    
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
