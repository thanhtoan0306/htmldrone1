import sys
import os
import open3d as o3d
import numpy as np
from PyQt6.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, 
    QPushButton, QLabel, QLineEdit, QFileDialog, QMessageBox,
    QTextEdit, QProgressBar
)

# --- PHẦN LOGIC XỬ LÝ 3D (Open3D) ---
def decimate_mesh(input_path, output_path, target_vertices):
    """Thực hiện giảm đỉnh bằng Open3D và trả về kết quả."""
    try:
        # Đọc mô hình
        mesh = o3d.io.read_triangle_mesh(input_path)
        if not mesh.has_vertices():
            return 0, 0, 0, 0, "Lỗi: Mô hình không chứa đỉnh."

        num_vertices_original = len(np.asarray(mesh.vertices))
        num_triangles_original = len(np.asarray(mesh.triangles))
        
        # Đảm bảo số đỉnh đích không vượt quá số đỉnh gốc
        target_vertices = min(target_vertices, num_vertices_original)
        
        # Nếu số đỉnh mục tiêu bằng số đỉnh gốc, không cần giảm
        if target_vertices >= num_vertices_original:
            o3d.io.write_triangle_mesh(output_path, mesh)
            return num_vertices_original, num_vertices_original, num_triangles_original, num_triangles_original, "Thành công! (Không cần giảm)"

        # Tính số tam giác mục tiêu dựa trên số đỉnh
        # Công thức Euler: V - E + F = 2 (cho mesh đóng)
        # Với mesh tam giác: E ≈ 3F/2, nên F ≈ 2V - 4
        # Để an toàn, dùng tỷ lệ ~1.5-2 tam giác/đỉnh
        target_triangles = max(1, int(target_vertices * 1.8))

        # Giảm đa giác (sử dụng thuật toán QEM)
        mesh_decimated = mesh.simplify_quadric_decimation(
            target_number_of_triangles=target_triangles
        )

        num_vertices_decimated = len(np.asarray(mesh_decimated.vertices))
        num_triangles_decimated = len(np.asarray(mesh_decimated.triangles))

        # Lưu mô hình đã giảm
        o3d.io.write_triangle_mesh(output_path, mesh_decimated)

        return num_vertices_original, num_vertices_decimated, num_triangles_original, num_triangles_decimated, "Thành công!"

    except Exception as e:
        return 0, 0, 0, 0, f"Lỗi xử lý: {e}"

