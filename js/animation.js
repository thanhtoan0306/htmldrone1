// Vòng lặp Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Tính deltaTime
    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - App.lastFrameTime;
    App.lastFrameTime = currentTime;
    
    App.time += 0.01;

    // Cập nhật transition nếu đang chuyển đổi
    if (App.particleSystem && App.particleSystem.isTransitioning) {
        updateParticleTransition(deltaTime);
        // Vẫn cho phép xoay group khi transition
        const particleGroup = App.particleSystem.particleGroup;
        particleGroup.rotation.x = App.mouseY * 0.2;
        particleGroup.rotation.y += App.mouseX * 0.005 + 0.001;
    } else {
        // Animation bình thường khi không transition
        animateParticles();
    }

    // Animation cho ocean particles
    animateOceanParticles();

    App.renderer.render(App.scene, App.camera);
}

function animateParticles() {
    if (!App.particleSystem || !App.particleSystem.particles) return;
    
    const particles = App.particleSystem.particles;
    const particleGroup = App.particleSystem.particleGroup;
    
    if (App.currentFormation === 'jellyfish') {
        particles.forEach(particle => {
            // Lấy target position từ userData
            const targetX = particle.userData.targetX;
            const targetY = particle.userData.targetY;
            const targetZ = particle.userData.targetZ;
            
            // Animation nhẹ nhàng xung quanh vị trí target
            const pulse = Math.sin(App.time * 2 + particle.userData.phase) * 0.15;
            particle.position.y = targetY + pulse;
            
            const breathe = 1 + Math.sin(App.time * 1.5) * 0.1;
            particle.position.x = targetX * breathe;
            particle.position.z = targetZ * breathe;
            
            particle.material.opacity = 0.6 + Math.sin(App.time * 3 + particle.userData.phase) * 0.2;
        });
        
        // Floating motion cho toàn bộ group
        particleGroup.position.y = Math.sin(App.time * 0.8) * 1;
        particleGroup.rotation.y += 0.002;
        
        // Mouse interaction
        particleGroup.rotation.x = App.mouseY * 0.3;
        particleGroup.rotation.y += App.mouseX * 0.01;
        
    } else if (App.currentFormation === 'sunflower') {
        particles.forEach(particle => {
            const targetX = particle.userData.targetX;
            const targetY = particle.userData.targetY;
            const targetZ = particle.userData.targetZ;
            
            // Animation nhẹ nhàng
            const pulse = Math.sin(App.time * 1.5 + particle.userData.phase) * 0.1;
            const sway = Math.cos(App.time * 1.2 + particle.userData.index * 0.1) * 0.1;
            
            particle.position.x = targetX + sway;
            particle.position.y = targetY + pulse;
            particle.position.z = targetZ + sway;
            
            particle.material.opacity = 0.7 + Math.sin(App.time * 2 + particle.userData.phase) * 0.2;
        });
        
        // Floating motion cho toàn bộ group
        particleGroup.position.y = Math.sin(App.time * 0.6) * 0.8;
        particleGroup.rotation.y += 0.003;
        
        // Mouse interaction
        particleGroup.rotation.x = App.mouseY * 0.2;
        particleGroup.rotation.y += App.mouseX * 0.01;
    }
}

function animateOceanParticles() {
    // Tìm ocean particles
    const oceanParticles = App.scene.children.find(child => child instanceof THREE.Points);
    if (oceanParticles) {
        oceanParticles.rotation.y += 0.001;
    }
}

// Các hàm animation cũ đã được thay thế bằng animateParticles()
