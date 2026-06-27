/* -------------------------------------------------------------
   Apex Scholars Three.js 3D Scenes Engine
   Manages the Hero Background 3D Universe and the
   STEM Laboratory simulator viewport.
   ------------------------------------------------------------- */

// Theme color lookups for JavaScript-driven 3D materials
const themeColors = {
    dark: {
        primaryBlue: 0x3b82f6,
        accent: 0xe2b714,
        white: 0xf3f4f6,
        muted: 0x4b5563,
        bg: 0x030712,
        particle: 0xffffff
    },
    light: {
        primaryBlue: 0x1d4ed8,
        accent: 0xb45309,
        white: 0x0f172a,
        muted: 0x94a3b8,
        bg: 0xf8fafc,
        particle: 0x1d4ed8
    }
};

// Global active theme helper
function getActiveTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return themeColors[theme];
}

/* =============================================================
   1. HERO BACKGROUND 3D SCENE
   ============================================================= */
class HeroBackgroundScene {
    constructor() {
        this.container = document.getElementById('three-container');
        if (!this.container) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.activeColors = getActiveTheme();

        // Scene objects
        this.globeGroup = null;
        this.dnaGroup = null;
        this.moleculesGroup = null;
        this.mathSprites = [];
        this.codeSprites = [];
        this.particles = null;

        // Mouse interaction state
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetCameraX = 0;
        this.targetCameraY = 0;

        this.init();
        this.createObjects();
        this.animate();
        this.setupEvents();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 18);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(this.activeColors.primaryBlue, 2, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(this.activeColors.accent, 1.5, 50);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);
    }

    createObjects() {
        // Clear existing if any
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }

        // Add back lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(this.activeColors.primaryBlue, 2, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(this.activeColors.accent, 1.5, 50);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);

        // 1. Particle Starfield Background
        this.createStarfield();

        // 2. Glowing Dotted Globe (Social Sciences / Geography)
        this.createGlobe();

        // 3. DNA Double Helix (Biology)
        this.createDNAHelix();

        // 4. Floating Molecules (Chemistry / Science)
        this.createMolecules();

        // 5. Floating Math & Coding Text Sprites
        this.createFloatingSprites();
    }

    createStarfield() {
        const count = 400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 45;      // x
            positions[i + 1] = (Math.random() - 0.5) * 25;  // y
            positions[i + 2] = (Math.random() - 0.5) * 30;  // z
            sizes[i/3] = Math.random() * 0.15 + 0.05;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.activeColors.particle,
            size: 0.08,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGlobe() {
        this.globeGroup = new THREE.Group();
        this.globeGroup.position.set(-8, 3, -5); // Position on left of screen behind text

        const points = [];
        const radius = 3.2;
        const dotsCount = 350;

        // Distribute points on a sphere (Fibonacci lattice)
        for (let i = 0; i < dotsCount; i++) {
            const phi = Math.acos(-1 + (2 * i) / dotsCount);
            const theta = Math.sqrt(dotsCount * Math.PI) * phi;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            points.push(x, y, z);
        }

        const globeGeom = new THREE.BufferGeometry();
        globeGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const globeMat = new THREE.PointsMaterial({
            color: this.activeColors.primaryBlue,
            size: 0.12,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });

        const globePoints = new THREE.Points(globeGeom, globeMat);
        this.globeGroup.add(globePoints);

        // Add 3 glowing wireframe equator/orbit rings
        const ringGeom = new THREE.RingGeometry(3.3, 3.32, 64);
        const ringMat1 = new THREE.LineBasicMaterial({ color: this.activeColors.accent, transparent: true, opacity: 0.25 });
        const ringMat2 = new THREE.LineBasicMaterial({ color: this.activeColors.primaryBlue, transparent: true, opacity: 0.15 });

        const orbit1 = new THREE.LineLoop(ringGeom, ringMat1);
        orbit1.rotation.x = Math.PI / 2;
        this.globeGroup.add(orbit1);

        const orbit2 = new THREE.LineLoop(ringGeom, ringMat2);
        orbit2.rotation.x = Math.PI / 3;
        orbit2.rotation.y = Math.PI / 4;
        this.globeGroup.add(orbit2);

        this.scene.add(this.globeGroup);
    }

    createDNAHelix() {
        this.dnaGroup = new THREE.Group();
        this.dnaGroup.position.set(7, -3, -2); // Position on right
        this.dnaGroup.rotation.z = Math.PI / 6;

        const numBasePairs = 22;
        const helixRadius = 1.0;
        const helixHeight = 5.5;
        
        const nodeGeom = new THREE.SphereGeometry(0.14, 16, 16);
        const nodeMat1 = new THREE.MeshPhongMaterial({ color: this.activeColors.primaryBlue, shininess: 80 });
        const nodeMat2 = new THREE.MeshPhongMaterial({ color: this.activeColors.accent, shininess: 80 });
        
        // Material for bonds connecting nodes
        const bondMat = new THREE.MeshPhongMaterial({ color: this.activeColors.muted, transparent: true, opacity: 0.4 });

        for (let i = 0; i < numBasePairs; i++) {
            const t = (i / numBasePairs) * Math.PI * 3.5; // rotations
            const y = (i / numBasePairs) * helixHeight - (helixHeight / 2);

            const x1 = Math.sin(t) * helixRadius;
            const z1 = Math.cos(t) * helixRadius;
            const x2 = Math.sin(t + Math.PI) * helixRadius;
            const z2 = Math.cos(t + Math.PI) * helixRadius;

            // Node 1
            const node1 = new THREE.Mesh(nodeGeom, nodeMat1);
            node1.position.set(x1, y, z1);
            this.dnaGroup.add(node1);

            // Node 2
            const node2 = new THREE.Mesh(nodeGeom, nodeMat2);
            node2.position.set(x2, y, z2);
            this.dnaGroup.add(node2);

            // Connecting cylinder bond
            const bondLen = helixRadius * 2;
            const bondGeom = new THREE.CylinderGeometry(0.03, 0.03, bondLen, 8);
            const bond = new THREE.Mesh(bondGeom, bondMat);
            bond.position.set((x1 + x2)/2, y, (z1 + z2)/2);
            bond.rotation.y = t;
            bond.rotation.z = Math.PI / 2;
            this.dnaGroup.add(bond);
        }

        this.scene.add(this.dnaGroup);
    }

    createMolecules() {
        this.moleculesGroup = new THREE.Group();
        this.moleculesGroup.position.set(8, 4, -4); // Top right

        const atomGeom = new THREE.SphereGeometry(0.2, 16, 16);
        const atomGeomSmall = new THREE.SphereGeometry(0.12, 16, 16);
        
        const matBlue = new THREE.MeshPhongMaterial({ color: this.activeColors.primaryBlue });
        const matGold = new THREE.MeshPhongMaterial({ color: this.activeColors.accent });
        const matWhite = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const bondMat = new THREE.MeshPhongMaterial({ color: this.activeColors.muted, transparent: true, opacity: 0.6 });

        // Build a water-like molecule H2O (1 central, 2 small)
        const water = new THREE.Group();
        
        const central = new THREE.Mesh(atomGeom, matBlue);
        water.add(central);

        const h1 = new THREE.Mesh(atomGeomSmall, matWhite);
        h1.position.set(0.45, 0.35, 0);
        water.add(h1);

        const h2 = new THREE.Mesh(atomGeomSmall, matWhite);
        h2.position.set(-0.45, 0.35, 0);
        water.add(h2);

        // bonds
        const bondGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        
        const b1 = new THREE.Mesh(bondGeom, bondMat);
        b1.position.set(0.22, 0.17, 0);
        b1.rotation.z = -Math.PI / 4;
        water.add(b1);

        const b2 = new THREE.Mesh(bondGeom, bondMat);
        b2.position.set(-0.22, 0.17, 0);
        b2.rotation.z = Math.PI / 4;
        water.add(b2);

        this.moleculesGroup.add(water);

        // Build a second CO2-like linear molecule slightly shifted
        const co2 = new THREE.Group();
        co2.position.set(-3, -2, 1);
        
        const carbon = new THREE.Mesh(atomGeom, matGold);
        co2.add(carbon);

        const o1 = new THREE.Mesh(atomGeom, matBlue);
        o1.position.set(0, 0.6, 0);
        co2.add(o1);

        const o2 = new THREE.Mesh(atomGeom, matBlue);
        o2.position.set(0, -0.6, 0);
        co2.add(o2);

        const bondC1 = new THREE.Mesh(bondGeom, bondMat);
        bondC1.position.set(0, 0.3, 0);
        co2.add(bondC1);

        const bondC2 = new THREE.Mesh(bondGeom, bondMat);
        bondC2.position.set(0, -0.3, 0);
        co2.add(bondC2);

        this.moleculesGroup.add(co2);

        this.scene.add(this.moleculesGroup);
    }

    createFloatingSprites() {
        const mathFormulas = [
            "E = mc²",
            "e^(iπ) + 1 = 0",
            "a² + b² = c²",
            "Δx · Δp ≥ ℏ/2",
            "f(x) = ∫ g(x) dx"
        ];

        const codingBlocks = [
            "</>",
            "{ code }",
            "while(true)",
            "if(scholar)"
        ];

        const colorStr = document.documentElement.getAttribute('data-theme') === 'dark' ? '#3b82f6' : '#1d4ed8';
        const goldStr = document.documentElement.getAttribute('data-theme') === 'dark' ? '#e2b714' : '#b45309';

        mathFormulas.forEach((formula, idx) => {
            const sprite = this.createTextSprite(formula, colorStr);
            // Scatter around background
            sprite.position.set(
                (Math.random() - 0.5) * 20 - 2,
                (Math.random() - 0.5) * 10 + 2,
                (Math.random() - 0.5) * 8 - 4
            );
            this.scene.add(sprite);
            this.mathSprites.push({
                obj: sprite,
                speedY: Math.random() * 0.003 + 0.001,
                rotSpeed: Math.random() * 0.002 - 0.001,
                seed: Math.random() * 10
            });
        });

        codingBlocks.forEach((code, idx) => {
            const sprite = this.createTextSprite(code, goldStr);
            sprite.position.set(
                (Math.random() - 0.5) * 20 + 2,
                (Math.random() - 0.5) * 10 - 2,
                (Math.random() - 0.5) * 8 - 4
            );
            this.scene.add(sprite);
            this.codeSprites.push({
                obj: sprite,
                speedY: Math.random() * 0.002 + 0.001,
                rotSpeed: Math.random() * 0.003 - 0.0015,
                seed: Math.random() * 10
            });
        });
    }

    createTextSprite(text, colorHexStr) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 96;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Rounded glowing background capsule
        ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        this.drawRoundedRect(ctx, 4, 4, 248, 88, 12);

        // Draw Text
        ctx.font = 'bold 24px "Outfit", Courier, sans-serif';
        ctx.fillStyle = colorHexStr;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 48);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.8 });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(3, 1.12, 1);
        return sprite;
    }

    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse parallax calculation
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            this.mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
            
            // Adjust camera target values
            this.targetCameraX = this.mouseX * 2.2;
            this.targetCameraY = -this.mouseY * 1.5;
        });

        // Watch theme switches from document root
        const observer = new MutationObserver(() => {
            this.activeColors = getActiveTheme();
            this.createObjects(); // Rebuild objects with correct color configurations
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Parallax lerp camera position
        this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.05;
        this.camera.lookAt(0, 0, 0);

        // 1. Globe Rotation
        if (this.globeGroup) {
            this.globeGroup.rotation.y += 0.002;
            this.globeGroup.rotation.x = Math.sin(time * 0.1) * 0.05;
        }

        // 2. DNA rotation
        if (this.dnaGroup) {
            this.dnaGroup.rotation.y += 0.007;
            this.dnaGroup.position.y = -3 + Math.sin(time * 0.5) * 0.2;
        }

        // 3. Molecules spinning
        if (this.moleculesGroup) {
            this.moleculesGroup.rotation.y += 0.005;
            this.moleculesGroup.rotation.z += 0.003;
            this.moleculesGroup.position.y = 4 + Math.sin(time * 0.6) * 0.15;
        }

        // 4. Animate floating math sprites
        this.mathSprites.forEach(item => {
            item.obj.position.y += Math.sin(time + item.seed) * 0.0015;
            item.obj.rotation.z += item.rotSpeed * 0.3;
        });

        // 5. Animate floating code blocks
        this.codeSprites.forEach(item => {
            item.obj.position.y += Math.cos(time + item.seed) * 0.0012;
            item.obj.rotation.z += item.rotSpeed * 0.3;
        });

        // 6. Stars rotation
        if (this.particles) {
            this.particles.rotation.y += 0.0003;
            this.particles.rotation.x += 0.0001;
        }

        this.renderer.render(this.scene, this.camera);
    }
}


