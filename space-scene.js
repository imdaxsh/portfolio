// Enhanced Space Scene with Rotating Hemisphere and Effects
document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initSpaceScene;
    document.head.appendChild(script);
});

function initSpaceScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('globeCanvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Position camera to center the globe
    camera.position.z = 45;
    camera.position.y = 0;

    // Create space elements
    const { stars, globe, meteors } = createSpaceElements();
    scene.add(stars);
    scene.add(globe);
    scene.add(meteors);

    // Mouse movement for parallax
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate globe
        globe.rotation.y += 0.002;
        
        // Twinkle stars
        stars.children.forEach(star => {
            star.material.opacity = 0.7 + Math.random() * 0.3;
        });
        
        // Move meteors
        meteors.children.forEach(meteor => {
            meteor.position.x -= 0.5;
            meteor.position.y -= 0.3;
            if (meteor.position.x < -100) {
                meteor.position.set(
                    Math.random() * 100 + 100,
                    Math.random() * 100 - 50,
                    Math.random() * 50 - 25
                );
            }
        });
        
        // Parallax effect
        stars.position.x = mouse.x * 5;
        stars.position.y = mouse.y * 5;
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Helper functions
    function createSpaceElements() {
        // Create starfield
        const starGroup = new THREE.Group();
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true
        });
        
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            starVertices.push(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 1000
            );
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGroup.add(new THREE.Points(starGeometry, starMaterial));

        // Create full globe
        const globe = createGlobe();
        
        // Create meteors
        const meteorGroup = new THREE.Group();
        for (let i = 0; i < 5; i++) {
            const meteor = createMeteor();
            meteor.position.set(
                Math.random() * 200 - 100,
                Math.random() * 100 - 50,
                Math.random() * 50 - 25
            );
            meteorGroup.add(meteor);
        }

        return { stars: starGroup, globe, meteors: meteorGroup };
    }

    function createGlobe() {
        const radius = 16;
        const material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.2,
            transparent: true
        });

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const continentOutlines = [
            {lat: [15, 75], lng: [-170, -50]}, {lat: [-55, 15], lng: [-85, -30]},
            {lat: [-35, 35], lng: [-20, 50]}, {lat: [35, 70], lng: [-10, 60]},
            {lat: [10, 75], lng: [60, 180]}, {lat: [-45, -10], lng: [110, 155]}
        ];

        // Create full globe points
        for (let i = 0; i < 10000; i++) {
            const lat = Math.PI * (Math.random() - 0.5);
            const lng = 2 * Math.PI * Math.random();
            
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
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return new THREE.Points(geometry, material);
    }

    function createMeteor() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.7
        });
        
        const points = [];
        for (let i = 0; i < 5; i++) {
            points.push(new THREE.Vector3(i * 0.5, i * 0.3, 0));
        }
        geometry.setFromPoints(points);
        
        return new THREE.Line(geometry, material);
    }
}
