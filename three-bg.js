/**
 * Three.js Infinite Mesh Background
 * Animated, interactive 3D wave grid responsive to mouse and scroll.
 */

(function () {
    // ─── Configuration ─────────────────────────────────────────────────────────
    const CONFIG = {
        meshColor: 0x64ffda,       // Accent Teal color
        bgColor: 0x0d1117,         // Base dark background
        opacity: 0.15,             // Mesh line opacity
        segments: 60,              // Grid resolution (density of segments)
        size: 300,                 // Dimension of the grid plane
        baseY: -12,                // Y position of the grid relative to camera
        fogDensity: 0.0085,        // Fog density for horizon fade (infinite effect)
    };

    // ─── Setup WebGL Environment ────────────────────────────────────────────────
    const canvas = document.getElementById('three-bg');
    if (!canvas) return;

    const scene = new THREE.Scene();
    
    // Enable fog to create the "infinite" fade-to-horizon look
    scene.fog = new THREE.FogExp2(CONFIG.bgColor, CONFIG.fogDensity);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 16, 75);
    camera.lookAt(0, 0, 0);

    // Renderer setup (alpha: true to show CSS background gradients)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ─── Create the Mesh Grid ──────────────────────────────────────────────────
    // Create a flat horizontal plane geometry
    const geometry = new THREE.PlaneGeometry(
        CONFIG.size,
        CONFIG.size,
        CONFIG.segments,
        CONFIG.segments
    );

    // Material with wireframe mode enabled
    const material = new THREE.MeshBasicMaterial({
        color: CONFIG.meshColor,
        wireframe: true,
        transparent: true,
        opacity: CONFIG.opacity,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Lay flat
    plane.position.y = CONFIG.baseY;
    scene.add(plane);

    // Cache vertex array for faster wave computation
    const posAttribute = geometry.attributes.position;
    const initialPositions = new Float32Array(posAttribute.array);
    const count = posAttribute.count;

    // ─── Interaction Variables ──────────────────────────────────────────────────
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    const clock = new THREE.Clock();

    // Mouse movement listener (parallax depth effect)
    document.addEventListener('mousemove', (e) => {
        mouse.targetX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouse.targetY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    // Scroll listener (both window and local .info-container scrolling)
    const infoContainer = document.querySelector('.info-container');
    const scrollTarget = infoContainer || window;
    
    function handleScroll() {
        const scrollTop = infoContainer ? infoContainer.scrollTop : window.scrollY;
        const scrollHeight = infoContainer 
            ? (infoContainer.scrollHeight - infoContainer.clientHeight)
            : (document.documentElement.scrollHeight - window.innerHeight);
        
        scrollY = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    }
    
    if (infoContainer) {
        infoContainer.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll);

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // ─── Animation Loop ────────────────────────────────────────────────────────
    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // 1. Interpolate mouse positions for smooth camera tracking (lerp)
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Position camera: subtle tilt/drift based on mouse and scroll
        camera.position.x = mouse.x * 12;
        camera.position.y = 16 - (mouse.y * 6);
        // Slightly move camera back on scroll to show more mesh
        camera.position.z = 75 + (scrollY * 15);
        camera.lookAt(0, -2, 0);

        // 2. Rotate the mesh slowly over time and offset by scroll position
        plane.rotation.z = time * 0.015 + (scrollY * 0.25);

        // 3. Animate vertices using multiple superimposed sine waves
        const posArray = posAttribute.array;
        for (let i = 0; i < count; i++) {
            // Get original grid X and Y coordinates (from cached array)
            const x = initialPositions[i * 3];
            const y = initialPositions[i * 3 + 1];

            // Wave height formula (combines time, space, and a bit of noise)
            const z = Math.sin(x * 0.045 + time * 0.8) * Math.cos(y * 0.045 + time * 0.8) * 3.5 +
                      Math.sin(x * 0.09 - time * 1.2) * 1.2 +
                      Math.cos(y * 0.07 + time * 0.6) * 1.5;

            // Apply calculated height to the Z axis
            posArray[i * 3 + 2] = z;
        }

        // Notify Three.js that geometry vertices have changed
        posAttribute.needsUpdate = true;

        renderer.render(scene, camera);
    }

    // Start simulation
    animate();
})();
