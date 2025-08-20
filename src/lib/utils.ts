/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AssetBeLongTo,
  AssetStatus,
  AssetType,
  BuildingStatus,
  BuildingType,
  ContractStatus,
  FloorStatus,
  FloorType,
  Gender,
  InvoiceStatus,
  InvoiceType,
  MeterType,
  NotificationType,
  PaymentMethod,
  PaymentStatus,
  RoomStatus,
  RoomType,
  ServiceCalculation,
  ServiceCategory,
  ServiceStatus,
  TenantStatus,
  VehicleStatus,
  VehicleType,
} from "@/enums";
import { RoleType } from "@/hooks/useHighestRole";
import { UserResponse } from "@/types";
import { useEditorStore } from "@/zustand/editorStore";
import { FindResultType } from "ckeditor5";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ROLE_PRIORITY: RoleType[] = ["USER", "STAFF", "MANAGER", "ADMIN"];

export const getHighestRole = (roles: RoleType[]): RoleType => {
  return roles.sort((a, b) => ROLE_PRIORITY.indexOf(b) - ROLE_PRIORITY.indexOf(a))[0];
};

export const setLang = (newLang: "vi-VN" | "en-US") => {
  lang = newLang;
};

export let lang: "vi-VN" | "en-US" = "vi-VN";

export const formattedCurrency = (price: number): string => {
  const currency = lang === "en-US" ? "USD" : "VND";

  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(price);
};

export const formatDate = (date: Date | string): string => {
  if (!date) return "";

  const d = new Date(date);

  return new Intl.DateTimeFormat(lang, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

export const formatNumber = (number: number | string): string | number => {
  return number.toLocaleString(lang);
};

export const switchGrid3 = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end";
  }
};

export const switchGrid4 = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-4 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end";
  }
};

export const switchGrid2 = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-1 grid-cols-1 gap-5 w-full items-end";
  }
};

export const replaceText = (replacementText: string, findResult: FindResultType) => {
  const editor = useEditorStore.getState().getEditor();
  if (!editor) return;

  editor.execute("replace", replacementText, findResult);
};

export const assetTypeEnumToString = (assetType: AssetType) => {
  const map: Record<AssetType, string> = {
    AN_NINH: "An ninh",
    DIEN: "Điện",
    GIA_DUNG: "Gia dụng",
    KHAC: "Khác",
    NOI_THAT: "Nội thất",
    VE_SINH: "Vệ sinh",
  };

  return map[assetType] || "Không xác định";
};

export const assetStatusEnumToString = (assetStatus: AssetStatus) => {
  const map: Record<AssetStatus, string> = {
    CAN_BAO_TRI: "Cần bảo trì",
    DA_THANH_LY: "Đã thanh lý",
    HOAT_DONG: "Hoạt động",
    HU_HONG: "Bị hỏng",
    HUY: "Bị hủy",
    KHONG_SU_DUNG: "Không sử dụng",
    THAT_LAC: "Thất lạc",
  };

  return map[assetStatus] || "Không xác định";
};

export const serviceCategoryEnumToString = (serviceCategory: ServiceCategory) => {
  const map: Record<ServiceCategory, string> = {
    DIEN: "Điện",
    NUOC: "Nước",
    GUI_XE: "Gửi xe",
    INTERNET: "Internet",
    VE_SINH: "Vệ sinh",
    THANG_MAY: "Thang máy",
    BAO_TRI: "Bảo trì",
    AN_NINH: "An ninh",
    GIAT_SAY: "Giặt sấy",
    TIEN_PHONG: "Tiền phòng",
    KHAC: "Khác",
    DEN_BU: "Đền bù",
  };

  return map[serviceCategory] || "Không xác định";
};

export const serviceCalculationEnumToString = (serviceApply: ServiceCalculation) => {
  const map: Record<ServiceCalculation, string> = {
    TINH_THEO_NGUOI: "Tính theo người",
    TINH_THEO_PHONG: "Tính theo phòng",
    TINH_THEO_PHUONG_TIEN: "Tính theo phương tiện",
    TINH_THEO_SO: "Tính theo số",
  };

  return map[serviceApply] || "Không xác định";
};

