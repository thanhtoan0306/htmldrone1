// Scene 3D chính cho Drone Show

class DroneShowScene3D {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.drones = [];
        this.formationPoints = [];
        this.centerX = 0;
        this.centerY = 0;
        this.centerZ = 0;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.001;
        this.isFormed = false;
        this.pulseTime = 0;
        this.pulseSpeed = 0.003;
        this.startTime = 0;
        this.currentFormation = 'lotus'; // lotus, clock
        this.transitionToClock = false;
        
        // Camera controls
        this.cameraDistance = 400;
        this.cameraAngleX = 0.3; // Nhìn xuống một chút
        this.cameraAngleY = 0;
        this.minDistance = 100;
        this.maxDistance = 2000;
        
        // Mouse controls
        this.isDragging = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        this.init();
    }
    
    init() {
        // Tạo scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Tạo camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
        this.updateCameraPosition();
        
        // Tạo renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Khởi tạo drones
        this.initDrones();
        
        // Setup controls
        this.setupControls();
        
        // Bắt đầu animation
        this.startShow();
        this.animate();
    }
    
    initDrones() {
        // Tạo formation points cho hoa sen ở trung tâm
        this.formationPoints = Formations3D.createLotus(this.centerX, this.centerY, this.centerZ);
        console.log('Đã tạo', this.formationPoints.length, 'formation points');
        
        // Tạo 500 drones bắt đầu từ dưới
        for (let i = 0; i < DRONE_COUNT; i++) {
            const point = this.formationPoints[i];
            const targetX = point.baseX + Math.cos(point.angle) * point.radius;
            const targetY = point.baseY + Math.sin(point.angle) * point.radius;
            const targetZ = point.z;
            
            // Vị trí xuất phát ngẫu nhiên ở dưới (gần camera hơn để nhìn thấy ngay)
            const startX = (Math.random() - 0.5) * 200;
            const startY = -100 - Math.random() * 50; // Gần hơn một chút
            const startZ = (Math.random() - 0.5) * 200;
            
            const drone = new Drone3D(
                this.scene,
                startX,
                startY,
                startZ,
                targetX,
                targetY,
                targetZ,
                point.angle,
                point.color
            );
            
            this.drones.push(drone);
        }
        
        console.log('Đã tạo', this.drones.length, 'drones');
    }
    
    setupControls() {
        // Mouse wheel để zoom
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY * 0.01;
            this.cameraDistance = Math.max(
                this.minDistance,
                Math.min(this.maxDistance, this.cameraDistance + delta)
            );
            this.updateCameraPosition();
        });
        
        // Mouse drag để xoay camera
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMouseX;
                const deltaY = e.clientY - this.lastMouseY;
                
                this.cameraAngleY += deltaX * 0.01;
                this.cameraAngleX += deltaY * 0.01;
                this.cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraAngleX));
                
                this.updateCameraPosition();
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            }
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        this.renderer.domElement.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });
        
        // Touch controls cho mobile
        let touchStartDistance = 0;
        let touchStartCameraDistance = 0;
        
        this.renderer.domElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
                touchStartCameraDistance = this.cameraDistance;
            } else if (e.touches.length === 1) {
                this.isDragging = true;
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        });
        
        this.renderer.domElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const scale = distance / touchStartDistance;
                this.cameraDistance = Math.max(
                    this.minDistance,
                    Math.min(this.maxDistance, touchStartCameraDistance / scale)
                );
                this.updateCameraPosition();
            } else if (e.touches.length === 1 && this.isDragging) {
                const deltaX = e.touches[0].clientX - this.lastMouseX;
                const deltaY = e.touches[0].clientY - this.lastMouseY;
                
                this.cameraAngleY += deltaX * 0.01;
                this.cameraAngleX += deltaY * 0.01;
                this.cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraAngleX));
                
                this.updateCameraPosition();
                
                this.lastMouseX = e.touches[0].clientX;
                this.lastMouseY = e.touches[0].clientY;
            }
        });
        
        this.renderer.domElement.addEventListener('touchend', () => {
            this.isDragging = false;
        });
    }
    
    updateCameraPosition() {
        const x = Math.sin(this.cameraAngleY) * Math.cos(this.cameraAngleX) * this.cameraDistance;
        const y = Math.sin(this.cameraAngleX) * this.cameraDistance;
        const z = Math.cos(this.cameraAngleY) * Math.cos(this.cameraAngleX) * this.cameraDistance;
        
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.centerX, this.centerY, this.centerZ);
        
        // Đảm bảo camera nhìn thấy scene
        console.log('Camera position:', this.camera.position);
        console.log('Camera looking at:', this.centerX, this.centerY, this.centerZ);
    }
    
    startShow() {
        this.startTime = Date.now();
        
        // Bắt đầu cất cánh cho tất cả drones
        this.drones.forEach(drone => {
            drone.startTakeoff(this.startTime);
        });
        
        // Chuyển sang đồng hồ kim sau 3 giây
        setTimeout(() => {
            this.transitionToClock = true;
            this.currentFormation = 'clock';
            this.formationPoints = Formations3D.createClock(this.centerX, this.centerY, this.centerZ);
            
            // Reset tất cả drones về trạng thái forming để bay đến vị trí mới
            this.drones.forEach((drone, index) => {
                if (index < this.formationPoints.length) {
                    const point = this.formationPoints[index];
                    drone.targetX = point.baseX + Math.cos(point.angle) * point.radius;
                    drone.targetY = point.baseY + Math.sin(point.angle) * point.radius;
                    drone.targetZ = point.z;
                    
                    // Reset về trạng thái forming
                    if (drone.state === 'formed') {
                        drone.state = 'forming';
                    }
                }
            });
        }, 3000);
        
        // Kiểm tra khi tất cả drones đã kết hình
        setTimeout(() => {
            this.isFormed = true;
        }, 12000);
    }
    
    update() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.startTime;
        
        // Cập nhật góc quay nếu đã kết hình và đang ở hình đồng hồ
        if (this.isFormed && this.currentFormation === 'clock') {
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
                    
                    // Vị trí trên hình dạng hiện tại
                    let currentAngle = point.angle;
                    
                    // Nếu là đồng hồ và đã kết hình, xoay các kim
                    if (this.currentFormation === 'clock' && this.isFormed) {
                        // Chỉ xoay các kim, không xoay vòng tròn ngoài
                        if (point.type && (point.type === 'hourHand' || point.type === 'minuteHand' || point.type === 'secondHand')) {
                            currentAngle = point.angle + this.rotationAngle;
                        }
                    } else if (this.currentFormation === 'lotus' && this.isFormed) {
                        // Xoay toàn bộ hoa sen
                        currentAngle = point.angle + this.rotationAngle;
                    }
                    
                    const targetX = point.baseX + Math.cos(currentAngle) * point.radius;
                    const targetY = point.baseY + Math.sin(currentAngle) * point.radius;
                    const targetZ = point.z;
                    
                    // Cập nhật vị trí đích
                    drone.targetX = targetX;
                    drone.targetY = targetY;
                    drone.targetZ = targetZ;
                    
                    // Hiệu ứng sáng dần từ tâm ra ngoài
                    if (this.isFormed && drone.state === 'formed') {
                        // Tính khoảng cách từ tâm (normalized 0-1)
                        const maxRadius = this.currentFormation === 'clock' ? 150 : 250;
                        const normalizedRadius = Math.min(point.radius / maxRadius, 1);
                        
                        // Tính độ sáng dựa trên vị trí và thời gian
                        const wavePhase = this.pulseTime - normalizedRadius * Math.PI * 2;
                        const brightness = 0.5 + 0.5 * Math.sin(wavePhase);
                        
                        // Áp dụng độ sáng
                        drone.setBrightness(brightness);
                    }
                }
                
                // Cập nhật drone
                drone.update(elapsed);
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
