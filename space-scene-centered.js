// Original Space Scene with Just Globe and Stars
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

    // Camera position
    camera.position.z = 90;
    camera.position.y = -10;

    // Create elements
    const { stars, globe } = createSpaceElements();
    scene.add(stars);
    globe.position.y = -5;
    scene.add(globe);

    // Mouse movement
    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.002;
        stars.children.forEach(star => {
            star.material.opacity = 0.7 + Math.random() * 0.3;
        });
        stars.position.x = mouse.x * 5;
        stars.position.y = mouse.y * 5;
        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function createSpaceElements() {
        // Starfield
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

        // Globe
        const globe = createGlobe();
        return { stars: starGroup, globe };
    }

    function createGlobe() {
        const radius = 48;
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
}
