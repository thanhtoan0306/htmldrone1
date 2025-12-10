// Tạo và quản lý Hoa Hướng Dương
function createSunflower() {
    App.sunflower = new THREE.Group();

    // Tâm hoa (center)
    const center = createSunflowerCenter();
    App.sunflower.add(center);

    // Cánh hoa (petals)
    const petals = new THREE.Group();
    const petalCount = 20;
    
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petal = createPetal(angle, i);
        petals.add(petal);
    }
    
    App.sunflower.add(petals);
    App.sunflower.petals = petals;
    App.sunflower.center = center;
    App.scene.add(App.sunflower);
}

function createSunflowerCenter() {
    const centerGroup = new THREE.Group();
    const centerRadius = 1.5;
    const seedCount = 200;
    
    // Tạo các hạt ở tâm
    for (let i = 0; i < seedCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / seedCount);
        const theta = Math.sqrt(seedCount * Math.PI) * phi;
        
        const radius = centerRadius * (0.3 + Math.random() * 0.7);
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const size = 0.05 + Math.random() * 0.05;
        const geometry = new THREE.SphereGeometry(size, 6, 6);
        
        // Màu nâu đậm cho hạt
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.08, 0.8, 0.2),
            transparent: true,
            opacity: 0.9
        });
        
        const seed = new THREE.Mesh(geometry, material);
        seed.position.set(x, y, z);
        
        seed.userData = {
            originalX: x,
            originalY: y,
            originalZ: z,
            phase: Math.random() * Math.PI * 2
        };
        
        centerGroup.add(seed);
    }
    
    return centerGroup;
}

function createPetal(angle, index) {
    const petalGroup = new THREE.Group();
    const petalLength = 4;
    const segments = 15;
    
    for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const distance = 1.5 + t * petalLength;
        
        // Tạo hình dạng cánh hoa
        const width = Math.sin(t * Math.PI) * 0.8;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance * width;
        const z = (Math.sin(t * Math.PI) - 0.5) * 0.3;
        
        const size = 0.12 * (1 - t * 0.3);
        const geometry = new THREE.SphereGeometry(size, 8, 8);
        
        // Màu vàng cho cánh hoa
        const hue = 0.12 + Math.sin(t * Math.PI) * 0.02; // Vàng cam
        const saturation = 0.9;
        const lightness = 0.5 + Math.sin(t * Math.PI) * 0.2;
        
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(hue, saturation, lightness),
            transparent: true,
            opacity: 0.9 - t * 0.2
        });
        
        const segment = new THREE.Mesh(geometry, material);
        segment.position.set(x, y, z);
        
        // Glow effect
        const glowGeometry = new THREE.SphereGeometry(size * 1.8, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: material.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        segment.add(glow);
        
        segment.userData = {
            originalX: x,
            originalY: y,
            originalZ: z,
            segmentIndex: i,
            angle: angle,
            index: index
        };
        
        petalGroup.add(segment);
    }
    
    return petalGroup;
}

function removeSunflower() {
    if (App.sunflower) {
        App.scene.remove(App.sunflower);
        App.sunflower = null;
    }
}
