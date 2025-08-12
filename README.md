# 🏠 TroHub - Website Quản lý Nhà trọ

TroHub là nền tảng hỗ trợ chủ trọ quản lý hệ thống nhà trọ một cách trực quan và hiệu quả: theo dõi tòa nhà, phòng trọ, khách thuê, hợp đồng, hóa đơn, sự cố,...

---

## 🔰 Mục tiêu dự án

- Quản lý thông tin tòa nhà, khách thuê
- Theo dõi hợp đồng, hóa đơn, và báo cáo sự cố
- Hệ thống UI hiện đại, dễ sử dụng
- Hỗ trợ lọc dữ liệu, phân trang, biểu đồ thống kê

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
| ShadCN UI        | ✅                        | Giao diện UI chuẩn Radix    |
| Radix UI         | ^1.x                      | Tooltip, Dialog, Select,... |
| Zustand          | ^5.0.5                    | State management            |
| React Query      | ^5.76.1                   | Fetch, caching, pagination  |
| React Table      | ^8.21.3                   | Sắp xếp cột, ẩn cột,...     |
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

- `feat`: Tính năng mới → `feat/user-reset-password`
- `fix`: Sửa bug → `fix/user-login`
- `refactor`: Cải tiến không thay đổi logic → `refactor/user-hook`
- `hotfix`: Sửa lỗi khẩn cấp → `hotfix/user-register`
- `chore`: Việc phụ trợ (config, CI/CD) → `chore/setup-eslint`
- `docs`: Cập nhật tài liệu → `docs/readme`

### II. Quy tắc đặt tên commit

```
<type>(api-name): <short summary>
```

**Ví dụ:**

- `feat(user): add reset password endpoint`
- `fix(auth): handle login error`
- `refactor(building): extract filter logic`
- `style(user): format spacing`
- `test(building): add unit tests`
- `hotfix(auth): fix critical login bug`
- `docs(readme): add commit conventions`

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

# Kiến trúc thư mục

