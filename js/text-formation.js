// Tạo đội hình từ text input
function createFormationFromText() {
    const input = document.getElementById('formationInput');
    const text = input.value.trim().toLowerCase();
    const panel = document.getElementById('inputPanel');
    
    if (!text) {
        alert('Vui lòng nhập tên đội hình!');
        return;
    }
    
    // Ẩn panel và hiện nút NEXT
    panel.classList.add('hidden');
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.classList.add('visible');
    }
    
    // Map text thành đội hình
    let formationType = null;
    
    // Kiểm tra các từ khóa
    if (text.includes('jellyfish') || text.includes('sứa') || text.includes('jelly')) {
        formationType = 'jellyfish';
        setJellyfishFormation();
        updateInfo('🌊 Sứa Neon 3D - Đang tạo...');
    } else if (text.includes('sunflower') || text.includes('hướng dương') || text.includes('hoa')) {
        formationType = 'sunflower';
        setSunflowerFormation();
        updateInfo('🌻 Hoa Hướng Dương 3D - Đang tạo...');
    } else if (text.includes('tiger') || text.includes('hổ') || text.includes('mặt hổ')) {
        formationType = 'tiger';
        setTigerFaceFormation();
        updateInfo('🐅 Mặt Hổ Neon 3D - Đang tạo...');
    } else if (text.includes('dragon') || text.includes('rồng') || text.includes('long')) {
        formationType = 'dragon';
        setDragonFormation();
        updateInfo('🐉 Rồng Bay Lượn 3D - Đang tạo...');
    } else {
        // Tạo đội hình từ text tự do (hiển thị text)
        formationType = 'custom';
        createTextFormation(text);
        updateInfo(`✨ ${text.toUpperCase()} - Đang tạo...`);
    }
    
    App.currentFormation = formationType;
    
    // Cập nhật text sau khi transition xong
    setTimeout(() => {
        if (formationType === 'custom') {
            updateInfo(`✨ ${text.toUpperCase()}`);
        } else {
            const names = {
                'jellyfish': '🌊 Sứa Neon 3D',
                'sunflower': '🌻 Hoa Hướng Dương 3D',
                'tiger': '🐅 Mặt Hổ Neon 3D',
                'dragon': '🐉 Rồng Bay Lượn 3D'
            };
            updateInfo(names[formationType]);
        }
    }, App.particleSystem.transitionDuration * 1000);
}

function createTextFormation(text) {
    const particles = App.particleSystem.particles;
    const particleCount = particles.length;
    
    // Tạo đội hình từ text - sắp xếp particles theo pattern text
    const textLength = text.length;
    const particlesPerChar = Math.floor(particleCount / textLength);
    
    // Màu sắc ngẫu nhiên cho text
    const colors = [0xff0080, 0x9d00ff, 0x00ffff, 0xffff00, 0xff3366, 0x00ff88];
    
    let particleIndex = 0;
    const scale = 1.2; // Tăng từ 0.3 lên 1.2
    const spacing = 2.5; // Tăng từ 0.8 lên 2.5 - khoảng cách giữa các ký tự
    
    // Tạo từng ký tự (đơn giản hóa - tạo pattern dựa trên vị trí ký tự)
    for (let charIndex = 0; charIndex < textLength && particleIndex < particleCount; charIndex++) {
        const char = text[charIndex];
        const charCode = char.charCodeAt(0);
        
        // Vị trí cơ bản của ký tự
        const baseX = (charIndex - textLength / 2) * spacing;
        const baseY = 0;
        const baseZ = 0;
        
        // Tạo pattern dựa trên mã ký tự - giãn xa hơn
        for (let i = 0; i < particlesPerChar && particleIndex < particleCount; i++) {
            const t = i / particlesPerChar;
            const angle = (t * Math.PI * 2) + (charCode * 0.1);
            const radius = 1.5 + Math.sin(charCode * 0.1) * 0.8; // Tăng từ 0.5-0.8 lên 1.5-2.3
            
            // Thêm variation để giãn xa hơn
            const spreadX = Math.cos(angle) * radius * (1 + Math.random() * 0.5);
            const spreadY = Math.sin(angle) * radius * (1 + Math.random() * 0.5);
            const spreadZ = (Math.random() - 0.5) * 1.5; // Tăng từ 0.5 lên 1.5
            
            const x = baseX + spreadX;
            const y = baseY + spreadY;
            const z = baseZ + spreadZ;
            
            particles[particleIndex].userData.targetX = x * scale;
            particles[particleIndex].userData.targetY = y * scale;
            particles[particleIndex].userData.targetZ = z;
            
            // Màu dựa trên ký tự
            const colorIndex = charCode % colors.length;
            particles[particleIndex].userData.targetColor = colors[colorIndex];
            particleIndex++;
        }
    }
    
    // Đặt các particles còn lại xung quanh - giãn xa hơn
    while (particleIndex < particleCount) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 4 + Math.random() * 3; // Tăng từ 2-4 lên 4-7
        const x = Math.cos(angle) * radius * scale;
        const y = Math.sin(angle) * radius * scale;
        const z = (Math.random() - 0.5) * 2.5; // Tăng từ 1 lên 2.5
        
        particles[particleIndex].userData.targetX = x;
        particles[particleIndex].userData.targetY = y;
        particles[particleIndex].userData.targetZ = z;
        particles[particleIndex].userData.targetColor = colors[Math.floor(Math.random() * colors.length)];
        particleIndex++;
    }
    
    startTransition();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        createFormationFromText();
    }
}

function showInputPanel() {
    const panel = document.getElementById('inputPanel');
    panel.classList.remove('hidden');
    const input = document.getElementById('formationInput');
    input.focus();
    input.value = '';
    
    // Ẩn nút NEXT khi hiển thị input
    const nextButton = document.querySelector('.next-button');
    if (nextButton) {
        nextButton.classList.remove('visible');
    }
}
