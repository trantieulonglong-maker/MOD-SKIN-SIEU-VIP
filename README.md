# FISH MOD Z · ALOK — Model 24 (dựng lại từ MHT)

Website phối trang phục nhân vật Alok, dựng lại từ bản lưu `FISH MOD Z ALOK — MODEL 24.mht`
(nguồn gốc: `https://mgazg.github.io/modff/`, lưu bằng Chrome/Blink ngày 14/10/2026).
Thuần HTML5 + CSS3 + Vanilla JS, không framework, không backend, không thư viện ngoài, mọi đường dẫn đều tương đối.

## Chạy website

- **Mở trực tiếp:** nhấp đúp `index.html` (chạy được cả khi mở bằng `file://`).
- **Localhost:** trong thư mục này chạy `python3 -m http.server 8000` rồi mở `http://localhost:8000/`.
- **GitHub Pages:** tạo repo, upload toàn bộ nội dung thư mục này (để `index.html` ở gốc repo),
  vào *Settings → Pages → Deploy from a branch → main / (root)*. Đã có sẵn `.nojekyll`.

## Cấu trúc

```
index.html            giao diện (markup khôi phục từ MHT)
css/style.css         toàn bộ CSS gốc (không gồm @media)
css/responsive.css    toàn bộ @media gốc, phải nạp sau style.css
js/main.js            logic dựng lại (KHÔNG phải code gốc)
assets/icons/         7 icon danh mục .webp (trích nguyên bản từ MHT)
```

Không có thư mục `assets/fonts` hay `assets/images`: bản gốc dùng font hệ thống (`system-ui`) và không có ảnh nào khác ngoài 7 icon.

## Đã khôi phục nguyên bản từ MHT

- Toàn bộ HTML: thanh đầu, tiêu đề, khung xem trước, 8 ô chọn (phiên bản + 7 danh mục), chân trang.
- Toàn bộ danh sách trang phục: Tóc 41, Áo 52, Quần 45, Chân 27, Nạ 24, Mặt 3, Hành động 29
  (giữ nguyên `value` và `data-item-id` của từng mục).
- Toàn bộ CSS (5 tệp) và 7 icon. Thứ tự cascade được giữ nguyên nên giao diện khớp bản gốc.
- Tên, nội dung chữ, màu sắc, bố cục, responsive (breakpoint 860 / 640 / 520 / 500 / 440 px).

## Dựng lại từ hành vi nhìn thấy (không xác minh được với code gốc)

MHT của Chrome **không lưu JavaScript**, nên phần logic dưới đây được viết lại dựa trên giao diện và CSS:

- Hộp chọn trang phục (dialog, tìm kiếm không dấu, đánh dấu mục đang chọn). Cấu trúc lấy từ `item-picker.css`.
- Đổi phiên bản, cập nhật nhãn nền tảng, tóm tắt "Bộ đang chọn".
- Nút **Phối ngẫu nhiên** (đổi cả 7 danh mục) và **Bộ mặc định**. Gốc có đổi cả "Hành động" khi phối hay không thì không xác định được.
- Menu hamburger. Các mục menu gốc không có trong MHT, nên đây là 3 liên kết cuộn trong trang: Phối đồ, Bộ đang chọn, Thông tin.
- Hai nút tải xuống được **đổi chức năng**: xuất cấu hình bộ đồ thành `.json` (xem bên dưới).

## Không khôi phục được

1. **Xem trước 3D** (Three.js + mô hình nhân vật). Thư viện và dữ liệu mô hình nằm trong script/khối `alok-data`
   mà MHT không lưu. Ngay trong bản MHT, trang cũng đang ở trạng thái "chưa chạy được 3D".
   Vì vậy nút **Xoay** và **Đặt lại** để `disabled` (có chú thích trên giao diện). Ảnh xem trước dự phòng `#fallback` cũng không có ảnh nguồn nên đã bỏ.
2. **Tạo file mod thật** ("Tạo file mod · 1.81 MB", "Tạo 4 phiên bản"). Bản gốc dùng `fflate` và `LZMA-JS`
   (có ghi trong comment giấy phép) cùng dữ liệu `alok-data`, tất cả đều không có trong MHT. Không thể tạo lại file mod
   nếu không có dữ liệu gốc, và code này **không giả lập** điều đó. Hai nút được đổi nhãn cho đúng thực tế:
   **Lưu bộ đồ (.json)** và **Lưu cả 4 phiên bản (.json)**. Kích thước "1.81 MB" bị bỏ vì không còn ý nghĩa.
3. **Overlay tiến trình** (`#mod-progress`) chỉ xuất hiện khi tạo mod nên không có trong DOM. CSS được giữ lại nhưng chưa dùng.
4. CSS còn dư của các thành phần không có trong DOM: màn chọn phiên bản (`.version-*`, `.choice-*`, `.package-*`),
   `.presets`, `.fixed-value`, `.action-note`. Giữ nguyên trong `style.css` để đối chiếu.

Muốn khôi phục đầy đủ: cần file nguồn gốc (script, `alok-data`, thư viện 3D và nén) từ chủ sở hữu trang gốc.

## Đã kiểm tra

Playwright + Chromium headless: desktop 1280 px, Pixel 5, 768 px, 360 px và `file://`. Kết quả: không lỗi console,
không request lỗi/404, không tràn ngang, 7/7 icon hiển thị, mọi tương tác hoạt động (chọn, tìm kiếm, ngẫu nhiên, mặc định,
đổi phiên bản, menu, lưu JSON). **Chưa kiểm tra** trên Safari, Firefox hoặc thiết bị Android thật.
Nếu trình duyệt không hỗ trợ `<dialog>`, trang tự dùng ô chọn `<select>` gốc.

## Bản quyền

Free Fire và nhân vật Alok là tài sản của Garena. Dự án này không liên kết với Garena.