```
├── 📁 .git/ 🚫 (auto-hidden)
├── 📁 .vscode/ 🚫 (auto-hidden)
├── 📁 dist/ 🚫 (auto-hidden)
├── 📁 node_modules/ 🚫 (auto-hidden)
├── 📁 public/
│   ├── 🖼️ logo.webp
│   └── 🖼️ vite.svg
├── 📁 src/
│   ├── 📁 assets/
│   │   ├── 📁 css/
│   │   │   └── 🎨 print.css
│   │   ├── 📁 fonts/
│   │   │   ├── 📄 Roboto-Black.ttf
│   │   │   ├── 📄 Roboto-BlackItalic.ttf
│   │   │   ├── 📄 Roboto-Bold.ttf
│   │   │   ├── 📄 Roboto-BoldItalic.ttf
│   │   │   ├── 📄 Roboto-Italic.ttf
│   │   │   ├── 📄 Roboto-Light.ttf
│   │   │   ├── 📄 Roboto-LightItalic.ttf
│   │   │   ├── 📄 Roboto-Medium.ttf
│   │   │   ├── 📄 Roboto-MediumItalic.ttf
│   │   │   ├── 📄 Roboto-Regular.ttf
│   │   │   ├── 📄 Roboto-Thin.ttf
│   │   │   └── 📄 Roboto-ThinItalic.ttf
│   │   ├── 📁 gifs/
│   │   │   ├── 📄 index.ts
│   │   │   └── 🖼️ loading.gif
│   │   ├── 📁 icons/
│   │   │   └── 📄 index.tsx
│   │   ├── 📁 imgs/
│   │   │   ├── 🖼️ Profile_avatar_placeholder_large.webp
│   │   │   ├── 🖼️ admin.webp
│   │   │   ├── 🖼️ anhBannerHome.png
│   │   │   ├── 🖼️ assets.webp
│   │   │   ├── 🖼️ bed.webp
│   │   │   ├── 🖼️ building.webp
│   │   │   ├── 🖼️ bulletin board.webp
│   │   │   ├── 🖼️ contract.webp
│   │   │   ├── 🖼️ cooling-device.webp
│   │   │   ├── 🖼️ customer-review.webp
│   │   │   ├── 🖼️ energy.webp
│   │   │   ├── 🖼️ finance.webp
│   │   │   ├── 🖼️ fixed-asset.webp
│   │   │   ├── 🖼️ floor.webp
│   │   │   ├── 🖼️ fpt.webp
│   │   │   ├── 🖼️ hatchback.webp
│   │   │   ├── 🖼️ history.webp
│   │   │   ├── 📄 index.ts
│   │   │   ├── 🖼️ lender.webp
│   │   │   ├── 🖼️ mattress.webp
│   │   │   ├── 🖼️ momo.webp
│   │   │   ├── 🖼️ no-data-table.webp
│   │   │   ├── 🖼️ one-building.webp
│   │   │   ├── 🖼️ optimizing.webp
│   │   │   ├── 🖼️ order-fulfillment.webp
│   │   │   ├── 🖼️ payment-cash.webp
│   │   │   ├── 🖼️ react.webp
│   │   │   ├── 🖼️ receipt.webp
│   │   │   ├── 🖼️ room.webp
│   │   │   ├── 🖼️ shadcn.webp
│   │   │   ├── 🖼️ team.webp
│   │   │   ├── 🖼️ udpm.webp
│   │   │   ├── 🖼️ usage.webp
│   │   │   ├── 🖼️ vietnam-26834_1280.webp
│   │   │   ├── 🖼️ vnpay-qr.webp
│   │   │   ├── 🖼️ vnpay-scan.webp
│   │   │   ├── 🖼️ vnpay.webp
│   │   │   ├── 🖼️ water.webp
│   │   │   ├── 🖼️ writing.webp
│   │   │   └── 🖼️ zalopay.webp
│   │   ├── 📁 svg/
│   │   │   ├── 🖼️ can_ho_dich_vu.svg
│   │   │   ├── 🖼️ chung_cu_mini.svg
│   │   │   ├── 🖼️ feature-dashboard.svg
│   │   │   ├── 🖼️ feature-finance.svg
│   │   │   ├── 🖼️ feature-notify.svg
│   │   │   ├── 🖼️ google-icon-logo-svgrepo-com.svg
│   │   │   ├── 🖼️ img_ready.svg
│   │   │   ├── 📄 index.ts
│   │   │   ├── 🖼️ khac.svg
│   │   │   ├── 🖼️ login-v2.72cd8a26.svg
│   │   │   ├── 🖼️ nha_tro.svg
│   │   │   └── 🖼️ react.svg
│   │   └── 🖼️ react.svg
│   ├── 📁 components/
│   │   ├── 📁 customer/
│   │   │   ├── 📁 contract/
│   │   │   │   ├── 📄 AddOrUpdateContract.tsx
│   │   │   │   ├── 📄 ContractButton.tsx
│   │   │   │   └── 📄 ContractFilter.tsx
│   │   │   ├── 📁 tenant/
│   │   │   │   ├── 📄 AddOrUpdateTenant.tsx
│   │   │   │   ├── 📄 TenantButton.tsx
│   │   │   │   └── 📄 TenantFilter.tsx
│   │   │   └── 📁 vehicle/
│   │   │       ├── 📄 AddOrUpdateVehicle.tsx
│   │   │       ├── 📄 VehicleButton.tsx
│   │   │       └── 📄 VehicleFilter.tsx
│   │   ├── 📁 data-category/
│   │   │   ├── 📁 asset/
│   │   │   │   ├── 📄 AddOrUpdateAsset.tsx
│   │   │   │   ├── 📄 AssetButton.tsx
│   │   │   │   └── 📄 AssetFilter.tsx
│   │   │   ├── 📁 asset-type/
│   │   │   │   ├── 📄 AddOrUpdateAssetType.tsx
│   │   │   │   ├── 📄 AssetTypeButton.tsx
│   │   │   │   └── 📄 AssetTypeFilter.tsx
│   │   │   ├── 📁 building/
│   │   │   │   ├── 📄 AddOrUpdateBuilding.tsx
│   │   │   │   ├── 📄 BuildingButton.tsx
│   │   │   │   ├── 📄 BuildingFilter.tsx
│   │   │   │   └── 📄 SelectBuilding.tsx
│   │   │   ├── 📁 default-service/
│   │   │   │   ├── 📄 AddOrUpdateDefaultService.tsx
│   │   │   │   ├── 📄 DefaultServiceButton.tsx
│   │   │   │   └── 📄 DefaultServiceFilter.tsx
│   │   │   ├── 📁 floor/
│   │   │   │   ├── 📄 AddOrUpdateFloor.tsx
│   │   │   │   ├── 📄 FloorButton.tsx
│   │   │   │   └── 📄 FloorFilter.tsx
│   │   │   ├── 📁 room/
│   │   │   │   ├── 📄 AddOrUpdateRoom.tsx
│   │   │   │   ├── 📄 RoomButton.tsx
│   │   │   │   └── 📄 RoomFilter.tsx
│   │   │   ├── 📁 room-assets/
│   │   │   │   ├── 📄 AddOrUpdateRoomAsset.tsx
│   │   │   │   ├── 📄 RoomAssetButton.tsx
│   │   │   │   ├── 📄 RoomAssetDetail.tsx
│   │   │   │   ├── 📄 RoomAssetFilter.tsx
│   │   │   │   └── 📄 RoomAssetTable.tsx
│   │   │   ├── 📁 service/
│   │   │   │   ├── 📄 AddOrUpdateService.tsx
│   │   │   │   ├── 📄 ServiceButton.tsx
│   │   │   │   └── 📄 ServiceFilter.tsx
│   │   │   └── 📁 service-room/
│   │   │       ├── 📄 CreateRoomService.tsx
│   │   │       ├── 📄 CreateRoomServiceForBuilding.tsx
│   │   │       ├── 📄 CreateRoomServiceForRoom.tsx
│   │   │       ├── 📄 CreateRoomServiceForService.tsx
│   │   │       ├── 📄 ServiceRoomButton.tsx
│   │   │       ├── 📄 ServiceRoomFilter.tsx
│   │   │       └── 📄 UpdateUnitPriceForRoomDetail.tsx
│   │   ├── 📁 finance/
│   │   │   ├── 📁 invoice/
│   │   │   │   ├── 📄 AddInvoice.tsx
│   │   │   │   ├── 📄 AddItemInvoiceDetail.tsx
│   │   │   │   ├── 📄 InvoiceButton.tsx
│   │   │   │   ├── 📄 InvoiceFilter.tsx
│   │   │   │   ├── 📄 InvoiceFilterForUser.tsx
│   │   │   │   ├── 📄 InvoicePayment.tsx
│   │   │   │   ├── 📄 SelectPaymentMethod.tsx
│   │   │   │   ├── 📄 UpdateInvoice.tsx
│   │   │   │   └── 📄 UpdateItemInvoiceDetail.tsx
│   │   │   ├── 📁 meter/
│   │   │   │   ├── 📄 AddOrUpdateMeter.tsx
│   │   │   │   ├── 📄 MeterButton.tsx
│   │   │   │   └── 📄 MeterFilter.tsx
│   │   │   ├── 📁 meter-reading/
│   │   │   │   ├── 📄 AddOrUpdateMeterReading.tsx
│   │   │   │   ├── 📄 MeterReadingButton.tsx
│   │   │   │   └── 📄 MeterReadingFilter.tsx
│   │   │   └── 📁 payment-receipt/
│   │   │       ├── 📄 PaymentReceiptButton.tsx
│   │   │       └── 📄 PaymentReceiptFilter.tsx
│   │   ├── 📁 home/
│   │   │   ├── 📄 Contact.tsx
│   │   │   ├── 📄 Features.tsx
│   │   │   ├── 📄 policy.tsx
│   │   │   └── 📄 service.tsx
│   │   ├── 📁 ui/
│   │   │   ├── 📄 AvatarImage.tsx
│   │   │   ├── 📄 FieldsMultiSelectLabel.tsx
│   │   │   ├── 📄 MotionFadeIn.tsx
│   │   │   ├── 📄 MotionFadeLeft.tsx
│   │   │   ├── 📄 MotionFadeRight.tsx
│   │   │   ├── 📄 MotionFadeUp.tsx
│   │   │   ├── 📄 StatusBadge.tsx
│   │   │   ├── 📄 alert-dialog.tsx
│   │   │   ├── 📄 avatar.tsx
│   │   │   ├── 📄 badge.tsx
│   │   │   ├── 📄 breadcrumb.tsx
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 calendar.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 chart.tsx
│   │   │   ├── 📄 checkbox.tsx
│   │   │   ├── 📄 collapsible.tsx
│   │   │   ├── 📄 context-menu.tsx
│   │   │   ├── 📄 dialog.tsx
│   │   │   ├── 📄 drawer.tsx
│   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   ├── 📄 input-otp.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 label.tsx
│   │   │   ├── 📄 popover.tsx
│   │   │   ├── 📄 select.tsx
│   │   │   ├── 📄 separator.tsx
│   │   │   ├── 📄 sheet.tsx
│   │   │   ├── 📄 sidebar.tsx
│   │   │   ├── 📄 skeleton.tsx
│   │   │   ├── 📄 sonner.tsx
│   │   │   ├── 📄 table.tsx
│   │   │   ├── 📄 tabs.tsx
│   │   │   ├── 📄 textarea.tsx
│   │   │   └── 📄 tooltip.tsx
│   │   ├── 📄 ButtonFilter.tsx
│   │   ├── 📄 ChartCustom.tsx
│   │   ├── 📄 DataTable.tsx
│   │   ├── 📄 DatePickerLabel.tsx
│   │   ├── 📄 DateRangePicker.tsx
│   │   ├── 📄 DialogCustom.tsx
│   │   ├── 📄 DialogLink.tsx
│   │   ├── 📄 DynamicBreadcrumb.tsx
│   │   ├── 📄 FieldsSelectLabel.tsx
│   │   ├── 📄 Image.tsx
│   │   ├── 📄 InputLabel.tsx
│   │   ├── 📄 InputOTPLabel.tsx
│   │   ├── 📄 Loading.tsx
│   │   ├── 📄 LoadingPage.tsx
│   │   ├── 📄 Logo.tsx
│   │   ├── 📄 Modal.tsx
│   │   ├── 📄 NoData.tsx
│   │   ├── 📄 Overlay.tsx
│   │   ├── 📄 RenderIf.tsx
│   │   ├── 📄 ScrollToTop.tsx
│   │   ├── 📄 StatisticCard.tsx
│   │   ├── 📄 TextareaLabel.tsx
│   │   └── 📄 ToolTip.tsx
│   ├── 📁 configs/
│   │   ├── 📄 index.ts
│   │   ├── 📄 oauth2.ts
│   │   ├── 📄 routes.ts
│   │   └── 📄 storage.ts
│   ├── 📁 constant/
│   │   └── 📄 index.ts
│   ├── 📁 enums/
│   │   └── 📄 index.ts
│   ├── 📁 hooks/
│   │   ├── 📄 index.ts
│   │   ├── 📄 use-mobile.ts
│   │   ├── 📄 useAddress.ts
│   │   ├── 📄 useClickOutside.ts
│   │   ├── 📄 useConfirmDialog.tsx
│   │   ├── 📄 useDebounce.ts
│   │   ├── 📄 useFormErrors.ts
│   │   ├── 📄 useFullAddress.tsx
│   │   ├── 📄 useHighestRole.ts
│   │   ├── 📄 useLocalStorage.ts
│   │   ├── 📄 useMyInfo.ts
│   │   ├── 📄 usePrevious.ts
│   │   ├── 📄 useTheme.ts
│   │   └── 📄 useViewport.ts
│   ├── 📁 layouts/
│   │   ├── 📁 AuthLayout/
│   │   │   ├── 📄 AuthLayout.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 DefaultLayout/
│   │   │   ├── 📄 DefaultLayout.tsx
│   │   │   └── 📄 index.ts
│   │   └── 📁 components/
│   │       ├── 📄 AppSidebar.tsx
│   │       ├── 📄 BannerPolicy.tsx
│   │       ├── 📄 Breadcrumb.tsx
│   │       ├── 📄 CallToActionHome.tsx
│   │       ├── 📄 ContactHome.tsx
│   │       ├── 📄 FeatureSectionFullHome.tsx
│   │       ├── 📄 FeatureSectionHome.tsx
│   │       ├── 📄 FooterHome.tsx
│   │       ├── 📄 FooterLayout.tsx
│   │       ├── 📄 HeaderLayout.tsx
│   │       ├── 📄 HeroSectionHome.tsx
│   │       ├── 📄 HowItWorksHome.tsx
│   │       ├── 📄 PolicyHome.tsx
│   │       ├── 📄 ServicesHome.tsx
│   │       ├── 📄 SliderHome.tsx
│   │       ├── 📄 nav-home.tsx
│   │       ├── 📄 nav-main.tsx
│   │       ├── 📄 nav-projects.tsx
│   │       ├── 📄 team-switcher.tsx
│   │       └── 📄 useLogout.ts
│   ├── 📁 lib/ 🚫 (auto-hidden)
│   ├── 📁 pages/
│   │   ├── 📁 authenticate/
│   │   │   ├── 📄 Authenticate.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 customer/
│   │   │   ├── 📁 contract/
│   │   │   │   ├── 📄 Contract.tsx
│   │   │   │   ├── 📄 ContractDetailPage.tsx
│   │   │   │   ├── 📄 HistoryContract.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useContract.ts
│   │   │   │   └── 📄 useHistoryContract.ts
│   │   │   ├── 📁 tenant/
│   │   │   │   ├── 📄 DetailTenant.tsx
│   │   │   │   ├── 📄 HistoryTenant.tsx
│   │   │   │   ├── 📄 Tenant.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useHistoryTenant.ts
│   │   │   │   └── 📄 useTenant.ts
│   │   │   └── 📁 vehicle/
│   │   │       ├── 📄 HistoryVehicle.tsx
│   │   │       ├── 📄 Vehicle.tsx
│   │   │       ├── 📄 index.ts
│   │   │       ├── 📄 useHistoryVehicle.ts
│   │   │       └── 📄 useVehicle.ts
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 DashBoard.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 data-category/
│   │   │   ├── 📁 asset/
│   │   │   │   ├── 📄 Asset.tsx
│   │   │   │   ├── 📄 HistoryAsset.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useAsset.ts
│   │   │   │   └── 📄 useHistoryAsset.ts
│   │   │   ├── 📁 asset-type/
│   │   │   │   ├── 📄 AssetType.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 useAssetType.ts
│   │   │   ├── 📁 building/
│   │   │   │   ├── 📄 Building.tsx
│   │   │   │   ├── 📄 HistoryBuilding.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useBuilding.ts
│   │   │   │   └── 📄 useHistoryBuilding.ts
│   │   │   ├── 📁 floor/
│   │   │   │   ├── 📄 Floor.tsx
│   │   │   │   ├── 📄 HistoryFloor.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useFloor.ts
│   │   │   │   └── 📄 useHistoryFloor.ts
│   │   │   ├── 📁 room/
│   │   │   │   ├── 📄 HistoryRoom.tsx
│   │   │   │   ├── 📄 Room.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useHistoryRoom.ts
│   │   │   │   └── 📄 useRoom.ts
│   │   │   ├── 📁 room-assets/
│   │   │   │   ├── 📄 RoomAsset.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useRoomAsset.ts
│   │   │   │   └── 📄 useRoomAssetAll.ts
│   │   │   ├── 📁 service/
│   │   │   │   ├── 📄 HistoryService.tsx
│   │   │   │   ├── 📄 Service.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useHistoryService.ts
│   │   │   │   └── 📄 useService.ts
│   │   │   ├── 📁 service-room/
│   │   │   │   ├── 📄 ServiceRoom.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 useServiceRoom.ts
│   │   │   └── 📁 service-room-detail/
│   │   │       ├── 📄 ServiceRoomDetail.tsx
│   │   │       ├── 📄 index.ts
│   │   │       └── 📄 useServiceRoomDetail.ts
│   │   ├── 📁 finance/
│   │   │   ├── 📁 invoice/
│   │   │   │   ├── 📁 invoice-detail/
│   │   │   │   │   ├── 📄 InvoiceDetail.tsx
│   │   │   │   │   ├── 📄 ViewInvoiceDetail.tsx
│   │   │   │   │   ├── 📄 useInvoiceDetail.ts
│   │   │   │   │   └── 📄 useViewInvoiceDetail.ts
│   │   │   │   ├── 📄 HistoryInvoice.tsx
│   │   │   │   ├── 📄 Invoice.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 useHistoryInvoice.ts
│   │   │   │   └── 📄 useInvoice.ts
│   │   │   ├── 📁 meter/
│   │   │   │   ├── 📄 Meter.tsx
│   │   │   │   ├── 📄 MeterStatistics.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 useMeter.ts
│   │   │   ├── 📁 meter-reading/
│   │   │   │   ├── 📄 MeterReading.tsx
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 useMeterReading.ts
│   │   │   └── 📁 payment-receipt/
│   │   │       ├── 📄 PaymentReceipt.tsx
│   │   │       ├── 📄 index.ts
│   │   │       └── 📄 usePaymentReceipt.ts
│   │   ├── 📁 forgot-password/
│   │   │   ├── 📄 ForgotPassword.tsx
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 useForgotPassword.ts
│   │   ├── 📁 home/
│   │   │   ├── 📄 Home.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 login/
│   │   │   ├── 📄 Login.tsx
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 useLogin.ts
│   │   ├── 📁 payment-callback/
│   │   │   ├── 📄 PaymentCallbackVnPay.tsx
│   │   │   └── 📄 index.ts
│   │   ├── 📁 profile/
│   │   │   ├── 📄 Profile.tsx
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 useProfile.ts
│   │   ├── 📁 register/
│   │   │   ├── 📄 Register.tsx
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 useRegister.ts
│   │   └── 📁 user/
│   │       ├── 📁 invoice/
│   │       │   ├── 📄 UserInvoice.tsx
│   │       │   ├── 📄 index.ts
│   │       │   └── 📄 useUserInvoice.ts
│   │       ├── 📁 members/
│   │       │   ├── 📄 RoomMembers.tsx
│   │       │   └── 📄 index.ts
│   │       ├── 📁 payment-receipt/
│   │       │   ├── 📄 UserPaymentReceipt.tsx
│   │       │   ├── 📄 index.ts
│   │       │   └── 📄 useUserPaymentReceipt.ts
│   │       ├── 📁 room/
│   │       │   ├── 📄 UserRoom.tsx
│   │       │   └── 📄 index.ts
│   │       └── 📁 room-detail/
│   │           ├── 📄 UserRoomDetail.tsx
│   │           └── 📄 index.ts
│   ├── 📁 provider/
│   │   ├── 📄 AppProvider.tsx
│   │   ├── 📄 index.ts
│   │   └── 📄 useAppProvider.tsx
│   ├── 📁 routers/
│   │   ├── 📄 PrivateRoute.tsx
│   │   ├── 📄 PublicRoute.tsx
│   │   ├── 📄 index.ts
│   │   └── 📄 router.ts
│   ├── 📁 services/
│   │   └── 📁 auth/
│   │       └── 📄 index.ts
│   ├── 📁 types/
│   │   └── 📄 index.ts
│   ├── 📁 utils/
│   │   ├── 📄 buildColumnsFromConfig.tsx
│   │   ├── 📄 cookieUtil.ts
│   │   ├── 📄 formatTime.ts
│   │   ├── 📄 handleMutationError.ts
│   │   ├── 📄 httpRequest.ts
│   │   └── 📄 queryFilter.ts
│   ├── 📁 zustand/
│   │   └── 📄 authStore.ts
│   ├── 📄 App.tsx
│   ├── 🎨 index.css
│   ├── 📄 main.tsx
│   └── 📄 vite-env.d.ts
├── 🔒 .env 🚫 (auto-hidden)
├── 🚫 .gitignore
├── 📖 README.md
├── 📄 components.json
├── 📄 eslint.config.js
├── 🌐 index.html
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 tailwind.config.ts
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
├── 📄 vercel.json
└── 📄 vite.config.ts
```
