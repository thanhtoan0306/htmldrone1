# Drone Show - Phaser 3

Dự án mô phỏng drone light show sử dụng Phaser 3 với code được phân tách thành các module riêng biệt.

## Cấu trúc dự án

```
phaser3/
├── index.html              # File HTML chính
├── css/
│   └── style.css          # Stylesheet
├── js/
│   ├── config.js          # Cấu hình và constants
│   ├── Drone.js           # Class DroneDot
│   ├── Formations.js      # Các hàm tạo hình dạng
│   ├── DroneShowScene.js  # Scene chính
│   └── main.js            # Khởi tạo game và controls
└── README.md              # File này
```

## Mô tả các file

### `index.html`
File HTML chính, chứa cấu trúc trang và liên kết đến các file CSS/JS.

### `css/style.css`
Chứa tất cả các style cho giao diện người dùng.

### `js/config.js`
- Định nghĩa các constants (màu sắc, số lượng drone)
- Biến global (tốc độ, hình dạng hiện tại)
- Tên hình dạng

### `js/Drone.js`
Class `DroneDot` - đại diện cho một drone:
- Vật lý bay (gia tốc, vận tốc, ma sát)
- Các trạng thái: waiting, taking-off, forming, formed
- Tạo sprite với hiệu ứng glow
- Cập nhật vị trí và màu sắc

### `js/Formations.js`
Class `Formations` với các phương thức static để tạo hình dạng:
- `createMoon()` - Hình mặt trăng
- `createLotus()` - Hình hoa sen
- `createWang()` - Chữ Hán "Vương"
- `createCat()` - Hình con mèo
- `create()` - Factory method

### `js/DroneShowScene.js`
Scene chính của Phaser 3:
- Tạo background không gian
- Tạo Trái đất
- Quản lý quỹ đạo
- Khởi tạo và cập nhật drones
- Xử lý chuyển đổi hình dạng

### `js/main.js`
- Khởi tạo game Phaser 3
- Xử lý các controls (restart, pause, speed, formation)
- Xử lý resize window

## Tính năng

- ✅ 100 drones với vật lý thực tế
- ✅ 4 hình dạng: Mặt trăng, Hoa sen, Chữ Vương, Con mèo
- ✅ Màu sắc khác nhau cho mỗi hình dạng
- ✅ Điều chỉnh tốc độ với slider
- ✅ Quỹ đạo quay quanh Trái đất
- ✅ Hiệu ứng glow và blend mode

## Cách sử dụng

1. Mở `index.html` trong trình duyệt
2. Sử dụng các nút để:
   - Khởi động lại show
   - Tạm dừng/Tiếp tục
   - Điều chỉnh tốc độ
   - Chuyển đổi giữa các hình dạng

## Phát triển

Để thêm hình dạng mới:
1. Thêm màu vào `COLORS` trong `config.js`
2. Thêm tên vào `FORMATION_NAMES` trong `config.js`
3. Tạo phương thức mới trong `Formations.js`
4. Thêm case vào `Formations.create()`
5. Thêm nút vào `index.html`

## Dependencies

- Phaser 3.80.1 (CDN)
