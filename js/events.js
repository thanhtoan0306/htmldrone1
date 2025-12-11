// Xử lý sự kiện Window Resize
function setupEvents() {
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    App.camera.aspect = window.innerWidth / window.innerHeight;
    App.camera.updateProjectionMatrix();
    App.renderer.setSize(window.innerWidth, window.innerHeight);
}


