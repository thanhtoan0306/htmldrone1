// Lớp Drone với vật lý thật
class DroneDot {
    constructor(scene, x, y, targetX, targetY, targetAngle, color = LOTUS_COLOR) {
        this.scene = scene;
        this.startX = x;
        this.startY = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.targetAngle = targetAngle;
        this.color = color;
        
        // Vị trí hiện tại
        this.x = x;
        this.y = y;
        
        // Vật lý
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.15;
        this.maxSpeed = 8;
        this.damping = 0.95; // Ma sát không khí
        
        // Trạng thái
        this.state = 'waiting'; // waiting, taking-off, forming, formed
        this.takeoffDelay = Math.random() * 1000; // Delay ngẫu nhiên
        this.takeoffStartTime = 0;
        this.formationProgress = 0;
        
        // Tạo sprite
        this.createSprite();
    }
    
    createSprite() {
        // Lưu alpha hiện tại nếu có
        const oldAlpha = this.sprite ? this.sprite.alpha : 0;
        
        // Xóa sprite cũ nếu có
        if (this.sprite) {
            this.sprite.destroy();
        }
        
        // Tạo texture key
        const textureKey = 'drone_' + this.color;
        
        // Tạo texture nếu chưa có
        if (!this.scene.textures.exists(textureKey)) {
            const graphics = this.scene.add.graphics();
            
            // Vẽ glow layer 1 (lớn nhất, mờ nhất)
            graphics.fillStyle(this.color, 0.3);
            graphics.fillCircle(8, 8, 8);
            
            // Vẽ glow layer 2 (trung bình)
            graphics.fillStyle(this.color, 0.6);
            graphics.fillCircle(8, 8, 6);
            
            // Chấm sáng chính
            graphics.fillStyle(this.color, 1);
            graphics.fillCircle(8, 8, 3);
            
            graphics.generateTexture(textureKey, 16, 16);
            graphics.destroy();
        }
        
        this.sprite = this.scene.add.sprite(this.x, this.y, textureKey);
        this.sprite.setBlendMode(Phaser.BlendModes.ADD);
        this.sprite.setAlpha(oldAlpha);
    }
    
    updateColor(newColor) {
        this.color = newColor;
        this.createSprite();
    }
    
    update() {
        const now = this.scene.time.now;
        
        switch(this.state) {
            case 'waiting':
                // Chờ đến lượt cất cánh
                if (now >= this.takeoffStartTime + this.takeoffDelay) {
                    this.state = 'taking-off';
                    this.sprite.setAlpha(0.3);
                }
                break;
                
            case 'taking-off':
                // Bay lên với gia tốc (áp dụng speed multiplier)
                this.velocityY -= this.acceleration * 1.5 * globalSpeedMultiplier;
                this.velocityX += (this.targetX - this.x) * 0.01 * globalSpeedMultiplier;
                
                // Giới hạn tốc độ
                const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
                const maxSpeed = this.maxSpeed * globalSpeedMultiplier;
                if (speed > maxSpeed) {
                    this.velocityX = (this.velocityX / speed) * maxSpeed;
                    this.velocityY = (this.velocityY / speed) * maxSpeed;
                }
                
                // Cập nhật vị trí
                this.x += this.velocityX;
                this.y += this.velocityY;
                
                // Tăng độ sáng khi bay lên
                this.sprite.setAlpha(Math.min(this.sprite.alpha + 0.02, 1));
                
                // Chuyển sang giai đoạn dàn hình khi đã bay lên đủ cao
                if (this.y < this.scene.scale.height * 0.6) {
                    this.state = 'forming';
                    this.formationProgress = 0;
                }
                break;
                
            case 'forming':
                // Dàn hình và kết hình - di chuyển đến vị trí đích
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 5) {
                    // Tính toán lực hướng về đích (áp dụng speed multiplier)
                    const forceX = (dx / distance) * this.acceleration * 2 * globalSpeedMultiplier;
                    const forceY = (dy / distance) * this.acceleration * 2 * globalSpeedMultiplier;
                    
                    // Áp dụng lực
                    this.velocityX += forceX;
                    this.velocityY += forceY;
                    
                    // Ma sát không khí
                    this.velocityX *= this.damping;
                    this.velocityY *= this.damping;
                    
                    // Giới hạn tốc độ
                    const currentSpeed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
                    const maxFormingSpeed = this.maxSpeed * 0.6 * globalSpeedMultiplier;
                    if (currentSpeed > maxFormingSpeed) {
                        this.velocityX = (this.velocityX / currentSpeed) * maxFormingSpeed;
                        this.velocityY = (this.velocityY / currentSpeed) * maxFormingSpeed;
                    }
                    
                    // Cập nhật vị trí
                    this.x += this.velocityX;
                    this.y += this.velocityY;
                    
                    // Cập nhật progress
                    this.formationProgress = 1 - (distance / 200);
                } else {
                    // Đã đến vị trí đích
                    this.state = 'formed';
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.velocityX = 0;
                    this.velocityY = 0;
                    // Không set alpha ở đây, để scene điều khiển hiệu ứng sáng
                }
                break;
                
            case 'formed':
                // Đã kết hình, giữ nguyên vị trí (rotation và alpha được điều khiển bởi scene)
                this.x = this.targetX;
                this.y = this.targetY;
                break;
        }
        
        // Cập nhật sprite
        this.sprite.setPosition(this.x, this.y);
    }
    
    startTakeoff(startTime) {
        this.takeoffStartTime = startTime;
    }
}
