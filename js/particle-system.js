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
        // Tăng kích thước particles để giãn xa hơn
        const geometry = new THREE.SphereGeometry(0.12, 8, 8);
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const material = new THREE.MeshBasicMaterial({
            color: randomColor,
            transparent: true,
            opacity: 0.9
        });
        
        const particle = new THREE.Mesh(geometry, material);
        
        // Thêm glow effect (tăng kích thước để phù hợp với particle lớn hơn)
        const glowGeometry = new THREE.SphereGeometry(0.3, 8, 8);
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

function setTigerFaceFormation() {
    const particles = App.particleSystem.particles;
    const particleCount = particles.length;
    
    // Màu lam neon
    const blueColor = 0x00ffff; // Cyan neon
    
    // Kích thước mặt hổ (scale)
    const scale = 4;
    const centerX = 0;
    const centerY = 0;
    
    let particleIndex = 0;
    
    // Tạo pattern mặt hổ
    // 1. Đầu (hình tròn/oval)
    const headRadius = 3 * scale;
    const headParticles = Math.floor(particleCount * 0.4);
    
    for (let i = 0; i < headParticles && particleIndex < particleCount; i++) {
        const angle = (i / headParticles) * Math.PI * 2;
        const radius = headRadius * (0.7 + Math.random() * 0.3);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.8; // Oval
        const z = (Math.random() - 0.5) * 0.5;
        
        particles[particleIndex].userData.targetX = x / scale;
        particles[particleIndex].userData.targetY = y / scale;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = blueColor;
        particleIndex++;
    }
    
    // 2. Mắt trái
    const leftEyeX = -1.2 * scale;
    const leftEyeY = 0.5 * scale;
    const eyeRadius = 0.6 * scale;
    const eyeParticles = Math.floor(particleCount * 0.08);
    
    for (let i = 0; i < eyeParticles && particleIndex < particleCount; i++) {
        const angle = (i / eyeParticles) * Math.PI * 2;
        const radius = eyeRadius * (0.5 + Math.random() * 0.5);
        const x = leftEyeX + Math.cos(angle) * radius;
        const y = leftEyeY + Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.3;
        
        particles[particleIndex].userData.targetX = x / scale;
        particles[particleIndex].userData.targetY = y / scale;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = blueColor;
        particleIndex++;
    }
    
    // 3. Mắt phải
    const rightEyeX = 1.2 * scale;
    const rightEyeY = 0.5 * scale;
    
    for (let i = 0; i < eyeParticles && particleIndex < particleCount; i++) {
        const angle = (i / eyeParticles) * Math.PI * 2;
        const radius = eyeRadius * (0.5 + Math.random() * 0.5);
        const x = rightEyeX + Math.cos(angle) * radius;
        const y = rightEyeY + Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.3;
        
        particles[particleIndex].userData.targetX = x / scale;
        particles[particleIndex].userData.targetY = y / scale;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = blueColor;
        particleIndex++;
    }
    
    // 4. Mũi (tam giác)
    const noseX = 0;
    const noseY = -0.3 * scale;
    const noseParticles = Math.floor(particleCount * 0.05);
    
    for (let i = 0; i < noseParticles && particleIndex < particleCount; i++) {
        const angle = (i / noseParticles) * Math.PI * 2;
        const radius = 0.4 * scale * (0.5 + Math.random() * 0.5);
        const x = noseX + Math.cos(angle) * radius;
        const y = noseY + Math.sin(angle) * radius * 0.6;
        const z = (Math.random() - 0.5) * 0.3;
        
        particles[particleIndex].userData.targetX = x / scale;
        particles[particleIndex].userData.targetY = y / scale;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = blueColor;
        particleIndex++;
    }
    
    // 5. Miệng (đường cong)
    const mouthParticles = Math.floor(particleCount * 0.1);
    for (let i = 0; i < mouthParticles && particleIndex < particleCount; i++) {
        const t = i / mouthParticles;
        const mouthWidth = 1.5 * scale;
        const mouthY = -1.2 * scale;
        const x = (t - 0.5) * mouthWidth;
        const y = mouthY + Math.sin(t * Math.PI) * 0.3 * scale;
        const z = (Math.random() - 0.5) * 0.3;
        
        particles[particleIndex].userData.targetX = x / scale;
        particles[particleIndex].userData.targetY = y / scale;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = blueColor;
        particleIndex++;
    }
    
    // 6. Sọc hổ (các đường dọc)
    const stripeParticles = particleCount - particleIndex;
    const stripeCount = 8;
    const stripeWidth = 0.15 * scale;
    
    for (let s = 0; s < stripeCount && particleIndex < particleCount; s++) {
        const stripeX = (s / stripeCount - 0.5) * headRadius * 1.5;
        const stripeLength = headRadius * 0.8;
        const particlesPerStripe = Math.floor(stripeParticles / stripeCount);
        
        for (let i = 0; i < particlesPerStripe && particleIndex < particleCount; i++) {
            const t = i / particlesPerStripe;
            const x = stripeX + (Math.random() - 0.5) * stripeWidth;
            const y = (t - 0.5) * stripeLength;
            const z = (Math.random() - 0.5) * 0.3;
            
            particles[particleIndex].userData.targetX = x / scale;
            particles[particleIndex].userData.targetY = y / scale;
            particles[particleIndex].userData.targetZ = z;
            particles[particleIndex].userData.targetColor = blueColor;
            particleIndex++;
        }
    }
    
    // Đặt các particles còn lại xung quanh
    while (particleIndex < particleCount) {
        const angle = Math.random() * Math.PI * 2;
        const radius = headRadius * (1.1 + Math.random() * 0.3);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.8;
        const z = (Math.random() - 0.5) * 0.5;
        
        particles[particleIndex].userData.targetX = x / scale;
        particles[particleIndex].userData.targetY = y / scale;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = blueColor;
        particleIndex++;
    }
    
    startTransition();
}

