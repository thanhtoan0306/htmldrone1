# Công cụ Giảm Đa giác 3D

Ứng dụng GUI để giảm số lượng đa giác trong file 3D (GLB, OBJ, PLY) sử dụng Open3D và PyQt6.

## Cài đặt

### 1. Cài đặt các thư viện cần thiết:

```bash
pip3 install -r requirements.txt
```

Hoặc cài đặt từng thư viện:

```bash
pip3 install open3d PyQt6 numpy
```

### 2. Chạy ứng dụng:

```bash
python3 reduce_vert.py
```

## Cách sử dụng

1. **Chọn file 3D**: Click nút "Duyệt" để chọn file GLB, OBJ hoặc PLY
2. **Nhập tỷ lệ**: Nhập tỷ lệ giữ lại (0.1 - 1.0), ví dụ:
   - `0.25` = giữ lại 25% đa giác (giảm 75%)
   - `0.5` = giữ lại 50% đa giác (giảm 50%)
   - `1.0` = giữ lại 100% (không giảm)
3. **Giảm đa giác**: Click "Giảm Đa giác và Lưu"
4. **Chọn nơi lưu**: Chọn vị trí và tên file để lưu kết quả

## Lưu ý

- File đầu vào: GLB, OBJ, PLY
- File đầu ra: PLY hoặc OBJ
- Tỷ lệ càng thấp, file càng nhẹ nhưng chất lượng có thể giảm
