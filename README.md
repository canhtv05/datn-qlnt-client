# 🏠 TroHub - Website Quản lý Nhà trọ

TroHub là nền tảng hỗ trợ chủ trọ quản lý hệ thống nhà trọ một cách trực quan và hiệu quả: theo dõi tòa nhà, phòng trọ, khách thuê, hợp đồng, hóa đơn, sự cố,...

---

## 🔰 Mục tiêu dự án

* Quản lý thông tin tòa nhà, khách thuê
* Theo dõi hợp đồng, hóa đơn, và báo cáo sự cố
* Hệ thống UI hiện đại, dễ sử dụng
* Hỗ trợ lọc dữ liệu, phân trang, biểu đồ thống kê

---

## 🧱️ Kiến trúc thư mục cơ bản

```
src/
├── components/              # Các component giao diện dùng lại nhiều nơi
├── hooks/                   # Custom hooks
├── lib/                     # Schema validation (zod), thư viện phụ trợ
├── pages/                   # Các trang chính
├── zustand/                 # Global state management
├── types/                   # Interface, enum, type...
├── utils/                   # Helper (http, filter, mutation error,...)
```

---

## 🛠️ Công nghệ sử dụng

### 🔧 Frontend Stack

| Công nghệ        | Phiên bản                 | Mô tả                       |
| ---------------- | ------------------------- | --------------------------- |
| React            | 19.1.0                    | Thư viện UI                 |
| React Router DOM | 7.6.0                     | Routing                     |
| TypeScript       | \~5.8.3                   | Kiểu dữ liệu tĩnh           |
| Vite             | ^6.3.5                    | Công cụ build siêu nhanh    |
| Tailwind CSS     | 4.1.6                     | CSS Utility-first           |
| ShadCN UI        | ✅                         | Giao diện UI chuẩn Radix    |
| Radix UI         | ^1.x                      | Tooltip, Dialog, Select,... |
| Zustand          | ^5.0.5                    | State management            |
| React Query      | ^5.76.1                   | Fetch, caching, pagination  |
| Zod              | ^3.25.46                  | Schema validation           |
| Axios            | ^1.9.0                    | Gửi HTTP request            |
| Sonner           | ^2.0.4                    | Toast message               |
| Recharts         | ^2.15.3                   | Vẽ biểu đồ                  |
| Framer Motion    | ^12.18.1                  | Animation UI                |
| React Markdown   | ^10.1.0                   | Hiển thị nội dung Markdown  |
| Lucide React     | ^0.510.0                  | Icon set hiện đại           |
| Class Utilities  | clsx, tailwind-merge, cva | Gộp class tailwind          |

---

## 📜 Scripts

| Lệnh              | Chức năng              |
| ----------------- | ---------------------- |
| `npm run dev`     | Chạy chế độ dev        |
| `npm run build`   | Build production       |
| `npm run preview` | Xem thử bản production |
| `npm run lint`    | Kiểm tra lint lỗi      |

---

## 🔃 Quy tắc Git & Làm việc nhóm

### I. Quy tắc đặt tên nhánh

```
<type>/<api-name>-<short-description>
```

**Các loại type:**

* `feat`: Tính năng mới → `feat/user-reset-password`
* `fix`: Sửa bug → `fix/user-login`
* `refactor`: Cải tiến không thay đổi logic → `refactor/user-hook`
* `hotfix`: Sửa lỗi khẩn cấp → `hotfix/user-register`
* `chore`: Việc phụ trợ (config, CI/CD) → `chore/setup-eslint`
* `docs`: Cập nhật tài liệu → `docs/readme`

### II. Quy tắc đặt tên commit

```
<type>(api-name): <short summary>
```

**Ví dụ:**

* `feat(user): add reset password endpoint`
* `fix(auth): handle login error`
* `refactor(building): extract filter logic`
* `style(user): format spacing`
* `test(building): add unit tests`
* `hotfix(auth): fix critical login bug`
* `docs(readme): add commit conventions`

### III. Git Flow

1. **Kéo code mới nhất từ nhánh `master`** trước khi bắt đầu:

```bash
git checkout master
git pull origin master
```

2. **KHÔNG ĐƯỢC** `push` hoặc `merge` trực tiếp lên nhánh chính:

```bash
❌ git push origin master
❌ git merge master
```

---

> ⚠️ **LƯU Ý**: KHÔNG tự ý thay đổi file README.md trừ khi được duyệt trong review.
