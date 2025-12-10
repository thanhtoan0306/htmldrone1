// Các hàm tạo hình dạng

class Formations {
    static createMoon(centerX, centerY, count = DRONE_COUNT) {
        const points = [];
        const moonRadius = 80;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radiusVariation = moonRadius + (Math.random() - 0.5) * 20;
            
            points.push({
                angle: angle,
                radius: radiusVariation,
                baseX: centerX,
                baseY: centerY,
                color: COLORS.moon
            });
        }
        
        return points;
    }
    
    static createLotus(centerX, centerY, count = DRONE_COUNT) {
        const points = [];
        
        // Nhụy hoa sen (tâm) - chi tiết hơn
        const stamenLayers = [8, 12, 16, 20];
        stamenLayers.forEach((stamenCount, layerIndex) => {
            const stamenRadius = 5 + layerIndex * 3;
            for (let i = 0; i < stamenCount; i++) {
                const angle = (i / stamenCount) * Math.PI * 2;
                const radius = stamenRadius;
                points.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    color: LOTUS_COLOR,
                    layer: 'stamen',
                    layerIndex: layerIndex
                });
            }
        });
        
        // Các lớp cánh hoa sen - chi tiết hơn
        const petalLayers = [
            {radius: 25, petals: 8, density: 3},   // Lớp trong cùng
            {radius: 40, petals: 12, density: 4},  // Lớp 2
            {radius: 60, petals: 16, density: 5}, // Lớp 3
            {radius: 85, petals: 20, density: 6},  // Lớp 4
            {radius: 115, petals: 24, density: 7}, // Lớp 5
            {radius: 150, petals: 28, density: 8}, // Lớp 6
            {radius: 190, petals: 32, density: 9}, // Lớp 7
            {radius: 235, petals: 36, density: 10}  // Lớp ngoài cùng
        ];
        
        petalLayers.forEach((layer, layerIndex) => {
            // Điểm trên mỗi cánh
            for (let petalIndex = 0; petalIndex < layer.petals; petalIndex++) {
                const baseAngle = (petalIndex / layer.petals) * Math.PI * 2;
                
                // Tạo nhiều điểm trên mỗi cánh để tạo hình dạng cánh hoa
                for (let pointIndex = 0; pointIndex < layer.density; pointIndex++) {
                    // Tạo hình dạng cánh hoa (oval)
                    const petalProgress = pointIndex / layer.density;
                    const petalRadius = layer.radius * (0.3 + petalProgress * 0.7);
                    const petalWidth = layer.radius * 0.15 * (1 - Math.abs(petalProgress - 0.5) * 2);
                    
                    // Thêm điểm chính trên cánh
                    const angle = baseAngle;
                    const x = centerX + Math.cos(angle) * petalRadius;
                    const y = centerY + Math.sin(angle) * petalRadius;
                    points.push({
                        x: x,
                        y: y,
                        color: LOTUS_COLOR,
                        layer: 'petal',
                        layerIndex: layerIndex,
                        radius: petalRadius
                    });
                    
                    // Thêm điểm phụ để tạo độ dày cho cánh
                    if (pointIndex > 0 && pointIndex < layer.density - 1) {
                        const offsetAngle = baseAngle + (Math.random() - 0.5) * 0.3;
                        const offsetX = centerX + Math.cos(offsetAngle) * petalRadius;
                        const offsetY = centerY + Math.sin(offsetAngle) * petalRadius;
                        points.push({
                            x: offsetX,
                            y: offsetY,
                            color: LOTUS_COLOR,
                            layer: 'petal',
                            layerIndex: layerIndex,
                            radius: petalRadius
                        });
                    }
                }
            }
        });
        
        // Thêm các điểm chi tiết giữa các cánh
        const detailPoints = Math.floor((count - points.length) * 0.3);
        for (let i = 0; i < detailPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 200;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({
                x: x,
                y: y,
                color: LOTUS_COLOR,
                layer: 'detail',
                radius: radius
            });
        }
        
        // Điền đủ điểm
        while (points.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 220;
            points.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                color: LOTUS_COLOR,
                layer: 'fill',
                radius: radius
            });
        }
        
        // Chuyển đổi sang format chuẩn
        return points.slice(0, count).map(point => {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            const angle = Math.atan2(dy, dx);
            const radius = point.radius || Math.sqrt(dx * dx + dy * dy);
            return {
                angle: angle,
                radius: radius,
                baseX: centerX,
                baseY: centerY,
                color: point.color,
                layer: point.layer || 'fill',
                layerIndex: point.layerIndex || 0
            };
        });
    }
    
    static createWang(centerX, centerY, count = DRONE_COUNT) {
        const points = [];
        const scale = 2;
        
        // Chữ Vương (王) - 3 nét ngang và 1 nét dọc
        // Nét ngang 1
        for (let x = -40; x <= 40; x += 5) {
            points.push({x: centerX + x * scale, y: centerY - 50 * scale, color: COLORS.wang});
        }
        // Nét ngang 2
        for (let x = -40; x <= 40; x += 5) {
            points.push({x: centerX + x * scale, y: centerY, color: COLORS.wang});
        }
        // Nét ngang 3
        for (let x = -40; x <= 40; x += 5) {
            points.push({x: centerX + x * scale, y: centerY + 50 * scale, color: COLORS.wang});
        }
        // Nét dọc
        for (let y = -50; y <= 50; y += 5) {
            points.push({x: centerX, y: centerY + y * scale, color: COLORS.wang});
        }
        
        // Điền đủ điểm
        while (points.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 60;
            points.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                color: COLORS.wang
            });
        }
        
        // Chuyển đổi sang format chuẩn
        return points.slice(0, count).map(point => {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            const angle = Math.atan2(dy, dx);
            const radius = Math.sqrt(dx * dx + dy * dy);
            return {
                angle: angle,
                radius: radius,
                baseX: centerX,
                baseY: centerY,
                color: point.color
            };
        });
    }
    
    static createCat(centerX, centerY, count = DRONE_COUNT) {
        const points = [];
        const scale = 1.5;
        
        // Đầu mèo (hình tròn)
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const radius = 40;
            points.push({
                x: centerX + Math.cos(angle) * radius * scale,
                y: centerY - 20 + Math.sin(angle) * radius * scale,
                color: COLORS.cat
            });
        }
        
        // Tai trái
        for (let i = 0; i < 8; i++) {
            const angle = Math.PI * 0.7 + (i / 8) * 0.3;
            const radius = 25;
            points.push({
                x: centerX - 30 + Math.cos(angle) * radius * scale,
                y: centerY - 50 + Math.sin(angle) * radius * scale,
                color: COLORS.cat
            });
        }
        
        // Tai phải
        for (let i = 0; i < 8; i++) {
            const angle = Math.PI * 0.2 + (i / 8) * 0.3;
            const radius = 25;
            points.push({
                x: centerX + 30 + Math.cos(angle) * radius * scale,
                y: centerY - 50 + Math.sin(angle) * radius * scale,
                color: COLORS.cat
            });
        }
        
        // Mắt trái
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 8;
            points.push({
                x: centerX - 15 + Math.cos(angle) * radius * scale,
                y: centerY - 20 + Math.sin(angle) * radius * scale,
                color: COLORS.cat
            });
        }
        
        // Mắt phải
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 8;
            points.push({
                x: centerX + 15 + Math.cos(angle) * radius * scale,
                y: centerY - 20 + Math.sin(angle) * radius * scale,
                color: COLORS.cat
            });
        }
        
        // Mũi
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const radius = 5;
            points.push({
                x: centerX + Math.cos(angle) * radius * scale,
                y: centerY - 5 + Math.sin(angle) * radius * scale,
                color: COLORS.cat
            });
        }
        
        // Miệng
        points.push({x: centerX, y: centerY + 10, color: COLORS.cat});
        points.push({x: centerX - 10, y: centerY + 15, color: COLORS.cat});
        points.push({x: centerX + 10, y: centerY + 15, color: COLORS.cat});
        
        // Thân (hình oval)
        for (let i = 0; i < 25; i++) {
            const angle = (i / 25) * Math.PI * 2;
            const radiusX = 35;
            const radiusY = 50;
            points.push({
                x: centerX + Math.cos(angle) * radiusX * scale,
                y: centerY + 30 + Math.sin(angle) * radiusY * scale,
                color: COLORS.cat
            });
        }
        
        // Điền đủ điểm
        while (points.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 60;
            points.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                color: COLORS.cat
            });
        }
        
        // Chuyển đổi sang format chuẩn
        return points.slice(0, count).map(point => {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            const angle = Math.atan2(dy, dx);
            const radius = Math.sqrt(dx * dx + dy * dy);
            return {
                angle: angle,
                radius: radius,
                baseX: centerX,
                baseY: centerY,
                color: point.color
            };
        });
    }
    
    static create(formationType, centerX, centerY, count = DRONE_COUNT) {
        switch(formationType) {
            case 'moon':
                return this.createMoon(centerX, centerY, count);
            case 'lotus':
                return this.createLotus(centerX, centerY, count);
            case 'wang':
                return this.createWang(centerX, centerY, count);
            case 'cat':
                return this.createCat(centerX, centerY, count);
            default:
                return this.createMoon(centerX, centerY, count);
        }
    }
}
