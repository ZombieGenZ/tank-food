# TANK-Food - Hệ thống đặt đồ ăn nhanh trực tuyến 🍔🍟

## Giới thiệu ℹ️
TANK-Food là một nền tảng đặt đồ ăn nhanh trực tuyến, cung cấp giải pháp tiện lợi cho khách hàng và doanh nghiệp. Hệ thống hỗ trợ quản lý bán hàng, theo dõi doanh thu, thông báo realtime, quản lý đơn hàng, và nhiều tính năng hữu ích khác.

---

## Tính năng nổi bật 🌟
- **Đặt hàng trực tuyến**: Giao diện thân thiện, dễ sử dụng.
- **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng theo thời gian thực.
- **Hệ thống voucher**: Tích hợp mã giảm giá và khuyến mãi.
- **Thống kê doanh thu**: Biểu đồ trực quan, theo dõi hiệu suất kinh doanh.
- **Thông báo realtime**: Cập nhật trạng thái đơn hàng và thông báo hệ thống.
- **Hỗ trợ đa ngôn ngữ**: Tiếng Việt và Tiếng Anh.
- **Hệ thống thanh toán**: Tích hợp cổng thanh toán nội địa và quốc tế.
- **Hệ thống giám sát hiệu năng máy chủ**: Theo dõi hiệu suất server với Python hoặc Rust và WPF C# client.

---

## Công nghệ sử dụng 🛠️

### **1. Frontend** 🌐
- **Ngôn ngữ**: TypeScript, JavaScript, HTML, CSS.
- **Thư viện & Framework**:
  - **React.js**: Xây dựng giao diện người dùng.
  - **Tailwind CSS**: Thiết kế giao diện nhanh chóng.
  - **Ant Design**: Bộ công cụ UI chuyên nghiệp.
  - **Mantine UI**: Hỗ trợ giao diện hiện đại.
  - **Material-UI**: Bộ công cụ UI hiện đại.
  - **Framer Motion**: Hiệu ứng động mượt mà.
  - **Recharts**: Biểu đồ trực quan.
  - **React Router**: Quản lý điều hướng.
  - **AOS**: Hiệu ứng cuộn trang.
  - **Lucide React**: Biểu tượng SVG.
  - **React Leaflet**: Tích hợp bản đồ.
  - **GSAP**: Hiệu ứng hoạt hình nâng cao.
  - **React Simple Keyboard**: Bàn phím ảo.
  - **Socket.io Client**: Giao tiếp realtime.

---

### **2. Backend** ⚙️
- **Ngôn ngữ**: TypeScript, JavaScript.
- **Framework**: Express.js.
- **Công nghệ khác**:
  - **Socket.io**: Giao tiếp realtime.
  - **Firebase**: Lưu trữ dữ liệu realtime.
  - **Gemini API**: Tích hợp trí tuệ nhân tạo.
  - **Node-cron**: Lập lịch tự động.
  - **Express Validator**: Kiểm tra dữ liệu đầu vào.
  - **Nodemailer**: Gửi email tự động.
  - **dotenv**: Quản lý biến môi trường.

---

### **3. Cơ sở dữ liệu** 🗄️
- **MongoDB**: Cơ sở dữ liệu NoSQL mạnh mẽ.

---

### **4. Hệ thống thanh toán** 💳
- **Sepay**: Cổng thanh toán nội địa và quốc tế.

---

### **5. Hệ thống thông báo** 🔔
- **Discord Bot**: Gửi thông báo hệ thống.
- **Email (Nodemailer)**: Gửi thông báo quan trọng.

---

### **6. Công cụ phát triển** 🛠️
- **Vite**: Công cụ build nhanh.
- **ESLint**: Kiểm tra và sửa lỗi code.
- **TypeScript**: Ngôn ngữ lập trình mạnh mẽ.
- **Concurrently**: Chạy nhiều lệnh cùng lúc.
- **Tailwind CSS**: Tích hợp với PostCSS.

---

## Hướng dẫn cài đặt 🚀

### **Yêu cầu hệ thống**
- **Node.js**: Phiên bản >= 22.x.
- **MongoDB**: Cơ sở dữ liệu NoSQL.
- **Git**: Tự động cập nhật code mới nhất từ Github.

### **Cài đặt**
1. Clone dự án:
   ```bash
   git clone https://github.com/ZombieGenZ/tank-food.git
   cd tank-food
   ```

2. Tạo ``.env`` và dựa vào tệp ``.env.example`` để điền các thông tin cần thiết

3. Cài đặt dependencies và chạy dự án:
   - **Chạy thủ công**:
     - Cài đặt dependencies:
       ```bash
       cd client
       npm install
       cd ../server
       npm install
       ```
     - Chạy dự án:
       ```bash
       cd client
       npm run dev
       cd server
       npm run dev
       ```

   - **Chạy tự động**:
     - **Windows**:
       - Sử dụng các file `run-dev-all.bat` hoặc `run-release-all.bat` để tự động cài đặt dependencies và chạy toàn bộ client và server.
       - Để chạy từng phần, sử dụng `run-dev.bat` hoặc `run-release.bat` trong thư mục `client` hoặc `server`.
     - **Linux/Mac**:
       - Sử dụng các file `run-dev-all.sh` hoặc `run-release-all.sh` để tự động cài đặt dependencies và chạy toàn bộ client và server.
       - Để chạy từng phần, sử dụng `run-dev.sh` hoặc `run-release.sh` trong thư mục `client` hoặc `server`.

Xem chi tiết hơn trong [Hướng dẩn cài đặt](./INSTALLATION_STEPS.md).

---

## Bản quyền 📜
Dự án này được phát hành theo giấy phép MIT. Xem chi tiết trong tệp `LICENSE`.

---

## Liên hệ 📞
- **Website**: [tank-food.io.vn](https://tank-food.io.vn/) 🌐
- **Discord**: [TANK-Food Support](https://discord.gg/7SkzMkFWYN) 💬
- **Email**: support@tank-food.io.vn 📧

---

## Đội ngũ phát triển 👥

| Tên                        | Vai Trò                  |
|----------------------------|-------------------------|
| Nguyễn Đặng Thành Thái     | 👨‍💼 Quản Lý Dự Án & 💻 Lập Trình Frontend |
| Nguyễn Đình Nam            | 💻 Lập Trình Frontend    |
| Nguyễn Đức Anh             | 💻 Lập Trình Backend    |
| Bùi Đăng Khoa              | 💻 Lập Trình Backend    |

---
