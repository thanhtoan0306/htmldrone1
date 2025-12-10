// Scene chính cho Drone Show

class DroneShowScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DroneShowScene' });
    }
    
    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // Background đen (mặc định của Phaser)
        
        // Tâm hoa sen ở giữa màn hình
        this.centerX = width / 2;
        this.centerY = height / 2;
        
        // Góc quay của hoa sen
        this.rotationAngle = 0;
        this.rotationSpeed = 0.001; // Tốc độ quay (radian per frame)
        this.isFormed = false;
        
        // Hiệu ứng sáng
        this.pulseTime = 0;
        this.pulseSpeed = 0.003; // Tốc độ hiệu ứng sáng
        
        // Khởi tạo drones
        this.drones = [];
        this.formationPoints = [];
        this.initDrones();
        
        // Bắt đầu trình diễn
        this.startShow();
    }
    
    initDrones() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // Xóa drones cũ nếu có
        if (this.drones) {
            this.drones.forEach(drone => {
                if (drone.sprite) drone.sprite.destroy();
            });
        }
        this.drones = [];
        
        // Tạo formation points cho hoa sen ở giữa màn hình
        this.formationPoints = Formations.createLotus(this.centerX, this.centerY);
        
        // Tạo 100 drones bắt đầu từ dưới màn hình
        for (let i = 0; i < DRONE_COUNT; i++) {
            const point = this.formationPoints[i];
            const targetX = point.baseX + Math.cos(point.angle) * point.radius;
            const targetY = point.baseY + Math.sin(point.angle) * point.radius;
            
            // Vị trí xuất phát ngẫu nhiên ở dưới màn hình
            const startX = width * 0.3 + Math.random() * width * 0.4;
            const startY = height + 20 + Math.random() * 30;
            
            const drone = new DroneDot(
                this,
                startX,
                startY,
                targetX,
                targetY,
                point.angle,
                point.color
            );
            
            this.drones.push(drone);
        }
    }
    
    startShow() {
        const startTime = this.time.now;
        
        // Bắt đầu cất cánh cho tất cả drones
        this.drones.forEach(drone => {
            drone.startTakeoff(startTime);
        });
        
        // Kiểm tra khi tất cả drones đã kết hình
        this.time.delayedCall(12000, () => {
            this.isFormed = true;
        });
    }
    
    update() {
        // Cập nhật góc quay nếu đã kết hình
        if (this.isFormed) {
            this.rotationAngle += this.rotationSpeed;
        }
        
        // Cập nhật hiệu ứng sáng
        this.pulseTime += this.pulseSpeed;
        if (this.pulseTime >= Math.PI * 2) {
            this.pulseTime -= Math.PI * 2;
        }
        
        // Cập nhật vị trí đích cho các drones
        if (this.formationPoints && this.drones) {
            this.drones.forEach((drone, index) => {
                if (index < this.formationPoints.length) {
                    const point = this.formationPoints[index];
                    
                    // Vị trí trên hoa sen (có rotation nếu đã kết hình)
                    const currentAngle = point.angle + (this.isFormed ? this.rotationAngle : 0);
                    const targetX = point.baseX + Math.cos(currentAngle) * point.radius;
                    const targetY = point.baseY + Math.sin(currentAngle) * point.radius;
                    
                    // Cập nhật vị trí đích
                    drone.targetX = targetX;
                    drone.targetY = targetY;
                    
                    // Hiệu ứng sáng dần từ tâm ra ngoài
                    if (this.isFormed && drone.state === 'formed') {
                        // Tính khoảng cách từ tâm (normalized 0-1)
                        const maxRadius = 250; // Bán kính lớn nhất của hoa sen
                        const normalizedRadius = Math.min(point.radius / maxRadius, 1);
                        
                        // Tính độ sáng dựa trên vị trí và thời gian
                        // Sóng sáng lan từ tâm ra ngoài
                        const wavePhase = this.pulseTime - normalizedRadius * Math.PI * 2;
                        const brightness = 0.5 + 0.5 * Math.sin(wavePhase);
                        
                        // Áp dụng độ sáng
                        drone.sprite.setAlpha(brightness);
                    }
                }
                
                // Cập nhật drone
                drone.update();
            });
        }
    }
}
