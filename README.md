# Mintech E-commerce

Ứng dụng thương mại điện tử cho cửa hàng thiết bị công nghệ, gồm trang mua hàng và trang quản trị. Dự án sử dụng Java 27, Spring Boot, React, TypeScript và MySQL.

## Tính năng

- **Khách hàng** — đăng ký, đăng nhập, duyệt sản phẩm, thêm biến thể vào giỏ, đặt hàng với hình thức thanh toán khi nhận hàng (COD) và xem lịch sử đơn.
- **Quản trị viên** — quản lý sản phẩm, danh mục và cập nhật trạng thái đơn hàng.
- **Bảo mật** — phân quyền `CUSTOMER` và `ADMIN` qua Spring Security và JWT, giới hạn số lần đăng nhập, vô hiệu hóa JWT cũ sau khi đổi mật khẩu và kiểm tra quyền truy cập vận đơn.

## Kiến trúc

```text
Browser → Nginx + React → Spring Boot REST API → MySQL
```

| Thành phần | Mã nguồn |
| --- | --- |
| REST API, Spring Security, Spring Data JPA và kiểm thử JUnit | [mintech-backend](mintech-backend/) |
| Trang mua hàng và quản trị với React, TypeScript, Vite | [mintech-frontend](mintech-frontend/) |
| Cấu hình chạy ba dịch vụ | [compose.yaml](compose.yaml) |

## Chạy bằng Docker Compose

Yêu cầu Docker Engine đang chạy và có Docker Compose v2. Sau khi clone repo, mở terminal tại thư mục gốc.

**1. Tạo file cấu hình** từ [`.env.example`](.env.example).

```powershell
Copy-Item .env.example .env
```

Trên macOS hoặc Linux, dùng `cp .env.example .env`. Điền các biến sau vào `.env`.

| Biến | Giá trị |
| --- | --- |
| `MINTECH_DB_PASSWORD` | Mật khẩu tài khoản MySQL của ứng dụng |
| `MINTECH_DB_ROOT_PASSWORD` | Mật khẩu tài khoản root của MySQL |
| `MINTECH_JWT_SECRET` | Khóa ngẫu nhiên ít nhất 32 byte, mã hóa Base64 |
| `MINTECH_HTTP_PORT` | Cổng truy cập ứng dụng, mặc định là `3000` |

Tạo khóa JWT bằng PowerShell rồi dán kết quả vào `MINTECH_JWT_SECRET`.

```powershell
$key = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($key)
$rng.Dispose()
[Convert]::ToBase64String($key)
```

Nếu dùng OpenSSL, chạy `openssl rand -base64 32`.

**2. Build và khởi động.**

```sh
docker compose up --build -d
docker compose ps
```

Mở [http://localhost:3000](http://localhost:3000). Nginx phục vụ giao diện và chuyển tiếp các đường dẫn API từ cùng địa chỉ. Hibernate tạo bảng trong MySQL mới và Docker lưu dữ liệu trong volume `mysql-data`.

## Demo mua hàng và quản trị

Database mới bắt đầu với danh mục sản phẩm trống. Đăng ký hai tài khoản qua trang `/register`, một tài khoản mua hàng và một tài khoản dành cho quản trị viên.

Trong môi trường demo cục bộ, mở MySQL từ container và nhập `MINTECH_DB_PASSWORD` khi được hỏi.

```sh
docker compose exec db mysql -u mintech -p mintech_ecommerce
```

Đổi email ví dụ thành email tài khoản quản trị vừa đăng ký.

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
EXIT;
```

1. Đăng nhập lại bằng tài khoản admin, mở `/admin/categories` để tạo danh mục, sau đó vào `/admin/products` để tạo sản phẩm có giá và tồn kho.
2. Đăng nhập bằng tài khoản khách hàng, thêm sản phẩm vào giỏ và đặt đơn COD.
3. Dùng tài khoản admin cập nhật đơn tại `/admin/orders`, rồi dùng tài khoản khách hàng xem trạng thái mới tại `/account/orders`.

Biểu đồ doanh thu theo tháng trong dashboard dùng tỷ lệ minh họa. Danh sách đơn hàng lấy dữ liệu từ API.

## Kiểm thử

Các [kiểm thử hồi quy](mintech-backend/src/test/java/com/mintech/ecommerce/SecurityRegressionTests.java) bao gồm giới hạn đăng nhập, vô hiệu hóa JWT khi đổi mật khẩu, quyền truy cập vận đơn và dữ liệu trả về khi tra cứu công khai.

Chạy riêng nhóm test này từ thư mục gốc bằng PowerShell với JDK 27.

```powershell
cd mintech-backend
.\mvnw.cmd "-Dtest=SecurityRegressionTests" test
```

Trên macOS hoặc Linux, chạy `sh mvnw -Dtest=SecurityRegressionTests test` trong cùng thư mục. Test `MintechBackendApplicationTests` khởi động Spring context và cần cấu hình MySQL riêng khi chạy ngoài Compose.

## Nhật ký và dừng ứng dụng

```sh
docker compose logs -f backend
docker compose down
```
