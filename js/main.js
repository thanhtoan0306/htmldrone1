// File chính khởi chạy ứng dụng
function init() {
    initScene();
    createParticleSystem();
    initializeParticles(1000); // Tạo 1000 particles
    // Không tạo đội hình ban đầu - chờ input từ user
    createOceanParticles();
    setupEvents();
    App.lastFrameTime = performance.now() / 1000;
    animate();
    
    // Hiển thị input panel
    setTimeout(() => {
        showInputPanel();
    }, 100);
}

// Khởi chạy ứng dụng
init();

