// Khởi tạo Scene, Camera, Renderer và Lights
function initScene() {
    // Scene
    App.scene = new THREE.Scene();
    App.scene.fog = new THREE.Fog(0x000000, 20, 60);

    // Camera
    App.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    App.camera.position.z = 15;
    App.camera.position.y = 2;

    // Renderer
    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(App.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x111111, 0.3);
    App.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0080, 1.5, 50);
    pointLight.position.set(0, 10, 10);
    App.scene.add(pointLight);
}

