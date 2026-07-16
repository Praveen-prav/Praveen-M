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
        particleCount: 200,        // Number of floating particles
        particleColor: 0x64ffda,   // Color of floating particles
        asteroidCount: 12,          // Number of floating asteroids
        asteroidColor: 0x374151,   // Basalt gray for rocks
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

    // ─── Lights ────────────────────────────────────────────────────────────────
    // Add ambient and directional lights so solid-shaded materials render with 3D depth
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.95);
    directionalLight.position.set(20, 40, 30);
    scene.add(directionalLight);

    // Cache vertex array for faster wave computation
    const posAttribute = geometry.attributes.position;
    const initialPositions = new Float32Array(posAttribute.array);
    const count = posAttribute.count;

    // Helper to create circular glowing particle texture
    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(8, 8, 8, 0, Math.PI * 2);
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    }

    // ─── Create Floating Particles ─────────────────────────────────────────────
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(CONFIG.particleCount * 3);

    for (let i = 0; i < CONFIG.particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 220;      // X
        particlePositions[i + 1] = (Math.random() - 0.2) * 80;    // Y
        particlePositions[i + 2] = (Math.random() - 0.5) * 220;    // Z
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: CONFIG.particleColor,
        size: 1.8,
        map: createCircleTexture(),
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ─── Create Spaceship ──────────────────────────────────────────────────────
    const spaceship = new THREE.Group();

    // ─── Materials ─────────────────────────────────────────────────────────────
    const fusMat = new THREE.MeshPhongMaterial({
        color: 0xd1d5db, // Sleek metallic silver body
        shininess: 60
    });

    const wingMat = new THREE.MeshPhongMaterial({
        color: 0x334155, // Dark carbon-gray wings
        shininess: 30,
        side: THREE.DoubleSide
    });

    const cockpitMat = new THREE.MeshPhongMaterial({
        color: 0x64ffda, // Accent glassy teal canopy
        shininess: 120,
        transparent: true,
        opacity: 0.75,
        specular: 0xffffff
    });

    const asteroidMat = new THREE.MeshPhongMaterial({
        color: CONFIG.asteroidColor,
        shininess: 8,
        flatShading: true // Low-poly faceted appearance
    });

    // ─── Color Schemes ─────────────────────────────────────────────────────────
    const COLOR_SCHEMES = [
        {
            fus: 0xd1d5db, wings: 0x334155, cockpit: 0x64ffda, rock: 0x374151,
            webAccent: '#64ffda',
            webBg: '#0d1117',
            webGrad1: 'radial-gradient(ellipse 120% 60% at 50% 0%, hsla(225, 45%, 18%, 0.9) 0%, transparent 70%)',
            webGrad2: 'radial-gradient(ellipse 60% 50% at 15% 100%, hsla(253, 30%, 14%, 0.6) 0%, transparent 70%)',
            webGrad3: 'radial-gradient(ellipse 50% 40% at 85% 90%, hsla(280, 25%, 12%, 0.5) 0%, transparent 70%)'
        }, // 1. Silver & Teal (Default gray rocks)
        {
            fus: 0x1e293b, wings: 0xd97706, cockpit: 0xef4444, rock: 0x451a03,
            webAccent: '#ef4444',
            webBg: '#0f0d11',
            webGrad1: 'radial-gradient(ellipse 120% 60% at 50% 0%, hsla(15, 55%, 16%, 0.95) 0%, transparent 70%)',
            webGrad2: 'radial-gradient(ellipse 60% 50% at 15% 100%, hsla(350, 45%, 12%, 0.7) 0%, transparent 70%)',
            webGrad3: 'radial-gradient(ellipse 50% 40% at 85% 90%, hsla(25, 40%, 10%, 0.6) 0%, transparent 70%)'
        }, // 2. Dark Slate & Amber (Fiery rust rocks)
        {
            fus: 0x3b0764, wings: 0x4f46e5, cockpit: 0xdb2777, rock: 0x2e1065,
            webAccent: '#db2777',
            webBg: '#0c0714',
            webGrad1: 'radial-gradient(ellipse 120% 60% at 50% 0%, hsla(275, 50%, 16%, 0.95) 0%, transparent 70%)',
            webGrad2: 'radial-gradient(ellipse 60% 50% at 15% 100%, hsla(235, 40%, 14%, 0.7) 0%, transparent 70%)',
            webGrad3: 'radial-gradient(ellipse 50% 40% at 85% 90%, hsla(310, 45%, 12%, 0.6) 0%, transparent 70%)'
        }, // 3. Violet & Indigo (Purple space rocks)
        {
            fus: 0x064e3b, wings: 0x059669, cockpit: 0x34d399, rock: 0x022c22,
            webAccent: '#34d399',
            webBg: '#060d0a',
            webGrad1: 'radial-gradient(ellipse 120% 60% at 50% 0%, hsla(160, 45%, 14%, 0.95) 0%, transparent 70%)',
            webGrad2: 'radial-gradient(ellipse 60% 50% at 15% 100%, hsla(140, 35%, 10%, 0.7) 0%, transparent 70%)',
            webGrad3: 'radial-gradient(ellipse 50% 40% at 85% 90%, hsla(180, 30%, 10%, 0.6) 0%, transparent 70%)'
        }, // 4. Emerald & Mint (Deep jade rocks)
        {
            fus: 0x0f172a, wings: 0x0891b2, cockpit: 0xea580c, rock: 0x1e293b,
            webAccent: '#ea580c',
            webBg: '#060b13',
            webGrad1: 'radial-gradient(ellipse 120% 60% at 50% 0%, hsla(205, 55%, 14%, 0.95) 0%, transparent 70%)',
            webGrad2: 'radial-gradient(ellipse 60% 50% at 15% 100%, hsla(220, 45%, 10%, 0.7) 0%, transparent 70%)',
            webGrad3: 'radial-gradient(ellipse 50% 40% at 85% 90%, hsla(250, 40%, 10%, 0.6) 0%, transparent 70%)'
        }, // 5. Cyberpunk Orange & Cyan (Slate gray rocks)
    ];
    let currentSchemeIndex = 0;

    function applyColorScheme(index) {
        const scheme = COLOR_SCHEMES[index];
        fusMat.color.setHex(scheme.fus);
        wingMat.color.setHex(scheme.wings);
        cockpitMat.color.setHex(scheme.cockpit);
        asteroidMat.color.setHex(scheme.rock); // Change asteroid colors in sync

        // Update Three.js environment colors
        material.color.setHex(scheme.cockpit);        // Wave grid color
        particleMaterial.color.setHex(scheme.cockpit); // Particles color

        // Update CSS variables for website theme
        document.documentElement.style.setProperty('--accent-color', scheme.webAccent);
        document.documentElement.style.setProperty('--bg-base', scheme.webBg);
        document.documentElement.style.setProperty('--bg-grad-1', scheme.webGrad1);
        document.documentElement.style.setProperty('--bg-grad-2', scheme.webGrad2);
        document.documentElement.style.setProperty('--bg-grad-3', scheme.webGrad3);
    }

    // ─── Spaceship Parts Construction ─────────────────────────────────────────

    // Fuselage body (cylinder along Z-axis)
    const fusGeom = new THREE.CylinderGeometry(0.8, 0.5, 4.5, 8);
    fusGeom.rotateX(Math.PI / 2);
    const fuselage = new THREE.Mesh(fusGeom, fusMat);
    fuselage.position.z = -1.5;
    spaceship.add(fuselage);

    // Nose cone (solid metallic cone at the front)
    const noseGeom = new THREE.ConeGeometry(0.8, 2.5, 8);
    noseGeom.rotateX(Math.PI / 2);
    const noseCone = new THREE.Mesh(noseGeom, fusMat);
    noseCone.position.z = 2.0;
    spaceship.add(noseCone);

    // Pilot Cockpit Canopy (glass bubble on top of the fuselage)
    const cockpitGeom = new THREE.SphereGeometry(0.6, 16, 16);
    cockpitGeom.scale(1, 0.65, 1.8); // Sleek capsule shell
    const cockpitBubble = new THREE.Mesh(cockpitGeom, cockpitMat);
    cockpitBubble.position.set(0, 0.6, 0.2); // Positioned on top of the fuselage body
    spaceship.add(cockpitBubble);

    // Back-swept Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(-5, -0.8);
    wingShape.lineTo(-4, -3);
    wingShape.lineTo(0, -1.5);

    const extrudeSettings = { depth: 0.05, bevelEnabled: false };
    const wingGeom = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    wingGeom.rotateX(Math.PI / 2);
    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    spaceship.add(leftWing);

    const rightWing = leftWing.clone();
    rightWing.scale.x = -1;
    spaceship.add(rightWing);

    // Thruster engine flame (points along -Z)
    const flameGeom = new THREE.ConeGeometry(0.4, 2.5, 5);
    flameGeom.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
        color: 0xff4500, // Glowing engine plume
        transparent: true,
        opacity: 0.95
    });
    const flame = new THREE.Mesh(flameGeom, flameMat);
    flame.position.set(0, 0, -4.2);
    spaceship.add(flame);

    // Scaled down slightly to look distant
    spaceship.scale.set(0.8, 0.8, 0.8);
    scene.add(spaceship);

    // ─── Create Asteroids ──────────────────────────────────────────────────────
    // Helper to generate bumpy, irregular asteroid geometries
    function createAsteroidGeometry(radius, detail) {
        const geom = new THREE.DodecahedronGeometry(radius, detail);
        const pos = geom.attributes.position;
        const tempPos = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            tempPos.fromBufferAttribute(pos, i);
            // Apply unique noise scale along vertex normals
            const noise = 1.0 + (Math.random() - 0.5) * 0.4;
            tempPos.multiplyScalar(noise);
            pos.setXYZ(i, tempPos.x, tempPos.y, tempPos.z);
        }
        geom.computeVertexNormals();
        return geom;
    }

    const asteroids = [];
    const asteroidGroup = new THREE.Group();

    for (let i = 0; i < CONFIG.asteroidCount; i++) {
        const radius = 1.2 + Math.random() * 2.8;
        const geom = createAsteroidGeometry(radius, 1);
        const rock = new THREE.Mesh(geom, asteroidMat);

        // Position them in a wide envelope above the wave grid
        rock.position.set(
            (Math.random() - 0.5) * 180,
            Math.random() * 20 + 4,
            (Math.random() - 0.5) * 180
        );

        // Random starting rotations
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        // Store tumbling and drifting speed rates
        rock.userData = {
            rotX: (Math.random() - 0.5) * 0.015,
            rotY: (Math.random() - 0.5) * 0.015,
            rotZ: (Math.random() - 0.5) * 0.015,
            driftSpeed: 0.03 + Math.random() * 0.06,
            driftDirection: (Math.random() > 0.5 ? 1 : -1)
        };

        asteroidGroup.add(rock);
        asteroids.push(rock);
    }
    scene.add(asteroidGroup);

    // ─── Create Time Vortex Tunnel ─────────────────────────────────────────────
    const tunnelGeom = new THREE.CylinderGeometry(45, 45, 320, 24, 40, true);
    tunnelGeom.rotateX(Math.PI / 2); // Align with Z-axis (surround camera)
    const tunnelMat = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        wireframe: true,
        transparent: true,
        opacity: 0.0, // Hidden by default, fades in on scroll speed
        side: THREE.BackSide
    });
    const tunnel = new THREE.Mesh(tunnelGeom, tunnelMat);
    scene.add(tunnel);

    // ─── Interaction Variables ──────────────────────────────────────────────────
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;
    let scrollSpeed = 0;
    let targetScrollSpeed = 0;
    let lastScrollTop = 0;
    let lastScrollTime = Date.now();
    const clock = new THREE.Clock();

    // Time Travel State
    let timeTravelActive = false;
    let timeTravelStartTime = 0;
    let timeTravelDuration = 1200; // 1.2s warp transit duration
    let schemeChangedThisTransit = false; // Track if color changed in the current jump

    window.triggerTimeTravel = function (duration = 1200) {
        timeTravelActive = true;
        timeTravelStartTime = Date.now();
        timeTravelDuration = duration;
        schemeChangedThisTransit = false; // Reset for the new jump
    };

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
        const now = Date.now();
        const dt = Math.max((now - lastScrollTime) / 1000, 0.001); // in seconds

        // Calculate scroll speed (velocity)
        const deltaY = Math.abs(scrollTop - lastScrollTop);
        targetScrollSpeed = Math.min(deltaY / dt / 1500, 4.0); // cap speed factor

        lastScrollTop = scrollTop;
        lastScrollTime = now;

        // Normal scroll progress (0 to 1)
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

        // Smoothly decay scroll speed
        scrollSpeed += (targetScrollSpeed - scrollSpeed) * 0.08;
        targetScrollSpeed += (0 - targetScrollSpeed) * 0.12;

        // Calculate time travel boost
        let timeTravelWarp = 0;
        if (timeTravelActive) {
            const elapsed = Date.now() - timeTravelStartTime;
            if (elapsed < timeTravelDuration) {
                const progress = elapsed / timeTravelDuration;
                // Sinusoidal curve peaking in the middle (reaches 3.0 at peak)
                timeTravelWarp = Math.sin(progress * Math.PI) * 3.2;

                // Color shift at the peak of the wormhole (progress >= 0.5)
                if (progress >= 0.5 && !schemeChangedThisTransit) {
                    currentSchemeIndex = (currentSchemeIndex + 1) % COLOR_SCHEMES.length;
                    applyColorScheme(currentSchemeIndex);
                    schemeChangedThisTransit = true;
                }
            } else {
                timeTravelActive = false;
            }
        }

        // Combine normal scrolling speed with time travel warp boost
        const warpSpeed = Math.max(scrollSpeed, timeTravelWarp);

        // Position camera: subtle tilt/drift based on mouse and scroll
        camera.position.x = mouse.x * 12;
        camera.position.y = 16 - (mouse.y * 6);
        // Slightly move camera back on scroll to show more mesh
        camera.position.z = 75 + (scrollY * 15);
        camera.lookAt(0, -2, 0);

        // Dynamically adjust FOV (spacetime warp zoom effect)
        camera.fov = 55 + (warpSpeed * 18);
        camera.updateProjectionMatrix();

        // 2. Rotate the mesh slowly over time and offset by scroll position
        plane.rotation.z = time * 0.015 + (scrollY * 0.25);

        // 2b. Animate particles (drift and float upwards, warp speed on Z when scrolling/time traveling)
        const partPositions = particles.geometry.attributes.position.array;
        for (let i = 0; i < CONFIG.particleCount; i++) {
            // Particles rush towards the camera along Z axis during warp
            partPositions[i * 3 + 2] += 0.08 + (warpSpeed * 2.8);

            // Standard upward drift and sway
            partPositions[i * 3 + 1] += 0.03;
            partPositions[i * 3] += Math.sin(time * 0.5 + i) * 0.015;

            // Wrap particles around when they pass behind the camera (Z > 90) or out of bounds
            if (partPositions[i * 3 + 2] > 90 || partPositions[i * 3 + 1] > 60) {
                partPositions[i * 3 + 2] = -120;
                partPositions[i * 3] = (Math.random() - 0.5) * 220;
                partPositions[i * 3 + 1] = (Math.random() - 0.2) * 80 - 20;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // 2c. Animate spaceship trajectory (Lissajous orbit)
        const flightTime = time * 0.12;
        const px = Math.sin(flightTime * 2) * 55;
        const py = Math.sin(flightTime) * 10 + 8; // Float above the grid
        const pz = Math.cos(flightTime * 1.5) * 45 - 5;
        spaceship.position.set(px, py, pz);

        // Calculate heading to face movement direction
        const nextTime = flightTime + 0.01;
        const npx = Math.sin(nextTime * 2) * 55;
        const npy = Math.sin(nextTime) * 10 + 8;
        const npz = Math.cos(nextTime * 1.5) * 45 - 5;
        spaceship.lookAt(npx, npy, npz);

        // Calculate banking (roll) based on horizontal turn rate
        const headingCurrent = Math.atan2(npx - px, npz - pz);
        const nextTime2 = nextTime + 0.01;
        const nnpx = Math.sin(nextTime2 * 2) * 55;
        const nnpz = Math.cos(nextTime2 * 1.5) * 45 - 5;
        const headingNext = Math.atan2(nnpx - npx, nnpz - npz);

        let turnRate = headingNext - headingCurrent;
        if (turnRate > Math.PI) turnRate -= Math.PI * 2;
        if (turnRate < -Math.PI) turnRate += Math.PI * 2;

        // Apply dynamic banking roll + subtle flight turbulence wobble
        const bankAngle = turnRate * 35;
        const turbulence = Math.sin(time * 3.5) * 0.04;
        spaceship.rotateZ(bankAngle + turbulence);

        // Add a tiny pitching wobble for organic flight feel
        spaceship.rotateX(Math.cos(time * 2.0) * 0.02);

        // Rapid engine exhaust flicker + thruster trail stretch during warp
        flame.scale.z = (0.85 + Math.sin(time * 35) * 0.25) * (1.0 + warpSpeed * 1.8);

        // 2d. Animate asteroids (slow tumbling and drift, accelerated on warp)
        asteroids.forEach(rock => {
            rock.rotation.x += rock.userData.rotX;
            rock.rotation.y += rock.userData.rotY;
            rock.rotation.z += rock.userData.rotZ;

            // Speed up drift rate during scroll speed surges
            rock.position.z += (rock.userData.driftSpeed + (warpSpeed * 1.2)) * rock.userData.driftDirection;

            // Wrap boundaries so rocks recycle infinitely
            if (rock.position.z > 110) {
                rock.position.z = -110;
                rock.position.x = (Math.random() - 0.5) * 180;
                rock.position.y = Math.random() * 20 + 4;
            } else if (rock.position.z < -110) {
                rock.position.z = 110;
                rock.position.x = (Math.random() - 0.5) * 180;
                rock.position.y = Math.random() * 20 + 4;
            }
        });

        // 2e. Animate Time Vortex (swirl, fade in, and color shift on scroll speed)
        tunnel.rotation.z = time * 0.15 + (warpSpeed * 2.5);

        // Fades in proportional to scroll speed
        tunnelMat.opacity = Math.min(warpSpeed * 0.22, 0.25);

        // Shift colors (Teal -> Blue -> Violet) as speed increases
        const hue = 0.48 + (warpSpeed * 0.08) % 1.0;
        tunnelMat.color.setHSL(hue, 0.9, 0.6);

        // Fade out the main flat mesh grid slightly during time travel to emphasize the tunnel
        plane.material.opacity = CONFIG.opacity * (1.0 - Math.min(warpSpeed * 0.7, 0.6));

        // Slightly increase fog density during time travel to enhance depth
        scene.fog.density = CONFIG.fogDensity + (warpSpeed * 0.0035);

        // 3. Animate vertices using multiple superimposed sine waves (faster churning on warp)
        const waveSpeed = time * 0.8 + (warpSpeed * 3.2);
        const waveAmplitude = 3.5 + (warpSpeed * 1.8);
        const posArray = posAttribute.array;
        for (let i = 0; i < count; i++) {
            // Get original grid X and Y coordinates (from cached array)
            const x = initialPositions[i * 3];
            const y = initialPositions[i * 3 + 1];

            // Wave height formula (combines time, space, and a bit of noise)
            const z = Math.sin(x * 0.045 + waveSpeed) * Math.cos(y * 0.045 + waveSpeed) * waveAmplitude +
                Math.sin(x * 0.09 - waveSpeed * 1.5) * 1.2 +
                Math.cos(y * 0.07 + waveSpeed * 0.8) * 1.5;

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
