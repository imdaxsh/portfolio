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

    // Create falling stars
    const fallingStarsCount = 20;
    const fallingStars = [];
    const fallingStarsGeometry = new THREE.BufferGeometry();
    const fallingStarsVertices = new Float32Array(fallingStarsCount * 3);
    for (let i = 0; i < fallingStarsCount; i++) {
        // Initialize falling star positions randomly at the right top area
        fallingStarsVertices[i * 3] = 1000 + Math.random() * 500; // x (start from right side)
        fallingStarsVertices[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
        fallingStarsVertices[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z

        // Each falling star has velocity and lifetime
        fallingStars.push({
            velocityX: -5 - Math.random() * 5, // falling right to left fast
            velocityY: -0.5 - Math.random(), // falling diagonally downwards
            velocityZ: 0,
            lifetime: 0,
            maxLifetime: 100 + Math.random() * 100,
            index: i
        });
    }
    fallingStarsGeometry.setAttribute('position', new THREE.BufferAttribute(fallingStarsVertices, 3));
    // Load texture for falling stars with tail
    const loader = new THREE.TextureLoader();
    const fallingStarTexture = loader.load('falling-star.png'); // You need to add this texture file to your project

    const fallingStarsMaterial = new THREE.PointsMaterial({ 
        map: fallingStarTexture,
        size: 0.2,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xFFFFFF
    });
    const fallingStarsPoints = new THREE.Points(fallingStarsGeometry, fallingStarsMaterial);
    scene.add(fallingStarsPoints);

    // Create metroids
    const metroidsCount = 10;
    const metroids = [];
    const metroidsGeometry = new THREE.BufferGeometry();
    const metroidsVertices = new Float32Array(metroidsCount * 3);
    for (let i = 0; i < metroidsCount; i++) {
        // Initialize metroid positions randomly at the right top area
        metroidsVertices[i * 3] = 1000 + Math.random() * 500; // x (start from right side)
        metroidsVertices[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
        metroidsVertices[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z

        // Each metroid has velocity and lifetime
        metroids.push({
            velocityX: -5 - Math.random() * 5, // moving right to left fast
            velocityY: -0.5 - Math.random(), // moving diagonally downwards
            velocityZ: 0,
            lifetime: 0,
            maxLifetime: 100 + Math.random() * 100,
            index: i
        });
    }
    metroidsGeometry.setAttribute('position', new THREE.BufferAttribute(metroidsVertices, 3));
    // Load texture for metroids with tail
    const metroidTexture = loader.load('metroid-tail.png'); // You need to add this texture file to your project

    const metroidsMaterial = new THREE.PointsMaterial({ 
        map: metroidTexture,
        size: 0.3,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xFFFFFF
    });
    const metroidsPoints = new THREE.Points(metroidsGeometry, metroidsMaterial);
    scene.add(metroidsPoints);

    // Create globe
    const globeRadius = 16; // Doubled from 8 to 16
    const globeGeometry = new THREE.BufferGeometry();
    const globeMaterial = new THREE.PointsMaterial({ 
        color: 0xFFFFFF, 
        size: 0.05, // Reduced size for smaller star-like dots
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
    let lastTime = 0;

    // Variables for cursor star gathering effect
    let cursor = { x: 0, y: 0 };
    let cursorWorldPos = new THREE.Vector3();
    const gatherRadius = 50;
    const gatherSpeed = 0.05;

    // Create cursor stars particle system
    const cursorStarsCount = 50;
    const cursorStarsGeometry = new THREE.BufferGeometry();
    const cursorStarsVertices = new Float32Array(cursorStarsCount * 3);
    const cursorStarsOffsets = [];
    for (let i = 0; i < cursorStarsCount; i++) {
        // Assign each star a random offset around the cursor within gatherRadius
        const offsetX = (Math.random() - 0.5) * gatherRadius * 2;
        const offsetY = (Math.random() - 0.5) * gatherRadius * 2;
        const offsetZ = (Math.random() - 0.5) * gatherRadius * 2;
        cursorStarsOffsets.push(new THREE.Vector3(offsetX, offsetY, offsetZ));

        // Initialize star positions randomly around origin
        cursorStarsVertices[i * 3] = offsetX;
        cursorStarsVertices[i * 3 + 1] = offsetY;
        cursorStarsVertices[i * 3 + 2] = offsetZ;
    }
    cursorStarsGeometry.setAttribute('position', new THREE.BufferAttribute(cursorStarsVertices, 3));
    const cursorStarsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.02,
        transparent: true,
        opacity: 0.9
    });
    const cursorStars = new THREE.Points(cursorStarsGeometry, cursorStarsMaterial);
    scene.add(cursorStars);

    // Listen to mouse move to update cursor position
    window.addEventListener('mousemove', (event) => {
        cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
        cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate(time = 0) {
        requestAnimationFrame(animate);
        
        const delta = time - lastTime;
        lastTime = time;
        
        // Update globe position based on scroll
        targetY = -scrollY * scrollSpeed;
        currentY += (targetY - currentY) * 0.1;
        globe.position.y = currentY;
        
        // Calculate scale factor for collapsing effect
        const maxScroll = window.innerHeight * 2; // Adjust max scroll range as needed
        let scale = 1 - Math.min(scrollY / maxScroll, 1);
        scale = Math.max(scale, 0.1); // Prevent scale from going to 0
        
        globe.scale.set(scale, scale, scale);
        
        // Rotate globe
        globe.rotation.y += 0.002;
        
        // Move stars upwards independent of scroll
        const positions = stars.geometry.attributes.position.array;

        // Convert cursor screen position to world coordinates
        cursorWorldPos.set(cursor.x, cursor.y, 0.5);
        cursorWorldPos.unproject(camera);

        // Animate cursor stars gathering around cursor
        const cursorPositions = cursorStarsGeometry.attributes.position.array;
        for (let i = 0; i < cursorPositions.length; i += 3) {
            const starPos = new THREE.Vector3(cursorPositions[i], cursorPositions[i + 1], cursorPositions[i + 2]);
            // Calculate target position as cursorWorldPos + offset
            const offset = cursorStarsOffsets[i / 3];
            const targetPos = new THREE.Vector3().addVectors(cursorWorldPos, offset);

            // Add small random movement around target position for visible effect
            const randomOffset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            targetPos.add(randomOffset);

            starPos.lerp(targetPos, gatherSpeed);
            cursorPositions[i] = starPos.x;
            cursorPositions[i + 1] = starPos.y;
            cursorPositions[i + 2] = starPos.z;
        }
        cursorStarsGeometry.attributes.position.needsUpdate = true;

        // Move main stars upwards normally
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += 0.5;
            if (positions[i] > 1000) {
                positions[i] = -1000;
            }
        }
        stars.geometry.attributes.position.needsUpdate = true;

        // Ensure stars keep moving even when globe is out of view
        stars.material.opacity = 1.0;

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
