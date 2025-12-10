// Lớp Drone 3D với vật lý thật

class Drone3D {
    constructor(scene, startX, startY, startZ, targetX, targetY, targetZ, targetAngle, color = LOTUS_COLOR) {
        this.scene = scene;
        this.startX = startX;
        this.startY = startY;
        this.startZ = startZ;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetZ = targetZ;
        this.targetAngle = targetAngle;
        this.color = color;
        
        // Vị trí hiện tại
        this.x = startX;
        this.y = startY;
        this.z = startZ;
        
        // Vật lý
        this.velocityX = 0;
        this.velocityY = 0;
        this.velocityZ = 0;
        this.acceleration = 0.15;
        this.maxSpeed = 8;
        this.damping = 0.95; // Ma sát không khí
        
        // Trạng thái
        this.state = 'waiting'; // waiting, taking-off, forming, formed
        this.takeoffDelay = Math.random() * 1000; // Delay ngẫu nhiên
        this.takeoffStartTime = 0;
        this.formationProgress = 0;
        
        // Tạo mesh 3D
        this.createMesh();
    }
    
    createMesh() {
        // Tạo geometry cho drone (sphere nhỏ với glow)
        const geometry = new THREE.SphereGeometry(1, 8, 8); // Tăng kích thước lên 1 để dễ nhìn thấy
        
        // Material với color để tạo hiệu ứng sáng
        const material = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.x, this.y, this.z);
        
        // Thêm glow effect bằng cách tạo sphere lớn hơn với alpha thấp
        const glowGeometry = new THREE.SphereGeometry(2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            opacity: 0
        });
        this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        this.mesh.add(this.glowMesh);
        
        this.scene.add(this.mesh);
    }
    
    updateColor(newColor) {
        this.color = newColor;
        if (this.mesh) {
            this.mesh.material.color.setHex(newColor);
            if (this.glowMesh) {
                this.glowMesh.material.color.setHex(newColor);
            }
        }
    }
    
    update(time) {
        switch(this.state) {
            case 'waiting':
                // Chờ đến lượt cất cánh
                if (time >= this.takeoffStartTime + this.takeoffDelay) {
                    this.state = 'taking-off';
                    this.mesh.material.opacity = 0.3;
                }
                break;
                
            case 'taking-off':
                // Bay lên với gia tốc (áp dụng speed multiplier)
                this.velocityY += this.acceleration * 1.5 * globalSpeedMultiplier;
                this.velocityX += (this.targetX - this.x) * 0.01 * globalSpeedMultiplier;
                this.velocityZ += (this.targetZ - this.z) * 0.01 * globalSpeedMultiplier;
                
                // Giới hạn tốc độ
                const speed = Math.sqrt(
                    this.velocityX * this.velocityX + 
                    this.velocityY * this.velocityY + 
                    this.velocityZ * this.velocityZ
                );
                const maxSpeed = this.maxSpeed * globalSpeedMultiplier;
                if (speed > maxSpeed) {
                    this.velocityX = (this.velocityX / speed) * maxSpeed;
                    this.velocityY = (this.velocityY / speed) * maxSpeed;
                    this.velocityZ = (this.velocityZ / speed) * maxSpeed;
                }
                
                // Cập nhật vị trí
                this.x += this.velocityX;
                this.y += this.velocityY;
                this.z += this.velocityZ;
                
                // Tăng độ sáng khi bay lên
                this.mesh.material.opacity = Math.min(this.mesh.material.opacity + 0.02, 1);
                
                // Chuyển sang giai đoạn dàn hình khi đã bay lên đủ cao
                if (this.y > -150) {
                    this.state = 'forming';
                    this.formationProgress = 0;
                }
                break;
                
            case 'forming':
                // Dàn hình và kết hình - di chuyển đến vị trí đích
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const dz = this.targetZ - this.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance > 2) {
                    // Tính toán lực hướng về đích (áp dụng speed multiplier)
                    const forceX = (dx / distance) * this.acceleration * 2 * globalSpeedMultiplier;
                    const forceY = (dy / distance) * this.acceleration * 2 * globalSpeedMultiplier;
                    const forceZ = (dz / distance) * this.acceleration * 2 * globalSpeedMultiplier;
                    
                    // Áp dụng lực
                    this.velocityX += forceX;
                    this.velocityY += forceY;
                    this.velocityZ += forceZ;
                    
                    // Ma sát không khí
                    this.velocityX *= this.damping;
                    this.velocityY *= this.damping;
                    this.velocityZ *= this.damping;
                    
                    // Giới hạn tốc độ
                    const currentSpeed = Math.sqrt(
                        this.velocityX * this.velocityX + 
                        this.velocityY * this.velocityY + 
                        this.velocityZ * this.velocityZ
                    );
                    const maxFormingSpeed = this.maxSpeed * 0.6 * globalSpeedMultiplier;
                    if (currentSpeed > maxFormingSpeed) {
                        this.velocityX = (this.velocityX / currentSpeed) * maxFormingSpeed;
                        this.velocityY = (this.velocityY / currentSpeed) * maxFormingSpeed;
                        this.velocityZ = (this.velocityZ / currentSpeed) * maxFormingSpeed;
                    }
                    
                    // Cập nhật vị trí
                    this.x += this.velocityX;
                    this.y += this.velocityY;
                    this.z += this.velocityZ;
                    
                    // Cập nhật progress
                    this.formationProgress = 1 - (distance / 200);
                } else {
                    // Đã đến vị trí đích
                    this.state = 'formed';
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.z = this.targetZ;
                    this.velocityX = 0;
                    this.velocityY = 0;
                    this.velocityZ = 0;
                }
                break;
                
            case 'formed':
                // Đã kết hình, giữ nguyên vị trí
                this.x = this.targetX;
                this.y = this.targetY;
                this.z = this.targetZ;
                break;
        }
        
        // Cập nhật mesh position
        this.mesh.position.set(this.x, this.y, this.z);
    }
    
    setBrightness(brightness) {
        if (this.mesh && this.mesh.material) {
            this.mesh.material.opacity = Math.max(0.3, brightness); // Đảm bảo tối thiểu 0.3 để luôn nhìn thấy
            if (this.glowMesh && this.glowMesh.material) {
                this.glowMesh.material.opacity = brightness * 0.3;
            }
        }
    }
    
    startTakeoff(startTime) {
        this.takeoffStartTime = startTime;
    }
}