export const serviceStatusEnumToString = (status: ServiceStatus) => {
  const map: Record<ServiceStatus, string> = {
    HOAT_DONG: "Hoạt động",
    KHONG_SU_DUNG: "Không sử dụng",
    TAM_KHOA: "Tạm khóa",
  };

  return map[status] || "Không xác định";
};

export const vehicleTypeEnumToString = (vehicleType: VehicleType) => {
  const map: Record<VehicleType, string> = {
    XE_MAY: "Xe máy",
    O_TO: "Ô tô",
    XE_DAP: "Xe đạp",
    KHAC: "Khác",
  };

  return map[vehicleType] || "Không xác định";
};

export const vehicleStatusEnumToString = (status: VehicleStatus) => {
  const map: Record<VehicleStatus, string> = {
    KHONG_SU_DUNG: "Không sử dụng",
    SU_DUNG: "Sử dụng",
    TAM_KHOA: "Tạm khóa",
  };

  return map[status] || "Không xác định";
};

export const contractStatusEnumToString = (status: ContractStatus) => {
  const map: Record<ContractStatus, string> = {
    HIEU_LUC: "Hiệu lực",
    SAP_HET_HAN: "Sắp hết hạn",
    DA_HUY: "Đã hủy",
    KET_THUC_DUNG_HAN: "Kết thúc đúng hạn",
    KET_THUC_CO_BAO_TRUOC: "Kết thúc có báo trước",
    TU_Y_HUY_BO: "Tự ý hủy bỏ",
    CHO_KICH_HOAT: "Chờ kích hoạt",
  };

  return map[status] || "Không xác định";
};

export const buildingTypeEnumToString = (type: BuildingType) => {
  const map: Record<BuildingType, string> = {
    CAN_HO_DICH_VU: "Căn hộ dịch vụ",
    CHUNG_CU_MINI: "Chung cư mini",
    KHAC: "Khác",
    NHA_TRO: "Nhà trọ",
  };

  return map[type] || "Không xác định";
};

export const buildingStatusEnumToString = (status: BuildingStatus) => {
  const map: Record<BuildingStatus, string> = {
    HOAT_DONG: "Hoạt động",
    HUY_HOAT_DONG: "Hủy hoạt động",
    TAM_KHOA: "Tạm khóa",
  };

  return map[status] || "Không xác định";
};

export const floorTypeEnumToString = (type: FloorType) => {
  const map: Record<FloorType, string> = {
    CHO_THUE: "Cho thuê",
    DE_O: "Để ở",
    KHAC: "Khác",
    KHO: "Kho",
    KHONG_CHO_THUE: "Không cho thuê",
  };

  return map[type] || "Không xác định";
};

export const floorStatusEnumToString = (status: FloorStatus) => {
  const map: Record<FloorStatus, string> = {
    HOAT_DONG: "Hoạt động",
    KHONG_SU_DUNG: "Không sử dụng",
    TAM_KHOA: "Tạm khóa",
  };

  return map[status] || "Không xác định";
};

export const roomTypeEnumToString = (type: RoomType) => {
  const map: Record<RoomType, string> = {
    KHAC: "Khác",
    CAO_CAP: "Cao cấp",
    DON: "Đơn",
    GHEP: "Ghép",
  };

  return map[type] || "Không xác định";
};

export const roomStatusEnumToString = (status: RoomStatus) => {
  const map: Record<RoomStatus, string> = {
    TAM_KHOA: "Tạm khóa",
    CHUA_HOAN_THIEN: "Chưa hoàn thiện",
    DA_DAT_COC: "Đã đặt cọc",
    DANG_BAO_TRI: "Đang bảo trì",
    DANG_THUE: "Đang thuê",
    HUY_HOAT_DONG: "Hủy hoạt động",
    TRONG: "Trống",
  };

  return map[status] || "Không xác định";
};

export const assetBelongToEnumToString = (belongTo: AssetBeLongTo) => {
  const map: Record<AssetBeLongTo, string> = {
    CA_NHAN: "Cá nhân",
    CHUNG: "Chung",
    PHONG: "Phòng",
  };

  return map[belongTo] || "Không xác định";
};

export const genderEnumToString = (gender: Gender) => {
  const map: Record<Gender, string> = {
    FEMALE: "Nữ",
    MALE: "Nam",
    OTHER: "Khác",
    UNKNOWN: "Không xác định",
  };

  return map[gender] || "Không xác định";
};

