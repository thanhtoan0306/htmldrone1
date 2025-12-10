// Xử lý sự kiện Mouse và Window Resize
function setupEvents() {
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onMouseMove(event) {
    App.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    App.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    App.camera.aspect = window.innerWidth / window.innerHeight;
    App.camera.updateProjectionMatrix();
    App.renderer.setSize(window.innerWidth, window.innerHeight);
}
