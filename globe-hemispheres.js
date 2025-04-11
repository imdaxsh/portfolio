// Three.js Dual Hemisphere Scroll Animation
document.addEventListener('DOMContentLoaded', () => {
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

    // Create starfield background
    const stars = createStarfield();
    scene.add(stars);

    // Create hemispheres
    const { upperHemisphere, lowerHemisphere } = createHemispheres();
    scene.add(upperHemisphere);
    scene.add(lowerHemisphere);

    // Camera position
    camera.position.z = 35;

    // Scroll tracking
    let scrollY = 0;
    let maxScroll = document.body.scrollHeight - window.innerHeight;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const scrollProgress = Math.min(1, scrollY / (maxScroll * 0.5));
        
        // Animate hemispheres
        upperHemisphere.position.y = -scrollProgress * 16;
        lowerHemisphere.position.y = -32 + (scrollProgress * 16);
        
        // Rotate both hemispheres
        upperHemisphere.rotation.y += 0.002;
        lowerHemisphere.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        maxScroll = document.body.scrollHeight - window.innerHeight;
    });

    // Helper functions
    function createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.05 });
        const vertices = [];
        
        for (let i = 0; i < 5000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000,
                (Math.random() - 0.5) * 2000
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return new THREE.Points(geometry, material);
    }

    function createHemispheres() {
        const radius = 16;
        const material = new THREE.PointsMaterial({ 
            color: 0xFFFFFF, 
            size: 0.2,
            transparent: true
        });

        // Create upper hemisphere
        const upperGeometry = new THREE.BufferGeometry();
        upperGeometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(createHemisphereVertices(radius, true), 3));
        const upperHemisphere = new THREE.Points(upperGeometry, material);
        upperHemisphere.position.y = 0;

        // Create lower hemisphere
        const lowerGeometry = new THREE.BufferGeometry();
        lowerGeometry.setAttribute('position',
            new THREE.Float32BufferAttribute(createHemisphereVertices(radius, false), 3));
        const lowerHemisphere = new THREE.Points(lowerGeometry, material);
        lowerHemisphere.position.y = -radius * 2;

        return { upperHemisphere, lowerHemisphere };
    }

    function createHemisphereVertices(radius, isUpper) {
        const vertices = [];
        const continentOutlines = [
            {lat: [15, 75], lng: [-170, -50]}, {lat: [-55, 15], lng: [-85, -30]},
            {lat: [-35, 35], lng: [-20, 50]}, {lat: [35, 70], lng: [-10, 60]},
            {lat: [10, 75], lng: [60, 180]}, {lat: [-45, -10], lng: [110, 155]}
        ];

        for (let i = 0; i < 5000; i++) {
            const lat = Math.PI * (Math.random() - (isUpper ? 0.5 : 0));
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
                const x = radius * Math.cos(lat) * Math.cos(lng);
                const y = radius * Math.sin(lat);
                const z = radius * Math.cos(lat) * Math.sin(lng);
                vertices.push(x, y, z);
            }
        }
        return vertices;
    }
}
