// Main game initialization

let droneScene;

function initScene() {
    // Đợi DOM và Three.js load xong
    if (typeof THREE === 'undefined') {
        console.error('Three.js chưa được tải!');
        setTimeout(initScene, 100);
        return;
    }
    
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Không tìm thấy canvas-container!');
        setTimeout(initScene, 100);
        return;
    }
    
    try {
        droneScene = new DroneShowScene3D(container);
        console.log('Scene đã được khởi tạo thành công!');
    } catch (error) {
        console.error('Lỗi khi khởi tạo scene:', error);
    }
}

// Xử lý resize
window.addEventListener('resize', () => {
    if (droneScene) {
        droneScene.onWindowResize();
    }
});

// Khởi động scene khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScene);
} else {
    // DOM đã sẵn sàng
    window.addEventListener('load', initScene);
}