function setDragonFormation() {
    const particles = App.particleSystem.particles;
    const particleCount = particles.length;
    
    // Màu sắc theo hình tham khảo: Đỏ (outline), Vàng/Trắng (fill), Tím (accent)
    const redColor = 0xff0000;      // Đỏ cho outline
    const yellowColor = 0xffff00;   // Vàng cho fill
    const whiteColor = 0xffffff;     // Trắng cho fill
    const purpleColor = 0x9d00ff;    // Tím cho accent
    
    // Hàm chọn màu: outline (đỏ) hoặc fill (vàng/trắng)
    const getOutlineColor = () => redColor;
    const getFillColor = () => Math.random() > 0.5 ? yellowColor : whiteColor;
    const getAccentColor = () => purpleColor;
    
    let particleIndex = 0;
    const scale = 0.8; // Scale tổng thể
    
    // 1. ĐẦU RỒNG (chi tiết)
    const headX = 4 * scale;
    const headY = 0;
    const headZ = 0;
    
    // 1.1. Đầu chính (fill vàng/trắng)
    const headRadius = 1.0 * scale;
    const headParticles = Math.floor(particleCount * 0.12);
    
    for (let i = 0; i < headParticles && particleIndex < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / headParticles);
        const theta = Math.sqrt(headParticles * Math.PI) * phi;
        
        const radius = headRadius * (0.5 + Math.random() * 0.5);
        const x = headX + radius * Math.cos(theta) * Math.sin(phi);
        const y = headY + radius * Math.sin(theta) * Math.sin(phi);
        const z = headZ + radius * Math.cos(phi) * 0.7;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = getFillColor();
        particles[particleIndex].userData.isOutline = false;
        particleIndex++;
    }
    
    // 1.2. Outline đầu (đỏ)
    const headOutlineParticles = Math.floor(particleCount * 0.03);
    for (let i = 0; i < headOutlineParticles && particleIndex < particleCount; i++) {
        const angle = (i / headOutlineParticles) * Math.PI * 2;
        const radius = headRadius * 1.05;
        const x = headX + Math.cos(angle) * radius;
        const y = headY + Math.sin(angle) * radius * 0.8;
        const z = headZ + (Math.random() - 0.5) * 0.3;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = getOutlineColor();
        particles[particleIndex].userData.isOutline = true;
        particleIndex++;
    }
    
    // 1.3. Sừng rồng (đỏ)
    const hornParticles = Math.floor(particleCount * 0.02);
    // Sừng trái
    for (let i = 0; i < hornParticles / 2 && particleIndex < particleCount; i++) {
        const t = i / (hornParticles / 2);
        const x = headX + 0.3 * scale;
        const y = headY + 0.6 * scale + t * 0.8 * scale;
        const z = headZ - 0.2 * scale;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = getOutlineColor();
        particles[particleIndex].userData.isOutline = true;
        particleIndex++;
    }
    // Sừng phải
    for (let i = 0; i < hornParticles / 2 && particleIndex < particleCount; i++) {
        const t = i / (hornParticles / 2);
        const x = headX + 0.3 * scale;
        const y = headY + 0.6 * scale + t * 0.8 * scale;
        const z = headZ + 0.2 * scale;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = getOutlineColor();
        particles[particleIndex].userData.isOutline = true;
        particleIndex++;
    }
    
    // 1.4. Mõm/Hàm (vàng/trắng)
    const snoutParticles = Math.floor(particleCount * 0.02);
    for (let i = 0; i < snoutParticles && particleIndex < particleCount; i++) {
        const t = i / snoutParticles;
        const x = headX + 0.5 * scale + t * 0.4 * scale;
        const y = headY - 0.2 * scale;
        const z = headZ + (Math.random() - 0.5) * 0.2 * scale;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = getFillColor();
        particles[particleIndex].userData.isOutline = false;
        particleIndex++;
    }
    
    // 1.5. Râu/Mane (đỏ, vàng, tím)
    const maneParticles = Math.floor(particleCount * 0.04);
    for (let i = 0; i < maneParticles && particleIndex < particleCount; i++) {
        const t = i / maneParticles;
        const angle = t * Math.PI * 0.6 - Math.PI * 0.3; // Từ -30° đến 30°
        const distance = 0.8 * scale + t * 1.2 * scale;
        const x = headX - 0.3 * scale;
        const y = headY + Math.sin(angle) * distance;
        const z = headZ + Math.cos(angle) * distance * 0.3;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = Math.random() > 0.6 ? getOutlineColor() : (Math.random() > 0.5 ? getFillColor() : getAccentColor());
        particles[particleIndex].userData.isOutline = false;
        particleIndex++;
    }
    
    // 2. THÂN RỒNG (uốn lượn với outline đỏ và fill vàng/trắng)
    const bodyLength = 10 * scale;
    const bodySegments = 50;
    const bodyParticles = Math.floor(particleCount * 0.4);
    const particlesPerSegment = bodyParticles / bodySegments;
    
    for (let s = 0; s < bodySegments && particleIndex < particleCount; s++) {
        const t = s / bodySegments;
        const x = headX - 1.5 * scale - t * bodyLength;
        
        // Đường uốn lượn mượt mà
        const waveAmplitude = 1.2 * scale;
        const waveFrequency = 1.5;
        const y = Math.sin(t * Math.PI * waveFrequency) * waveAmplitude;
        const z = Math.cos(t * Math.PI * waveFrequency * 0.8) * waveAmplitude * 0.4;
        
        // Bán kính thân giảm dần về đuôi
        const bodyRadius = 0.5 * scale * (1 - t * 0.4);
        
        // Fill bên trong (vàng/trắng)
        const fillParticles = Math.floor(particlesPerSegment * 0.7);
        for (let i = 0; i < fillParticles && particleIndex < particleCount; i++) {
            const angle = (i / fillParticles) * Math.PI * 2;
            const radius = bodyRadius * (0.3 + Math.random() * 0.4);
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            const offsetZ = (Math.random() - 0.5) * radius * 0.3;
            
            particles[particleIndex].userData.targetX = x + offsetX;
            particles[particleIndex].userData.targetY = y + offsetY;
            particles[particleIndex].userData.targetZ = z + offsetZ;
            particles[particleIndex].userData.targetColor = getFillColor();
            particles[particleIndex].userData.isOutline = false;
            particles[particleIndex].userData.segmentIndex = s;
            particleIndex++;
        }
        
        // Outline (đỏ)
        const outlineParticles = particlesPerSegment - fillParticles;
        for (let i = 0; i < outlineParticles && particleIndex < particleCount; i++) {
            const angle = (i / outlineParticles) * Math.PI * 2;
            const radius = bodyRadius * 1.1;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            const offsetZ = (Math.random() - 0.5) * radius * 0.2;
            
            particles[particleIndex].userData.targetX = x + offsetX;
            particles[particleIndex].userData.targetY = y + offsetY;
            particles[particleIndex].userData.targetZ = z + offsetZ;
            particles[particleIndex].userData.targetColor = getOutlineColor();
            particles[particleIndex].userData.isOutline = true;
            particles[particleIndex].userData.segmentIndex = s;
            particleIndex++;
        }
        
        // Spikes dọc lưng (đỏ)
        if (s % 5 === 0 && particleIndex < particleCount) {
            const spikeX = x;
            const spikeY = y + bodyRadius * 1.2;
            const spikeZ = z;
            
            particles[particleIndex].userData.targetX = spikeX;
            particles[particleIndex].userData.targetY = spikeY;
            particles[particleIndex].userData.targetZ = spikeZ;
            particles[particleIndex].userData.targetColor = getOutlineColor();
            particles[particleIndex].userData.isOutline = true;
            particles[particleIndex].userData.segmentIndex = s;
            particleIndex++;
        }
    }
    
    // 3. CHÂN VÀ MÓNG VUỐT (đỏ, vàng, tím)
    const legParticles = Math.floor(particleCount * 0.12);
    const legsPerSide = 2;
    const particlesPerLeg = legParticles / (legsPerSide * 2);
    
    // Chân trước trái
    for (let leg = 0; leg < legsPerSide; leg++) {
        const legX = headX - 1 * scale - leg * 2.5 * scale;
        const legY = -0.8 * scale;
        const legZ = -0.8 * scale;
        
        for (let i = 0; i < particlesPerLeg && particleIndex < particleCount; i++) {
            const t = i / particlesPerLeg;
            const x = legX;
            const y = legY - t * 1.5 * scale;
            const z = legZ;
            
            particles[particleIndex].userData.targetX = x;
            particles[particleIndex].userData.targetY = y;
            particles[particleIndex].userData.targetZ = z;
            particles[particleIndex].userData.targetColor = Math.random() > 0.5 ? getOutlineColor() : (Math.random() > 0.5 ? getFillColor() : getAccentColor());
            particles[particleIndex].userData.isOutline = false;
            particleIndex++;
        }
        
        // Móng vuốt
        for (let claw = 0; claw < 3 && particleIndex < particleCount; claw++) {
            const clawX = legX + 0.2 * scale;
            const clawY = legY - 1.5 * scale;
            const clawZ = legZ - 0.3 * scale + claw * 0.3 * scale;
            
            particles[particleIndex].userData.targetX = clawX;
            particles[particleIndex].userData.targetY = clawY;
            particles[particleIndex].userData.targetZ = clawZ;
            particles[particleIndex].userData.targetColor = getOutlineColor();
            particles[particleIndex].userData.isOutline = true;
            particleIndex++;
        }
    }
    
    // Chân trước phải
    for (let leg = 0; leg < legsPerSide; leg++) {
        const legX = headX - 1 * scale - leg * 2.5 * scale;
        const legY = -0.8 * scale;
        const legZ = 0.8 * scale;
        
        for (let i = 0; i < particlesPerLeg && particleIndex < particleCount; i++) {
            const t = i / particlesPerLeg;
            const x = legX;
            const y = legY - t * 1.5 * scale;
            const z = legZ;
            
            particles[particleIndex].userData.targetX = x;
            particles[particleIndex].userData.targetY = y;
            particles[particleIndex].userData.targetZ = z;
            particles[particleIndex].userData.targetColor = Math.random() > 0.5 ? getOutlineColor() : (Math.random() > 0.5 ? getFillColor() : getAccentColor());
            particles[particleIndex].userData.isOutline = false;
            particleIndex++;
        }
        
        // Móng vuốt
        for (let claw = 0; claw < 3 && particleIndex < particleCount; claw++) {
            const clawX = legX + 0.2 * scale;
            const clawY = legY - 1.5 * scale;
            const clawZ = legZ - 0.3 * scale + claw * 0.3 * scale;
            
            particles[particleIndex].userData.targetX = clawX;
            particles[particleIndex].userData.targetY = clawY;
            particles[particleIndex].userData.targetZ = clawZ;
            particles[particleIndex].userData.targetColor = getOutlineColor();
            particles[particleIndex].userData.isOutline = true;
            particleIndex++;
        }
    }
    
    // 4. ĐUÔI RỒNG (thuôn dài)
    const tailStartX = headX - 1.5 * scale - bodyLength;
    const tailStartY = Math.sin(1 * Math.PI * 1.5) * 1.2 * scale;
    const tailStartZ = Math.cos(1 * Math.PI * 1.5 * 0.8) * 1.2 * scale * 0.4;
    const tailLength = 4 * scale;
    const tailSegments = 20;
    const tailParticles = Math.floor(particleCount * 0.15);
    const particlesPerTailSegment = tailParticles / tailSegments;
    
    for (let s = 0; s < tailSegments && particleIndex < particleCount; s++) {
        const t = s / tailSegments;
        const x = tailStartX - t * tailLength;
        const y = tailStartY - t * 0.3 * scale;
        const z = tailStartZ + Math.sin(t * Math.PI * 2) * 0.2 * scale;
        
        const tailRadius = 0.4 * scale * (1 - t * 0.8);
        
        // Fill
        const fillCount = Math.floor(particlesPerTailSegment * 0.7);
        for (let i = 0; i < fillCount && particleIndex < particleCount; i++) {
            const angle = (i / fillCount) * Math.PI * 2;
            const radius = tailRadius * (0.3 + Math.random() * 0.4);
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            const offsetZ = (Math.random() - 0.5) * radius * 0.3;
            
            particles[particleIndex].userData.targetX = x + offsetX;
            particles[particleIndex].userData.targetY = y + offsetY;
            particles[particleIndex].userData.targetZ = z + offsetZ;
            particles[particleIndex].userData.targetColor = getFillColor();
            particles[particleIndex].userData.isOutline = false;
            particleIndex++;
        }
        
        // Outline
        const outlineCount = particlesPerTailSegment - fillCount;
        for (let i = 0; i < outlineCount && particleIndex < particleCount; i++) {
            const angle = (i / outlineCount) * Math.PI * 2;
            const radius = tailRadius * 1.1;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;
            const offsetZ = (Math.random() - 0.5) * radius * 0.2;
            
            particles[particleIndex].userData.targetX = x + offsetX;
            particles[particleIndex].userData.targetY = y + offsetY;
            particles[particleIndex].userData.targetZ = z + offsetZ;
            particles[particleIndex].userData.targetColor = getOutlineColor();
            particles[particleIndex].userData.isOutline = true;
            particleIndex++;
        }
    }
    
    // Đặt các particles còn lại xung quanh
    while (particleIndex < particleCount) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 2;
        const x = headX - 3 + Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 3;
        const z = Math.sin(angle) * radius;
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = getFillColor();
        particles[particleIndex].userData.isOutline = false;
        particleIndex++;
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