# --- PHẦN GIAO DIỆN NGƯỜI DÙNG (PyQt6) ---
class DecimationApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Công cụ Giảm Đỉnh 3D")
        self.input_files = []
        self.output_folder = ""
        self.init_ui()

    def init_ui(self):
        # Thiết lập Layout chính
        main_layout = QVBoxLayout()

        # 1. Chọn File(s) Đầu vào
        file_layout = QHBoxLayout()
        self.input_label = QLabel("File Đầu vào:")
        self.input_path_display = QLineEdit("Chưa chọn file (.glb, .obj, .ply)")
        self.input_path_display.setReadOnly(True)
        self.browse_button = QPushButton("Duyệt File")
        self.browse_button.clicked.connect(self.browse_input_files)
        
        file_layout.addWidget(self.input_label)
        file_layout.addWidget(self.input_path_display)
        file_layout.addWidget(self.browse_button)
        main_layout.addLayout(file_layout)

        # 2. Chọn Folder Đầu ra
        output_layout = QHBoxLayout()
        self.output_label = QLabel("Folder Đầu ra:")
        self.output_path_display = QLineEdit("Chưa chọn folder")
        self.output_path_display.setReadOnly(True)
        self.browse_output_button = QPushButton("Duyệt Folder")
        self.browse_output_button.clicked.connect(self.browse_output_folder)
        
        output_layout.addWidget(self.output_label)
        output_layout.addWidget(self.output_path_display)
        output_layout.addWidget(self.browse_output_button)
        main_layout.addLayout(output_layout)

        # 3. Số đỉnh cần giảm
        vertices_layout = QHBoxLayout()
        self.vertices_label = QLabel("Số đỉnh cần giảm (target):")
        self.vertices_input = QLineEdit("1000") # Mặc định 1000 đỉnh
        vertices_layout.addWidget(self.vertices_label)
        vertices_layout.addWidget(self.vertices_input)
        main_layout.addLayout(vertices_layout)

        # 4. Nút Thực hiện
        self.decimate_button = QPushButton("Giảm Đỉnh Tất Cả File")
        self.decimate_button.clicked.connect(self.perform_decimation)
        main_layout.addWidget(self.decimate_button)

        # 5. Progress Bar
        self.progress_bar = QProgressBar()
        self.progress_bar.setVisible(False)
        main_layout.addWidget(self.progress_bar)

        # 6. Hiển thị Kết quả
        self.status_label = QLabel("Trạng thái: Sẵn sàng.")
        main_layout.addWidget(self.status_label)
        
        # 7. Log kết quả
        self.log_text = QTextEdit()
        self.log_text.setReadOnly(True)
        self.log_text.setMaximumHeight(200)
        main_layout.addWidget(self.log_text)

        self.setLayout(main_layout)

    def browse_input_files(self):
        # Mở hộp thoại chọn file (cho phép chọn nhiều file)
        file_paths, _ = QFileDialog.getOpenFileNames(
            self, 
            "Chọn File 3D",
            "",
            "3D Models (*.glb *.obj *.ply *.GLB *.OBJ *.PLY);;All Files (*)"
        )
        if file_paths:
            self.input_files = file_paths
            if len(file_paths) == 1:
                self.input_path_display.setText(os.path.basename(file_paths[0]))
            else:
                self.input_path_display.setText(f"{len(file_paths)} file đã chọn")
            self.status_label.setText(f"Trạng thái: Đã chọn {len(file_paths)} file.")
    
    def browse_output_folder(self):
        # Mở hộp thoại chọn folder đầu ra
        folder_path = QFileDialog.getExistingDirectory(
            self, 
            "Chọn Folder lưu kết quả"
        )
        if folder_path:
            self.output_folder = folder_path
            self.output_path_display.setText(folder_path)

    def perform_decimation(self):
        # 1. Kiểm tra đầu vào
        if not self.input_files:
            QMessageBox.warning(self, "Lỗi", "Vui lòng chọn file đầu vào.")
            return
        
        if not self.output_folder:
            QMessageBox.warning(self, "Lỗi", "Vui lòng chọn folder đầu ra.")
            return
        
        try:
            target_vertices = int(self.vertices_input.text())
            if target_vertices <= 0:
                QMessageBox.warning(self, "Lỗi", "Số đỉnh phải lớn hơn 0.")
                return
        except ValueError:
            QMessageBox.critical(self, "Lỗi", "Số đỉnh không hợp lệ. Vui lòng nhập số nguyên.")
            return

        # 2. Sử dụng danh sách file đã chọn
        files = self.input_files

        # 3. Hiển thị progress bar
        self.progress_bar.setVisible(True)
        self.progress_bar.setMaximum(len(files))
        self.progress_bar.setValue(0)
        self.log_text.clear()
        self.status_label.setText(f"Trạng thái: Đang xử lý {len(files)} file...")
        QApplication.processEvents()

        # 4. Xử lý từng file
        success_count = 0
        error_count = 0
        
        for idx, input_file in enumerate(files):
            try:
                # Tạo tên file đầu ra
                base_name = os.path.splitext(os.path.basename(input_file))[0]
                output_file = os.path.join(self.output_folder, f"{base_name}_decimated.ply")
                
                # Thực hiện giảm đỉnh
                v_orig, v_dec, t_orig, t_dec, status = decimate_mesh(
                    input_file, 
                    output_file, 
                    target_vertices
                )
                
                if "Thành công" in status:
                    success_count += 1
                    log_msg = f"✅ {os.path.basename(input_file)}: {v_orig:,} → {v_dec:,} đỉnh ({t_orig:,} → {t_dec:,} tam giác)\n"
                    self.log_text.append(log_msg)
                else:
                    error_count += 1
                    log_msg = f"❌ {os.path.basename(input_file)}: {status}\n"
                    self.log_text.append(log_msg)
                
            except Exception as e:
                error_count += 1
                log_msg = f"❌ {os.path.basename(input_file)}: Lỗi - {str(e)}\n"
                self.log_text.append(log_msg)
            
            # Cập nhật progress
            self.progress_bar.setValue(idx + 1)
            self.status_label.setText(f"Đang xử lý: {idx + 1}/{len(files)}")
            QApplication.processEvents()

        # 5. Hiển thị kết quả tổng kết
        self.progress_bar.setVisible(False)
        self.status_label.setText(f"Hoàn tất! Thành công: {success_count}, Lỗi: {error_count}")
        
        summary = f"\n{'='*50}\nTổng kết:\n- Thành công: {success_count}/{len(files)}\n- Lỗi: {error_count}/{len(files)}\n- Folder đầu ra: {self.output_folder}\n"
        self.log_text.append(summary)
        
        QMessageBox.information(
            self, 
            "Hoàn tất", 
            f"Đã xử lý {len(files)} file!\n\nThành công: {success_count}\nLỗi: {error_count}\n\nKết quả đã lưu tại:\n{self.output_folder}"
        )

# --- Khởi chạy Ứng dụng ---
if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = DecimationApp()
    window.show()
    sys.exit(app.exec())