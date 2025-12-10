// Hệ thống quản lý particles/drones tập trung
function createParticleSystem() {
    App.particleSystem = {
        particles: [],
        particleGroup: new THREE.Group(), // Group để chứa tất cả particles
        targetPositions: [],
        targetColors: [],
        isTransitioning: false,
        transitionProgress: 0,
        transitionDuration: 3.0, // 3 giây để chuyển đổi
        currentFormation: null
    };
    App.scene.add(App.particleSystem.particleGroup);
}

function initializeParticles(count) {
    // Xóa particles cũ nếu có
    if (App.particleSystem.particles.length > 0) {
        App.particleSystem.particles.forEach(particle => {
            App.particleSystem.particleGroup.remove(particle);
        });
    }

    App.particleSystem.particles = [];
    App.particleSystem.targetPositions = [];
    App.particleSystem.targetColors = [];

    const colors = [0xff0080, 0x9d00ff, 0x00ffff, 0xffff00, 0xff3366, 0x00ff88];

    for (let i = 0; i < count; i++) {
        const geometry = new THREE.SphereGeometry(0.08, 8, 8);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const material = new THREE.MeshBasicMaterial({
            color: randomColor,
            transparent: true,
            opacity: 0.9
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
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
            startX: 0,
            startY: 0,
            startZ: 0,
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            startColor: randomColor,
            targetColor: randomColor,
            phase: Math.random() * Math.PI * 2,
            index: i
        };
        
        // Bắt đầu từ vị trí ngẫu nhiên
        const startX = (Math.random() - 0.5) * 20;
        const startY = (Math.random() - 0.5) * 20;
        const startZ = (Math.random() - 0.5) * 20;
        
        particle.position.set(startX, startY, startZ);
        particle.userData.startX = startX;
        particle.userData.startY = startY;
        particle.userData.startZ = startZ;
        
        App.particleSystem.particles.push(particle);
        App.particleSystem.particleGroup.add(particle);
    }
}

function setJellyfishFormation() {
    const particles = App.particleSystem.particles;
    const particleCount = particles.length;
    
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        const radius = 3 + Math.random() * 0.3;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi) * 0.6;
        const z = radius * Math.cos(phi);

        if (y < 0) {
            // Nếu y < 0, đặt ở vị trí ngẫu nhiên phía trên
            particles[i].userData.targetX = (Math.random() - 0.5) * 10;
            particles[i].userData.targetY = Math.random() * 5 + 2;
            particles[i].userData.targetZ = (Math.random() - 0.5) * 10;
        } else {
            particles[i].userData.targetX = x;
            particles[i].userData.targetY = y;
            particles[i].userData.targetZ = z;
        }

        // Màu neon cho jellyfish
        const colors = [0xff0080, 0x9d00ff, 0x00ffff, 0xffff00, 0xff3366, 0x00ff88];
        particles[i].userData.targetColor = colors[Math.floor(Math.random() * colors.length)];
    }
    
    startTransition();
}

function setJellyfishFormationInitial() {
    // Set vị trí ban đầu không có transition
    const particles = App.particleSystem.particles;
    const particleCount = particles.length;
    
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        const radius = 3 + Math.random() * 0.3;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi) * 0.6;
        const z = radius * Math.cos(phi);

        if (y < 0) {
            particles[i].position.set(
                (Math.random() - 0.5) * 10,
                Math.random() * 5 + 2,
                (Math.random() - 0.5) * 10
            );
        } else {
            particles[i].position.set(x, y, z);
        }
        
        particles[i].userData.targetX = particles[i].position.x;
        particles[i].userData.targetY = particles[i].position.y;
        particles[i].userData.targetZ = particles[i].position.z;

        // Màu neon cho jellyfish
        const colors = [0xff0080, 0x9d00ff, 0x00ffff, 0xffff00, 0xff3366, 0x00ff88];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles[i].userData.targetColor = color;
        particles[i].material.color.setHex(color);
        particles[i].children[0].material.color.setHex(color);
    }
}

