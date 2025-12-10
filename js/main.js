// File chính khởi chạy ứng dụng
function init() {
    initScene();
    createParticleSystem();
    initializeParticles(1000); // Tạo 1000 particles
    setJellyfishFormationInitial(); // Bắt đầu với đội hình sứa (không transition)
    createOceanParticles();
    setupEvents();
    App.lastFrameTime = performance.now() / 1000;
    animate();
}

// Khởi chạy ứng dụng
init();
