// Three.js Globe with Scroll-Linked Movement
document.addEventListener('DOMContentLoaded', () => {
    // Load Three.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initGlobe;
    document.head.appendChild(script);
});

function initGlobe() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('globeCanvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create starfield
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.05 });
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        starsVertices.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create globe
    const globeRadius = 16; // Doubled from 8 to 16
    const globeGeometry = new THREE.BufferGeometry();
    const globeMaterial = new THREE.PointsMaterial({ 
        color: 0xFFFFFF, 
        size: 0.2, // Increased from 0.1 to 0.2 for better visibility
        transparent: true
    });
    const globeVertices = [];
    
    // Add continent outlines
    const continentOutlines = [
        {lat: [15, 75], lng: [-170, -50]}, // NA
        {lat: [-55, 15], lng: [-85, -30]}, // SA
        {lat: [-35, 35], lng: [-20, 50]},  // Africa
        {lat: [35, 70], lng: [-10, 60]},   // Europe
        {lat: [10, 75], lng: [60, 180]},   // Asia
        {lat: [-45, -10], lng: [110, 155]} // Australia
    ];

    for (let i = 0; i < 10000; i++) {
        const lat = Math.PI * (Math.random() - 0.5);
        const lng = 2 * Math.PI * Math.random();
        
        // Check if in continent
        let inContinent = false;
        const latDeg = (lat * 180/Math.PI + 90);
        const lngDeg = (lng * 180/Math.PI - 180);
        
        for (const c of continentOutlines) {
            if (latDeg >= c.lat[0] && latDeg <= c.lat[1] &&
                lngDeg >= c.lng[0] && lngDeg <= c.lng[1]) {
                inContinent = true;
                break;
            }
        }
        
        if (inContinent || Math.random() > 0.7) {
            const x = globeRadius * Math.cos(lat) * Math.cos(lng);
            const y = globeRadius * Math.sin(lat);
            const z = globeRadius * Math.cos(lat) * Math.sin(lng);
            globeVertices.push(x, y, z);
        }
    }

    globeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(globeVertices, 3));
    const globe = new THREE.Points(globeGeometry, globeMaterial);
    scene.add(globe);

    // Set initial camera position
    camera.position.z = 35; // Increased from 20 to 35 to accommodate doubled globe size

    // Scroll tracking
    let scrollY = window.scrollY;
    let targetY = 0;
    let currentY = 0;
    const scrollSpeed = 0.1;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update globe position based on scroll
        targetY = -scrollY * scrollSpeed;
        currentY += (targetY - currentY) * 0.1;
        globe.position.y = currentY;
        
        // Rotate globe
        globe.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
