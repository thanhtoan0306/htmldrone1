// Tạo và quản lý Jellyfish
function createJellyfish() {
    App.jellyfish = new THREE.Group();

    // Thân sứa (dome) - dùng các particle neon
    const domeParticles = createDomeParticles();
    App.jellyfish.add(domeParticles);

    // Tạo các xúc tu
    App.tentacles = new THREE.Group();
    const tentacleCount = 16;
    
    for (let i = 0; i < tentacleCount; i++) {
        const angle = (i / tentacleCount) * Math.PI * 2;
        const tentacle = createTentacle(angle);
        App.tentacles.add(tentacle);
    }
    
    App.jellyfish.add(App.tentacles);
    App.scene.add(App.jellyfish);
}

function createDomeParticles() {
    const domeParticles = new THREE.Group();
    const particleCount = 800;
    
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        const radius = 3 + Math.random() * 0.3;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi) * 0.6;
        const z = radius * Math.cos(phi) * 0.8;

        if (y < 0) continue;

        const geometry = new THREE.SphereGeometry(0.08, 8, 8);
        
        // Màu neon drone: hồng, tím, xanh cyan, vàng
        const colors = [0xff0080, 0x9d00ff, 0x00ffff, 0xffff00, 0xff3366, 0x00ff88];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const material = new THREE.MeshBasicMaterial({
            color: randomColor,
            transparent: true,
            opacity: 0.9
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z);
        
        // Thêm glow effect
        const glowGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: material.color,
            transparent: true,
            opacity: 0.4
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        particle.add(glow);
        
        particle.userData = {
            originalX: x,
            originalY: y,
            originalZ: z,
            phase: Math.random() * Math.PI * 2
        };
        
        domeParticles.add(particle);
    }
    
    return domeParticles;
}

function createTentacle(angle) {
    const tentacle = new THREE.Group();
    const segments = 20;
    const radius = 2.5;
    
    for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const x = Math.cos(angle) * radius * (1 - t * 0.3);
        const y = -t * 6;
        const z = Math.sin(angle) * radius * (1 - t * 0.3);
        
        const size = 0.08 * (1 - t * 0.5);
        const geometry = new THREE.SphereGeometry(size, 6, 6);
        const hue = 0.52 + Math.sin(t * Math.PI) * 0.08;
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue, 1, 0.5),
            transparent: true,
            opacity: 0.9 - t * 0.3
        });
        
        const segment = new THREE.Mesh(geometry, material);
        segment.position.set(x, y, z);
        
        // Glow
        const glowGeometry = new THREE.SphereGeometry(size * 2, 6, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: material.color,
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        segment.add(glow);
        
        segment.userData = {
            originalX: x,
            originalY: y,
            originalZ: z,
            segmentIndex: i,
            angle: angle
        };
        
        tentacle.add(segment);
    }
    
    return tentacle;
}