function setSunflowerFormation() {
    const particles = App.particleSystem.particles;
    const particleCount = particles.length;
    
    // Tính số particles cho mỗi phần
    const centerCount = Math.floor(particleCount * 0.3); // 30% cho tâm
    const petalCount = 20;
    const particlesPerPetal = Math.floor((particleCount - centerCount) / petalCount);
    
    let particleIndex = 0;
    
    // Tạo tâm hoa
    for (let i = 0; i < centerCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / centerCount);
        const theta = Math.sqrt(centerCount * Math.PI) * phi;
        
        const radius = 1.5 * (0.3 + Math.random() * 0.7);
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        
        // Màu nâu cho hạt
        particles[particleIndex].userData.targetColor = new THREE.Color().setHSL(0.08, 0.8, 0.2).getHex();
        
        particleIndex++;
    }
    
    // Tạo cánh hoa
    for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2;
        
        for (let s = 0; s < particlesPerPetal && particleIndex < particleCount; s++) {
            const t = s / particlesPerPetal;
            const distance = 1.5 + t * 4;
            
            const width = Math.sin(t * Math.PI) * 0.8;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance * width;
            const z = (Math.sin(t * Math.PI) - 0.5) * 0.3;

            particles[particleIndex].userData.targetX = x;
            particles[particleIndex].userData.targetY = y;
            particles[particleIndex].userData.targetZ = z;
            
            // Màu vàng cho cánh hoa
            const hue = 0.12 + Math.sin(t * Math.PI) * 0.02;
            particles[particleIndex].userData.targetColor = new THREE.Color().setHSL(hue, 0.9, 0.5 + Math.sin(t * Math.PI) * 0.2).getHex();
            
            particleIndex++;
        }
    }
    
    startTransition();
}

function startTransition() {
    // Lưu vị trí hiện tại làm điểm bắt đầu (trong local space của group)
    App.particleSystem.particles.forEach(particle => {
        particle.userData.startX = particle.position.x;
        particle.userData.startY = particle.position.y;
        particle.userData.startZ = particle.position.z;
        particle.userData.startColor = particle.material.color.getHex();
    });
    
    // Reset group rotation và position để transition mượt mà
    App.particleSystem.particleGroup.rotation.set(0, 0, 0);
    App.particleSystem.particleGroup.position.set(0, 0, 0);
    
    App.particleSystem.isTransitioning = true;
    App.particleSystem.transitionProgress = 0;
}

function updateParticleTransition(deltaTime) {
    if (!App.particleSystem.isTransitioning) return;
    
    App.particleSystem.transitionProgress += deltaTime / App.particleSystem.transitionDuration;
    
    if (App.particleSystem.transitionProgress >= 1) {
        App.particleSystem.transitionProgress = 1;
        App.particleSystem.isTransitioning = false;
    }
    
    // Easing function (easeInOutCubic)
    const t = App.particleSystem.transitionProgress;
    const eased = t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    App.particleSystem.particles.forEach(particle => {
        // Interpolate position
        const startX = particle.userData.startX;
        const startY = particle.userData.startY;
        const startZ = particle.userData.startZ;
        const targetX = particle.userData.targetX;
        const targetY = particle.userData.targetY;
        const targetZ = particle.userData.targetZ;
        
        particle.position.x = startX + (targetX - startX) * eased;
        particle.position.y = startY + (targetY - startY) * eased;
        particle.position.z = startZ + (targetZ - startZ) * eased;
        
        // Interpolate color
        const startColor = new THREE.Color(particle.userData.startColor);
        const targetColor = new THREE.Color(particle.userData.targetColor);
        particle.material.color.lerpColors(startColor, targetColor, eased);
        particle.children[0].material.color.lerpColors(startColor, targetColor, eased);
    });
}
