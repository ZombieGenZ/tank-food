# Hướng dẫn cài đặt và chạy dự án TANK-Food

Hướng dẫn này sẽ giúp bạn cài đặt và chạy dự án TANK-Food một cách nhanh chóng và hiệu quả. Hãy làm theo các bước dưới đây để bắt đầu.

## Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo rằng hệ thống của bạn đáp ứng các yêu cầu sau:

- **Node.js**: Phiên bản 22.x trở lên. Đây là môi trường chạy JavaScript cần thiết để vận hành cả client và server của dự án.
  - [Tải xuống Node.js](https://nodejs.org/en/download)
- **Git**: Phiên bản 2.0 trở lên. Công cụ này giúp bạn tải mã nguồn từ GitHub và quản lý phiên bản.
  - [Tải xuống Git](https://git-scm.com/downloads)

Ngoài ra, bạn cần một terminal (Command Prompt trên Windows, Terminal trên Linux/Mac) để thực hiện các lệnh.

---

## Cài đặt

### 1. Cài đặt Node.js
Node.js là nền tảng chính để chạy dự án. Hãy làm theo các bước sau để cài đặt:

1. Truy cập [trang tải xuống Node.js](https://nodejs.org/en/download).
2. Chọn phiên bản phù hợp với hệ điều hành của bạn (Windows, macOS, hoặc Linux). Đề xuất tải phiên bản LTS (Long-Term Support) để đảm bảo ổn định.
3. Tải xuống và chạy file cài đặt.
4. Làm theo hướng dẫn của trình cài đặt (thường chỉ cần nhấn "Next" và đồng ý với các điều khoản).
5. Sau khi cài đặt xong, mở terminal và kiểm tra phiên bản bằng các lệnh sau:
   ```bash
   node -v
   npm -v
   ```
   - Nếu kết quả trả về dạng `v22.x.x` (cho Node.js) và `v10.x.x` (cho npm), bạn đã cài đặt thành công.

### 2. Cài đặt Git
Git cho phép bạn tải mã nguồn từ GitHub. Hãy làm theo các bước sau:

1. Truy cập [trang tải xuống Git](https://git-scm.com/downloads).
2. Chọn phiên bản phù hợp với hệ điều hành của bạn.
3. Tải xuống và chạy file cài đặt.
4. Trong quá trình cài đặt, giữ các tùy chọn mặc định hoặc điều chỉnh theo nhu cầu (ví dụ: thêm Git vào PATH để sử dụng trong terminal).
5. Sau khi cài đặt xong, mở terminal và kiểm tra phiên bản bằng lệnh:
   ```bash
   git --version
   ```
   - Nếu kết quả trả về dạng `git version 2.x.x`, bạn đã cài đặt thành công.

### 3. Thiết lập MongoDB trên Cloud (MongoDB Atlas)

Dự án TANK-Food có thể sử dụng MongoDB Atlas - một dịch vụ cơ sở dữ liệu NoSQL trên cloud - thay vì cài đặt cục bộ. Làm theo các bước sau để thiết lập:

1. **Truy cập MongoDB Atlas**:
   - Vào [trang web MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Nhấn vào nút "Try Free" hoặc "Get Started Free" để tạo tài khoản nếu bạn chưa có. Đăng nhập nếu đã có tài khoản.

2. **Tạo một Cluster miễn phí**:
   - Sau khi đăng nhập, chọn "Build a Cluster" hoặc "Create a Cluster".
   - Chọn gói **Free Tier** (miễn phí) nếu bạn chỉ muốn thử nghiệm. Nếu cần cho sản xuất, chọn gói trả phí phù hợp.
   - Chọn nhà cung cấp cloud (AWS, Google Cloud, hoặc Azure) và khu vực (region) gần bạn nhất để tối ưu tốc độ.
   - Nhấn "Create Cluster" và chờ vài phút để cluster được khởi tạo.

3. **Tạo tài khoản Database User**:
   - Trong giao diện Atlas, vào mục **Database Access** (trên menu bên trái).
   - Nhấn "Add New Database User".
   - Đặt tên người dùng và mật khẩu (ghi lại thông tin này vì sẽ cần cho file `.env`).
   - Chọn quyền "Read and write to any database" và nhấn "Add User".

4. **Cấu hình kết nối IP**:
   - Vào mục **Network Access** (trên menu bên trái).
   - Nhấn "Add IP Address".
   - Chọn "Allow Access from Anywhere" (0.0.0.0/0) để cho phép kết nối từ mọi nơi (dùng cho thử nghiệm). Nếu triển khai thực tế, chỉ thêm IP của máy chủ hoặc mạng của bạn.
   - Nhấn "Confirm".

### 4. Tải mã nguồn dự án
Sau khi cài đặt các công cụ cần thiết, bạn cần tải mã nguồn TANK-Food từ GitHub:

1. Mở terminal và di chuyển đến thư mục bạn muốn lưu dự án:
   ```bash
   cd /đường/dẫn/đến/thư/mục
   ```
2. Clone dự án từ GitHub:
   ```bash
   git clone https://github.com/ZombieGenZ/tank-food.git
   ```
3. Di chuyển vào thư mục dự án:
   ```bash
   cd tank-food
   ```

### 5. Cấu hình file `.env`
Dự án yêu cầu file `.env` để lưu trữ các biến môi trường (ví dụ: thông tin kết nối MongoDB, cổng thanh toán, v.v.). Làm theo các bước sau:

1. Tìm file mẫu `.env.example` trong thư mục dự án.
2. Sao chép file này và đổi tên thành `.env`:
   ```bash
   copy .env.example .env
   cp .env.example .env
   ```
3. Mở file `.env` bằng trình soạn thảo văn bản (như Notepad, VS Code) và điền các thông tin cần thiết (ví dụ: Username/Password MongoDB, khóa API, v.v.). Tham khảo tài liệu hoặc liên hệ đội ngũ phát triển nếu cần hướng dẫn chi tiết.

### 6. Cài đặt dependencies
Dự án bao gồm hai phần chính: `client` (giao diện người dùng) và `server` (máy chủ). Bạn cần cài đặt các thư viện cần thiết cho cả hai nếu chạy thủ công:

1. Cài đặt dependencies cho client:
   ```bash
   cd client
   npm install
   ```
2. Cài đặt dependencies cho server:
   ```bash
   cd ../server
   npm install
   ```

Nếu sử dụng script tự động, bước này sẽ được thực hiện tự động.

---

## Chạy dự án

Dự án cung cấp hai cách để chạy: **thủ công** và **tự động**. Bạn có thể chọn cách phù hợp.

### 1. Chạy thủ công
Chạy từng phần (client và server) trong các terminal riêng:

- **Chạy client**:
  ```bash
  cd client
  npm run dev
  ```
  - Client sẽ chạy tại `http://localhost:80` (hoặc cổng được chỉ định trong `.env`).

- **Chạy server**:
  ```bash
  cd server
  npm run dev
  ```
  - Server sẽ chạy tại `http://localhost:3000` (hoặc cổng được chỉ định trong `.env`).

### 2. Chạy tự động
Dự án cung cấp các script để tự động cài đặt dependencies (nếu chưa cài đặt) và chạy toàn bộ hệ thống:

- **Trên Windows**:
  - Chạy môi trường phát triển:
    ```bash
    run-dev-all.bat
    ```
  - Chạy môi trường triển khai (release):
    ```bash
    run-release-all.bat
    ```

- **Trên Linux/Mac**:
  - Chạy môi trường phát triển:
    ```bash
    ./run-dev-all.sh
    ```
  - Chạy môi trường triển khai (release):
    ```bash
    ./run-release-all.sh
    ```

Nếu muốn chạy từng phần riêng lẻ, sử dụng các script `run-dev.bat` hoặc `run-release.bat` trong thư mục `client` hoặc `server` (Windows), hoặc `./run-dev.sh` hoặc `./run-release.sh` (Linux/Mac).

---

## Lưu ý quan trọng

- **Kiểm tra yêu cầu**: Đảm bảo Node.js và Git đã được cài đặt và chạy đúng trước khi thực hiện các bước.
- **Kết nối MongoDB**: Đảm bảo MongoDB đang chạy (dùng lệnh `mongod` trong terminal riêng nếu cần).
- **Cổng bị chiếm dụng**: Nếu gặp lỗi "port already in use", kiểm tra và thay đổi cổng trong file `.env`.
- **Sự cố**: Nếu gặp vấn đề, hãy kiểm tra log trong terminal hoặc liên hệ đội ngũ hỗ trợ qua [Discord](https://discord.gg/7SkzMkFWYN) hoặc email `support@tank-food.io.vn`.

---

## Thông tin bổ sung

- Tài liệu chính thức của Node.js: [nodejs.org](https://nodejs.org/)
- Tài liệu chính thức của Git: [git-scm.com](https://git-scm.com/)
- Tài liệu chính thức của MongoDB: [mongodb.com](https://www.mongodb.com/)

Hy vọng hướng dẫn này giúp bạn triển khai dự án TANK-Food thành công! Nếu cần thêm hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.