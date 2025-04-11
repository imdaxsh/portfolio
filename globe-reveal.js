// Three.js Single Globe with Scroll Reveal Animation
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

    // Create enhanced space background
    const spaceBackground = createSpaceBackground();
    scene.add(spaceBackground);

    // Create single globe
    const globe = createGlobe();
    scene.add(globe);

    // Set initial camera position
    camera.position.z = 35;
    camera.position.y = -10; // Lower the camera to position globe at bottom

    // Create clipping plane to hide upper half initially (inverse of before)
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    renderer.localClippingEnabled = true;
    globe.material.clippingPlanes = [clipPlane];

    // Scroll tracking
    let scrollY = 0;
    let maxScroll = document.body.scrollHeight - window.innerHeight;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Calculate scroll progress (0 to 1)
        const scrollProgress = Math.min(1, scrollY / (maxScroll * 0.5));
        
        // Adjust clipping plane to reveal more of the globe from bottom
        clipPlane.constant = -16 + (scrollProgress * 16);
        
        // Keep globe positioned at bottom
        globe.position.y = -10;
        
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
        maxScroll = document.body.scrollHeight - window.innerHeight;
    });

    // Helper functions
    function createSpaceBackground() {
        // Create starfield
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ 
            color: 0xFFFFFF, 
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            starVertices.push(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);

        // Create subtle nebula effect
        const nebulaGeometry = new THREE.SphereGeometry(1500, 32, 32);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
            color: 0x1a2a6c,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);

        // Group both elements
        const background = new THREE.Group();
        background.add(stars);
        background.add(nebula);
        
        return background;
    }

    function createGlobe() {
        const radius = 16;
        const material = new THREE.PointsMaterial({ 
            color: 0xFFFFFF, 
            size: 0.2,
            transparent: true
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(createGlobeVertices(radius), 3));
        return new THREE.Points(geometry, material);
    }

    function createGlobeVertices(radius) {
        const vertices = [];
        const continentOutlines = [
            {lat: [15, 75], lng: [-170, -50]}, {lat: [-55, 15], lng: [-85, -30]},
            {lat: [-35, 35], lng: [-20, 50]}, {lat: [35, 70], lng: [-10, 60]},
            {lat: [10, 75], lng: [60, 180]}, {lat: [-45, -10], lng: [110, 155]}
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
                const x = radius * Math.cos(lat) * Math.cos(lng);
                const y = radius * Math.sin(lat);
                const z = radius * Math.cos(lat) * Math.sin(lng);
                vertices.push(x, y, z);
            }
        }
        return vertices;
    }
}
