// Quản lý chuyển đổi giữa các đội hình
function switchFormation() {
    // Không cho phép chuyển đổi khi đang trong quá trình transition
    if (App.particleSystem && App.particleSystem.isTransitioning) {
        return;
    }
    
    if (App.currentFormation === 'jellyfish') {
        // Chuyển sang hoa hướng dương
        App.currentFormation = 'sunflower';
        setSunflowerFormation();
        updateInfo('🌻 Hoa Hướng Dương 3D - Đang chuyển đổi...');
        
        // Cập nhật text sau khi transition xong
        setTimeout(() => {
            updateInfo('🌻 Hoa Hướng Dương 3D');
        }, App.particleSystem.transitionDuration * 1000);
    } else {
        // Chuyển về sứa
        App.currentFormation = 'jellyfish';
        setJellyfishFormation();
        updateInfo('🌊 Sứa Neon 3D - Đang chuyển đổi...');
        
        // Cập nhật text sau khi transition xong
        setTimeout(() => {
            updateInfo('🌊 Sứa Neon 3D');
        }, App.particleSystem.transitionDuration * 1000);
    }
}

function updateInfo(text) {
    const infoDiv = document.querySelector('.info');
    if (infoDiv) {
        infoDiv.textContent = text;
    }
}