/* =============================================================
   2. STEM PORTABLE SIMULATOR SCENE (SECONDARY)
   ============================================================= */
class StemSimulatorScene {
    constructor() {
        this.holder = document.getElementById('stem-canvas-holder');
        if (!this.holder) return;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.activeColors = getActiveTheme();

        // Scene objects
        this.activeObjectGroup = new THREE.Group();
        this.mode = 'molecule'; // 'molecule', 'wave', 'circuit'

        this.init();
        this.loadModule('molecule');
        this.animate();
        this.setupControls();
    }

    init() {
        const width = this.holder.clientWidth;
        const height = this.holder.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x020617); // Slate 950 always dark

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(0, 0, 10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.holder.appendChild(this.renderer.domElement);

        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.maxDistance = 15;
        this.controls.minDistance = 4;

        // Lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);

        const dir1 = new THREE.DirectionalLight(0xffffff, 1.2);
        dir1.position.set(5, 10, 5);
        this.scene.add(dir1);

        const point = new THREE.PointLight(this.activeColors.primaryBlue, 1.5, 30);
        point.position.set(-5, -5, 5);
        this.scene.add(point);

        this.scene.add(this.activeObjectGroup);
    }

    loadModule(type) {
        this.mode = type;
        
        // Clean active group
        while(this.activeObjectGroup.children.length > 0){
            this.activeObjectGroup.remove(this.activeObjectGroup.children[0]);
        }

        // Build based on type
        if (type === 'molecule') {
            this.buildMolecule();
        } else if (type === 'wave') {
            this.buildWaveSystem();
        } else if (type === 'circuit') {
            this.buildCircuitNode();
        }
    }

