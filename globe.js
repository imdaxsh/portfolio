// Three.js Globe with White Dots
document.addEventListener('DOMContentLoaded', () => {
    // Load Three.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initGlobe;
    document.head.appendChild(script);
});

function initGlobe() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('globeCanvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true
    });

    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create globe with dots
    const globeRadius = 5;
    const dotGeometry = new THREE.BufferGeometry();
    const dotMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });

    // Create dots for globe surface (simplified version)
    const dotVertices = [];
    const dotCount = 10000;

    for (let i = 0; i < dotCount; i++) {
        const lat = Math.PI * (Math.random() - 0.5);
        const lng = 2 * Math.PI * Math.random();
        const x = globeRadius * Math.cos(lat) * Math.cos(lng);
        const y = globeRadius * Math.sin(lat);
        const z = globeRadius * Math.cos(lat) * Math.sin(lng);
        dotVertices.push(x, y, z);
    }

    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotVertices, 3));
    const globe = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(globe);

    // Position camera
    camera.position.z = 15;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
