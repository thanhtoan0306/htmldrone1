// Các hàm tạo hình dạng 3D

class Formations3D {
    static createLotus(centerX, centerY, centerZ, count = DRONE_COUNT) {
        const points = [];
        
        // Nhụy hoa sen (tâm) - chi tiết
        const stamenLayers = [6, 10, 14];
        stamenLayers.forEach((stamenCount, layerIndex) => {
            const stamenRadius = 5 + layerIndex * 3;
            for (let i = 0; i < stamenCount; i++) {
                const angle = (i / stamenCount) * Math.PI * 2;
                const radius = stamenRadius;
                const z = centerZ + (Math.random() - 0.5) * 2; // Thêm độ sâu 3D
                points.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    z: z,
                    color: LOTUS_COLOR,
                    layer: 'stamen',
                    layerIndex: layerIndex
                });
            }
        });
        
        // Các lớp cánh hoa sen - chi tiết hơn
        const petalLayers = [
            {radius: 30, petals: 8, density: 3, zSpread: 1},
            {radius: 50, petals: 12, density: 4, zSpread: 2},
            {radius: 75, petals: 16, density: 5, zSpread: 3},
            {radius: 105, petals: 20, density: 6, zSpread: 4},
            {radius: 140, petals: 24, density: 7, zSpread: 5},
            {radius: 180, petals: 28, density: 8, zSpread: 6},
            {radius: 225, petals: 32, density: 9, zSpread: 7}
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
                    
                    // Thêm điểm chính trên cánh
                    const angle = baseAngle;
                    const x = centerX + Math.cos(angle) * petalRadius;
                    const y = centerY + Math.sin(angle) * petalRadius;
                    const z = centerZ + (Math.random() - 0.5) * layer.zSpread; // Độ sâu 3D
                    points.push({
                        x: x,
                        y: y,
                        z: z,
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
                        const offsetZ = centerZ + (Math.random() - 0.5) * layer.zSpread;
                        points.push({
                            x: offsetX,
                            y: offsetY,
                            z: offsetZ,
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
            const z = centerZ + (Math.random() - 0.5) * 8;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({
                x: x,
                y: y,
                z: z,
                color: LOTUS_COLOR,
                layer: 'detail',
                radius: radius
            });
        }
        
        // Điền đủ điểm
        while (points.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 220;
            const z = centerZ + (Math.random() - 0.5) * 10;
            points.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                z: z,
                color: LOTUS_COLOR,
                layer: 'fill',
                radius: radius
            });
        }
        
        // Chuyển đổi sang format chuẩn
        return points.slice(0, count).map(point => {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            const dz = point.z - centerZ;
            const angle = Math.atan2(dy, dx);
            const radius = point.radius || Math.sqrt(dx * dx + dy * dy);
            return {
                angle: angle,
                radius: radius,
                baseX: centerX,
                baseY: centerY,
                baseZ: centerZ,
                z: point.z,
                color: point.color,
                layer: point.layer || 'fill',
                layerIndex: point.layerIndex || 0
            };
        });
    }
    
    static createClock(centerX, centerY, centerZ, count = DRONE_COUNT) {
        const points = [];
        const clockRadius = 150;
        
        // Vòng tròn ngoài đồng hồ
        const circlePoints = Math.floor(count * 0.3);
        for (let i = 0; i < circlePoints; i++) {
            const angle = (i / circlePoints) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * clockRadius;
            const y = centerY + Math.sin(angle) * clockRadius;
            const z = centerZ + (Math.random() - 0.5) * 2;
            points.push({
                x: x,
                y: y,
                z: z,
                color: LOTUS_COLOR,
                type: 'circle'
            });
        }
        
        // Kim giờ (12 giờ = 0 độ, quay theo chiều kim đồng hồ)
        const hourHandLength = clockRadius * 0.6;
        const hourHandPoints = Math.floor(count * 0.15);
        for (let i = 0; i < hourHandPoints; i++) {
            const progress = i / hourHandPoints;
            const angle = -Math.PI / 2; // 12 giờ (hướng lên)
            const x = centerX + Math.cos(angle) * progress * hourHandLength;
            const y = centerY + Math.sin(angle) * progress * hourHandLength;
            const z = centerZ + (Math.random() - 0.5) * 1;
            points.push({
                x: x,
                y: y,
                z: z,
                color: LOTUS_COLOR,
                type: 'hourHand'
            });
        }
        
        // Kim phút (dài hơn)
        const minuteHandLength = clockRadius * 0.8;
        const minuteHandPoints = Math.floor(count * 0.15);
        for (let i = 0; i < minuteHandPoints; i++) {
            const progress = i / minuteHandPoints;
            const angle = -Math.PI / 2 + Math.PI / 6; // 1 giờ (30 độ)
            const x = centerX + Math.cos(angle) * progress * minuteHandLength;
            const y = centerY + Math.sin(angle) * progress * minuteHandLength;
            const z = centerZ + (Math.random() - 0.5) * 1;
            points.push({
                x: x,
                y: y,
                z: z,
                color: LOTUS_COLOR,
                type: 'minuteHand'
            });
        }
        
        // Kim giây (dài nhất)
        const secondHandLength = clockRadius * 0.9;
        const secondHandPoints = Math.floor(count * 0.1);
        for (let i = 0; i < secondHandPoints; i++) {
            const progress = i / secondHandPoints;
            const angle = -Math.PI / 2 + Math.PI / 3; // 2 giờ (60 độ)
            const x = centerX + Math.cos(angle) * progress * secondHandLength;
            const y = centerY + Math.sin(angle) * progress * secondHandLength;
            const z = centerZ + (Math.random() - 0.5) * 1;
            points.push({
                x: x,
                y: y,
                z: z,
                color: LOTUS_COLOR,
                type: 'secondHand'
            });
        }
        
        // Các số trên đồng hồ (12, 3, 6, 9)
        const numbers = [
            {angle: -Math.PI / 2, value: 12}, // 12 giờ
            {angle: 0, value: 3},            // 3 giờ
            {angle: Math.PI / 2, value: 6},  // 6 giờ
            {angle: Math.PI, value: 9}       // 9 giờ
        ];
        
        numbers.forEach(num => {
            const numPoints = Math.floor(count * 0.05);
            for (let i = 0; i < numPoints; i++) {
                const offsetAngle = num.angle + (Math.random() - 0.5) * 0.3;
                const radius = clockRadius * 0.85 + (Math.random() - 0.5) * 10;
                const x = centerX + Math.cos(offsetAngle) * radius;
                const y = centerY + Math.sin(offsetAngle) * radius;
                const z = centerZ + (Math.random() - 0.5) * 2;
                points.push({
                    x: x,
                    y: y,
                    z: z,
                    color: LOTUS_COLOR,
                    type: 'number'
                });
            }
        });
        
        // Tâm đồng hồ
        const centerPoints = Math.floor(count * 0.1);
        for (let i = 0; i < centerPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 10;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const z = centerZ + (Math.random() - 0.5) * 2;
            points.push({
                x: x,
                y: y,
                z: z,
                color: LOTUS_COLOR,
                type: 'center'
            });
        }
        
        // Điền đủ điểm
        while (points.length < count) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * clockRadius;
            const z = centerZ + (Math.random() - 0.5) * 3;
            points.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                z: z,
                color: LOTUS_COLOR,
                type: 'fill'
            });
        }
        
        // Chuyển đổi sang format chuẩn
        return points.slice(0, count).map(point => {
            const dx = point.x - centerX;
            const dy = point.y - centerY;
            const dz = point.z - centerZ;
            const angle = Math.atan2(dy, dx);
            const radius = Math.sqrt(dx * dx + dy * dy);
            return {
                angle: angle,
                radius: radius,
                baseX: centerX,
                baseY: centerY,
                baseZ: centerZ,
                z: point.z,
                color: point.color,
                type: point.type || 'fill'
            };
        });
    }
}