    buildMolecule() {
        // Build Caffeine-like or Glucose-like ring molecule
        const ringRadius = 1.8;
        const atomGeomLarge = new THREE.SphereGeometry(0.3, 32, 32);
        const atomGeomSmall = new THREE.SphereGeometry(0.18, 16, 16);
        const bondGeom = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);

        const matCarbon = new THREE.MeshPhongMaterial({ color: 0xe2b714, shininess: 80 }); // Gold
        const matOxygen = new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 80 }); // Red
        const matHydrogen = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 60 }); // White
        const matNitrogen = new THREE.MeshPhongMaterial({ color: 0x3b82f6, shininess: 80 }); // Royal Blue
        const bondMat = new THREE.MeshPhongMaterial({ color: 0x475569 }); // Muted slate

        const ringNodes = [];
        
        // 1. Create a hexagons ring
        for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            
            // Alternating Carbon & Nitrogen
            const atomMat = (i % 2 === 0) ? matCarbon : matNitrogen;
            const atom = new THREE.Mesh(atomGeomLarge, atomMat);
            atom.position.set(x, y, 0);
            this.activeObjectGroup.add(atom);
            ringNodes.push({x, y});
        }

        // 2. Add outer atoms (Hydrogen & Oxygen) and connections
        for(let i=0; i<6; i++) {
            const current = ringNodes[i];
            const next = ringNodes[(i+1)%6];

            // Bond between ring atoms
            const dx = next.x - current.x;
            const dy = next.y - current.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            const bond = new THREE.Mesh(bondGeom, bondMat);
            bond.scale.set(1, dist, 1);
            bond.position.set((current.x + next.x)/2, (current.y + next.y)/2, 0);
            
            // Calculate angle to align bond cylinder
            const angle = Math.atan2(dy, dx);
            bond.rotation.z = angle + Math.PI/2;
            this.activeObjectGroup.add(bond);

            // Add side branch for every second node
            if (i % 2 === 0) {
                const bx = current.x * 1.5;
                const by = current.y * 1.5;
                const branchAtom = new THREE.Mesh(atomGeomSmall, matHydrogen);
                branchAtom.position.set(bx, by, 0);
                this.activeObjectGroup.add(branchAtom);

                // branch bond
                const bBond = new THREE.Mesh(bondGeom, bondMat);
                bBond.scale.set(1, 0.6, 1);
                bBond.position.set((current.x + bx)/2, (current.y + by)/2, 0);
                bBond.rotation.z = Math.atan2(by - current.y, bx - current.x) + Math.PI/2;
                this.activeObjectGroup.add(bBond);
            }
        }
    }

    buildWaveSystem() {
        // Create an oscillating 12x12 grid of particles
        this.waveParticles = [];
        const gridSize = 12;
        const spacing = 0.45;
        const sphereGeom = new THREE.SphereGeometry(0.06, 8, 8);
        const mat = new THREE.MeshPhongMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8 });

        const startX = -((gridSize - 1) * spacing) / 2;
        const startZ = -((gridSize - 1) * spacing) / 2;

        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                const mesh = new THREE.Mesh(sphereGeom, mat);
                const posX = startX + x * spacing;
                const posZ = startZ + z * spacing;
                mesh.position.set(posX, 0, posZ);
                this.activeObjectGroup.add(mesh);

                this.waveParticles.push({
                    mesh: mesh,
                    xIndex: x,
                    zIndex: z
                });
            }
        }

        // Draw connections lines
        const lineMat = new THREE.LineBasicMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.3 });
        
        // Add horizontal wires
        for (let x = 0; x < gridSize; x++) {
            const points = [];
            for (let z = 0; z < gridSize; z++) {
                points.push(new THREE.Vector3(startX + x * spacing, 0, startZ + z * spacing));
            }
            const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeom, lineMat);
            this.activeObjectGroup.add(line);
        }
    }

    buildCircuitNode() {
        // Build dynamic coding/circuit network: nodes connected by lines
        const nodesCount = 18;
        const nodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const activeNodeGeom = new THREE.SphereGeometry(0.16, 16, 16);
        const matNode = new THREE.MeshPhongMaterial({ color: 0x94a3b8 });
        const matGoldNode = new THREE.MeshPhongMaterial({ color: 0xe2b714, emissive: 0xb45309 });
        const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });

        const points = [];
        this.circuitPoints = [];

        // Generate points scattered in a sphere boundary
        for(let i=0; i<nodesCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = Math.random() * 0.8 + 1.6;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            const isGold = Math.random() > 0.7;
            const mesh = new THREE.Mesh(isGold ? activeNodeGeom : nodeGeom, isGold ? matGoldNode : matNode);
            mesh.position.set(x, y, z);
            this.activeObjectGroup.add(mesh);

            points.push(new THREE.Vector3(x, y, z));
            this.circuitPoints.push({x, y, z, mesh, isGold});
        }

        // Draw connections lines between near nodes
        for(let i=0; i<nodesCount; i++) {
            const p1 = this.circuitPoints[i];
            let connections = 0;

            for(let j=i+1; j<nodesCount; j++) {
                const p2 = this.circuitPoints[j];
                const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));

                if (dist < 1.95 && connections < 3) {
                    const lineGeom = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(p1.x, p1.y, p1.z),
                        new THREE.Vector3(p2.x, p2.y, p2.z)
                    ]);
                    const line = new THREE.Line(lineGeom, lineMat);
                    this.activeObjectGroup.add(line);
                    connections++;
                }
            }
        }
    }

    setupControls() {
        const btnMolecule = document.getElementById('stem-btn-molecule');
        const btnWave = document.getElementById('stem-btn-wave');
        const btnCircuit = document.getElementById('stem-btn-circuit');
        const freqHud = document.getElementById('hud-freq');

        const buttons = [btnMolecule, btnWave, btnCircuit];

        const selectButton = (activeBtn) => {
            buttons.forEach(btn => { if (btn) btn.classList.remove('active'); });
            if (activeBtn) activeBtn.classList.add('active');
        };

        if (btnMolecule) {
            btnMolecule.addEventListener('click', () => {
                selectButton(btnMolecule);
                this.loadModule('molecule');
                if (freqHud) freqHud.innerText = "60Hz";
            });
        }

        if (btnWave) {
            btnWave.addEventListener('click', () => {
                selectButton(btnWave);
                this.loadModule('wave');
                if (freqHud) freqHud.innerText = "280Hz";
            });
        }

        if (btnCircuit) {
            btnCircuit.addEventListener('click', () => {
                selectButton(btnCircuit);
                this.loadModule('circuit');
                if (freqHud) freqHud.innerText = "1.2GHz";
            });
        }

        // Resizing
        window.addEventListener('resize', () => {
            if (!this.holder) return;
            const w = this.holder.clientWidth;
            const h = this.holder.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Slow baseline rotation for whatever active item is
        if (this.activeObjectGroup) {
            if (this.mode === 'molecule') {
                this.activeObjectGroup.rotation.y += 0.005;
                this.activeObjectGroup.rotation.x += 0.002;
            } else if (this.mode === 'circuit') {
                this.activeObjectGroup.rotation.y += 0.004;
                this.activeObjectGroup.rotation.z += 0.002;
            } else if (this.mode === 'wave') {
                this.activeObjectGroup.rotation.y += 0.003;
            }
        }

        // Module-specific internal animations
        if (this.mode === 'wave' && this.waveParticles) {
            this.waveParticles.forEach(p => {
                // Generate sine ripples based on coordinates
                const distance = Math.sqrt(Math.pow(p.xIndex - 5.5, 2) + Math.pow(p.zIndex - 5.5, 2));
                const yOffset = Math.sin(time * 3 - distance * 0.6) * 0.45;
                p.mesh.position.y = yOffset;
            });
        }

        if (this.mode === 'circuit' && this.circuitPoints) {
            this.circuitPoints.forEach(p => {
                // If it is an active gold node, pulse its scale and emission
                if (p.isGold) {
                    const scale = 1.0 + Math.sin(time * 5 + p.x) * 0.25;
                    p.mesh.scale.set(scale, scale, scale);
                }
            });
        }

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }
}


// Initialize scenes after page is loaded
window.addEventListener('DOMContentLoaded', () => {
    // 1. Start Hero background animation
    const heroBg = new HeroBackgroundScene();
    
    // 2. Start STEM viewport simulator
    const stemSimulator = new StemSimulatorScene();
});