export const tenantStatusEnumToString = (status: TenantStatus) => {
  const map: Record<TenantStatus, string> = {
    DA_TRA_PHONG: "Đã trả phòng",
    DANG_THUE: "Đang thuê",
    HUY_BO: "Hủy bỏ",
    KHOA: "Khóa",
    TIEM_NANG: "Tiềm năng",
  };

  return map[status] || "Không xác định";
};

export const meterTypeEnumToString = (type: MeterType) => {
  const map: Record<MeterType, string> = {
    DIEN: "Công tơ điện",
    NUOC: "Công tơ nước",
  };

  return map[type] || "Không xác định";
};

export const invoiceTypeEnumToString = (type: InvoiceType) => {
  const map: Record<InvoiceType, string> = {
    CUOI_CUNG: "Cuối cùng",
    HANG_THANG: "Hàng tháng",
  };

  return map[type] || "Không xác định";
};

export const invoiceStatusEnumToString = (status: InvoiceStatus) => {
  const map: Record<InvoiceStatus, string> = {
    CHO_THANH_TOAN: "Chờ thanh toán",
    CHUA_THANH_TOAN: "Chưa thanh toán",
    DA_THANH_TOAN: "Đã thanh toán",
    HUY: "Bị hủy",
    KHOI_PHUC: "Khôi phục",
    QUA_HAN: "Quá hạn",
  };

  return map[status] || "Không xác định";
};

export const receiptMethodEnumToString = (method: PaymentMethod) => {
  const map: Record<PaymentMethod, string> = {
    CHON_PHUONG_THUC: "Chọn phương thức",
    CHUYEN_KHOAN: "Chuyển khoản",
    MOMO: "Ví điện thử MoMo",
    TIEN_MAT: "Tiền mặt",
    VNPAY: "Ví điện thử VNPay",
    ZALOPAY: "Ví điện thử ZaloPay",
  };

  return map[method] || "Không xác định";
};

export const receiptStatusEnumToString = (status: PaymentStatus) => {
  const map: Record<PaymentStatus, string> = {
    CHO_THANH_TOAN: "Chờ thanh toán",
    CHO_XAC_NHAN: "Chờ xác nhận",
    DA_THANH_TOAN: "Đã thanh toán",
    HUY: "Bị hủy",
    TU_CHOI: "Bị từ chối",
  };

  return map[status] || "Không xác định";
};

export const notificationTypeEnumToString = (type: NotificationType) => {
  const map: Record<NotificationType, string> = {
    CHUNG: "Chung",
    HE_THONG: "Hệ thống",
    KHAC: "Khác",
  };

  return map[type] || "Không xác định";
};

export const checkUser = (user: UserResponse | null, isLoading: boolean): boolean => {
  if (
    (!user?.dob || (user?.gender !== Gender.FEMALE && user?.gender !== Gender.MALE) || !user?.phoneNumber) &&
    !isLoading
  ) {
    return false;
  }
  return true;
};

export const handleExportExcel = (name: string, exportData?: Record<string, any>[], data?: Record<string, any>[]) => {
  if (!data?.length) return;

  // Lấy keys từ object đầu tiên (tất cả cột có trong dữ liệu)
  // const keys = Object.keys(data[0]);

  // Tạo exportData bằng cách duyệt qua từng row
  // const exportData = data.map((row) => {
  //   const obj: Record<string, any> = {};
  //   keys.forEach((key) => {
  //     obj[key] = row[key as keyof typeof row];
  //   });
  //   return obj;
  // });

  const finalExportData = exportData && exportData.length > 0 ? exportData : data.map((row) => ({ ...row }));
  if (!finalExportData.length) return;

  const worksheet = XLSX.utils.json_to_sheet(finalExportData);

  // Tính độ dài tối đa cho từng cột (theo content)
  const cols = Object.keys(finalExportData[0]).map((key) => {
    const maxLength = finalExportData.reduce((len, row) => {
      const cellValue = row[key] ? String(row[key]) : "";
      return Math.max(len, cellValue.length);
    }, key.length); // so với cả độ dài header
    return { wch: maxLength + 2 }; // thêm padding 2
  });

  worksheet["!cols"] = cols;

  // Xuất excel
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${name}.xlsx`);
};
