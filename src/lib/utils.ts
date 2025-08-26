/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AssetBeLongTo,
  AssetStatus,
  AssetType,
  BuildingStatus,
  BuildingType,
  ContractStatus,
  DepositStatus,
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
  ServiceRoomStatus,
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
import { TFunction } from "i18next";
import { Locale } from "date-fns";
import { enUS, vi } from "date-fns/locale";

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

export const formatLocalDate = (date: Date | string): string => {
  if (!date) return "";

  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

  return d.toISOString().split("T")[0];
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

export const assetTypeEnumToString = (assetType: AssetType, t: TFunction<"translate", undefined>) => {
  const map: Record<AssetType, string> = {
    AN_NINH: t("statusBadge.assetType.security"),
    DIEN: t("statusBadge.assetType.electric"),
    GIA_DUNG: t("statusBadge.assetType.houseware"),
    KHAC: t("statusBadge.assetType.other"),
    NOI_THAT: t("statusBadge.assetType.furniture"),
    VE_SINH: t("statusBadge.assetType.cleaning"),
  };

  return map[assetType] || t("common.unknown");
};

export const assetStatusEnumToString = (assetStatus: AssetStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<AssetStatus, string> = {
    CAN_BAO_TRI: t("statusBadge.assetStatus.maintenance"),
    DA_THANH_LY: t("statusBadge.assetStatus.liquidated"),
    HOAT_DONG: t("statusBadge.assetStatus.active"),
    HU_HONG: t("statusBadge.assetStatus.broken"),
    HUY: t("statusBadge.assetStatus.cancelled"),
    KHONG_SU_DUNG: t("statusBadge.assetStatus.inactive"),
    THAT_LAC: t("statusBadge.assetStatus.lost"),
  };

  return map[assetStatus] || t("common.unknown");
};

export const serviceCategoryEnumToString = (serviceCategory: ServiceCategory, t: TFunction<"translate", undefined>) => {
  const map: Record<ServiceCategory, string> = {
    DIEN: t("statusBadge.serviceCategory.electric"),
    NUOC: t("statusBadge.serviceCategory.water"),
    GUI_XE: t("statusBadge.serviceCategory.parking"),
    INTERNET: t("statusBadge.serviceCategory.internet"),
    VE_SINH: t("statusBadge.serviceCategory.cleaning"),
    THANG_MAY: t("statusBadge.serviceCategory.elevator"),
    BAO_TRI: t("statusBadge.serviceCategory.maintenance"),
    AN_NINH: t("statusBadge.serviceCategory.security"),
    GIAT_SAY: t("statusBadge.serviceCategory.laundry"),
    TIEN_PHONG: t("statusBadge.serviceCategory.rent"),
    KHAC: t("statusBadge.serviceCategory.other"),
    DEN_BU: t("statusBadge.serviceCategory.compensation"),
  };

  return map[serviceCategory] || t("common.unknown");
};

export const serviceCalculationEnumToString = (
  serviceApply: ServiceCalculation,
  t: TFunction<"translate", undefined>
) => {
  const map: Record<ServiceCalculation, string> = {
    TINH_THEO_NGUOI: t("statusBadge.serviceCalculation.byPerson"),
    TINH_THEO_PHONG: t("statusBadge.serviceCalculation.byRoom"),
    TINH_THEO_PHUONG_TIEN: t("statusBadge.serviceCalculation.byVehicle"),
    TINH_THEO_SO: t("statusBadge.serviceCalculation.byMeter"),
  };

  return map[serviceApply] || t("common.unknown");
};

export const serviceStatusEnumToString = (status: ServiceStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<ServiceStatus, string> = {
    HOAT_DONG: t("statusBadge.serviceStatus.active"),
    KHONG_SU_DUNG: t("statusBadge.serviceStatus.inactive"),
    TAM_KHOA: t("statusBadge.serviceStatus.locked"),
  };

  return map[status] || t("common.unknown");
};

export const serviceRoomStatusEnumToString = (status: ServiceRoomStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<ServiceRoomStatus, string> = {
    DANG_SU_DUNG: t("statusBadge.serviceRoomStatus.active"),
    TAM_DUNG: t("statusBadge.serviceRoomStatus.paused"),
    DA_HUY: t("statusBadge.serviceRoomStatus.cancelled"),
  };

  return map[status] || t("common.unknown");
};

export const vehicleTypeEnumToString = (vehicleType: VehicleType, t: TFunction<"translate", undefined>) => {
  const map: Record<VehicleType, string> = {
    XE_MAY: t("statusBadge.vehicleType.motorbike"),
    O_TO: t("statusBadge.vehicleType.car"),
    XE_DAP: t("statusBadge.vehicleType.bicycle"),
    KHAC: t("statusBadge.vehicleType.other"),
  };

  return map[vehicleType] || t("common.unknown");
};

export const vehicleStatusEnumToString = (status: VehicleStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<VehicleStatus, string> = {
    KHONG_SU_DUNG: t("statusBadge.vehicleStatus.inactive"),
    SU_DUNG: t("statusBadge.vehicleStatus.active"),
    TAM_KHOA: t("statusBadge.vehicleStatus.locked"),
  };

  return map[status] || t("common.unknown");
};

export const contractStatusEnumToString = (status: ContractStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<ContractStatus, string> = {
    HIEU_LUC: t("statusBadge.contractStatus.valid"),
    SAP_HET_HAN: t("statusBadge.contractStatus.expiring"),
    DA_HUY: t("statusBadge.contractStatus.cancelled"),
    KET_THUC_DUNG_HAN: t("statusBadge.contractStatus.endedOnTime"),
    KET_THUC_CO_BAO_TRUOC: t("statusBadge.contractStatus.endedNotice"),
    TU_Y_HUY_BO: t("statusBadge.contractStatus.terminated"),
    CHO_KICH_HOAT: t("statusBadge.contractStatus.pending"),
  };

  return map[status] || t("common.unknown");
};

export const buildingTypeEnumToString = (type: BuildingType, t: TFunction<"translate", undefined>) => {
  const map: Record<BuildingType, string> = {
    CAN_HO_DICH_VU: t("statusBadge.buildingType.canHoDichVu"),
    CHUNG_CU_MINI: t("statusBadge.buildingType.chungCuMini"),
    KHAC: t("statusBadge.buildingType.other"),
    NHA_TRO: t("statusBadge.buildingType.nhaTro"),
  };

  return map[type] || t("common.unknown");
};

export const buildingStatusEnumToString = (status: BuildingStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<BuildingStatus, string> = {
    HOAT_DONG: t("statusBadge.buildingStatus.active"),
    HUY_HOAT_DONG: t("statusBadge.buildingStatus.inactive"),
    TAM_KHOA: t("statusBadge.buildingStatus.locked"),
  };

  return map[status] || t("common.unknown");
};

export const floorTypeEnumToString = (type: FloorType, t: TFunction<"translate", undefined>) => {
  const map: Record<FloorType, string> = {
    CHO_THUE: t("statusBadge.floorType.forRent"),
    DE_O: t("statusBadge.floorType.residential"),
    KHAC: t("statusBadge.floorType.other"),
    KHO: t("statusBadge.floorType.storage"),
    KHONG_CHO_THUE: t("statusBadge.floorType.notForRent"),
  };

  return map[type] || t("common.unknown");
};

export const floorStatusEnumToString = (status: FloorStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<FloorStatus, string> = {
    HOAT_DONG: t("statusBadge.floorStatus.active"),
    KHONG_SU_DUNG: t("statusBadge.floorStatus.inactive"),
    TAM_KHOA: t("statusBadge.floorStatus.locked"),
  };

  return map[status] || t("common.unknown");
};

export const roomTypeEnumToString = (type: RoomType, t: TFunction<"translate", undefined>) => {
  const map: Record<RoomType, string> = {
    KHAC: t("statusBadge.roomType.other"),
    CAO_CAP: t("statusBadge.roomType.vip"),
    DON: t("statusBadge.roomType.single"),
    GHEP: t("statusBadge.roomType.shared"),
  };

  return map[type] || t("common.unknown");
};

export const roomStatusEnumToString = (status: RoomStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<RoomStatus, string> = {
    TAM_KHOA: t("statusBadge.roomStatus.locked"),
    CHUA_HOAN_THIEN: t("statusBadge.roomStatus.unfinished"),
    DA_DAT_COC: t("statusBadge.roomStatus.deposit"),
    DANG_BAO_TRI: t("statusBadge.roomStatus.maintain"),
    DANG_THUE: t("statusBadge.roomStatus.renting"),
    HUY_HOAT_DONG: t("statusBadge.roomStatus.inactive"),
    TRONG: t("statusBadge.roomStatus.empty"),
  };

  return map[status] || t("common.unknown");
};

export const assetBelongToEnumToString = (belongTo: AssetBeLongTo, t: TFunction<"translate", undefined>) => {
  const map: Record<AssetBeLongTo, string> = {
    CA_NHAN: t("statusBadge.assetBelongTo.personal"),
    CHUNG: t("statusBadge.assetBelongTo.common"),
    PHONG: t("statusBadge.assetBelongTo.room"),
  };

  return map[belongTo] || t("common.unknown");
};

export const genderEnumToString = (gender: Gender, t: TFunction<"translate", undefined>) => {
  const map: Record<Gender, string> = {
    FEMALE: t("statusBadge.gender.female"),
    MALE: t("statusBadge.gender.male"),
    OTHER: t("common.other"),
    UNKNOWN: t("common.unknown"),
  };

  return map[gender] || t("common.unknown");
};

export const tenantStatusEnumToString = (status: TenantStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<TenantStatus, string> = {
    DA_TRA_PHONG: t("statusBadge.tenantStatus.returned"),
    DANG_THUE: t("statusBadge.tenantStatus.renting"),
    HUY_BO: t("statusBadge.tenantStatus.cancelled"),
    KHOA: t("statusBadge.tenantStatus.locked"),
    CHO_TAO_HOP_DONG: t("statusBadge.tenantStatus.tenantStatus"),
  };

  return map[status] || t("common.unknown");
};

export const meterTypeEnumToString = (type: MeterType, t: TFunction<"translate", undefined>) => {
  const map: Record<MeterType, string> = {
    DIEN: t("statusBadge.meterType.electric"),
    NUOC: t("statusBadge.meterType.water"),
  };

  return map[type] || t("common.unknown");
};

export const invoiceTypeEnumToString = (type: InvoiceType, t: TFunction<"translate", undefined>) => {
  const map: Record<InvoiceType, string> = {
    CUOI_CUNG: t("statusBadge.invoiceType.final"),
    HANG_THANG: t("statusBadge.invoiceType.monthly"),
  };

  return map[type] || t("common.unknown");
};

export const invoiceStatusEnumToString = (status: InvoiceStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<InvoiceStatus, string> = {
    CHO_THANH_TOAN: t("statusBadge.invoiceStatus.waitingPayment"),
    CHUA_THANH_TOAN: t("statusBadge.invoiceStatus.unpaid"),
    DA_THANH_TOAN: t("statusBadge.invoiceStatus.paid"),
    HUY: t("statusBadge.invoiceStatus.cancelled"),
    KHOI_PHUC: t("statusBadge.invoiceStatus.restore"),
    QUA_HAN: t("statusBadge.invoiceStatus.overdue"),
  };

  return map[status] || t("common.unknown");
};

export const receiptMethodEnumToString = (method: PaymentMethod, t: TFunction<"translate", undefined>) => {
  const map: Record<PaymentMethod, string> = {
    CHON_PHUONG_THUC: t("statusBadge.paymentMethod.choose"),
    CHUYEN_KHOAN: t("statusBadge.paymentMethod.transfer"),
    MOMO: t("statusBadge.paymentMethod.momo"),
    TIEN_MAT: t("statusBadge.paymentMethod.cash"),
    VNPAY: t("statusBadge.paymentMethod.vnpay"),
    ZALOPAY: t("statusBadge.paymentMethod.zalopay"),
  };

  return map[method] || t("common.unknown");
};

export const receiptStatusEnumToString = (status: PaymentStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<PaymentStatus, string> = {
    CHO_THANH_TOAN: t("statusBadge.paymentStatus.pending"),
    CHO_XAC_NHAN: t("statusBadge.paymentStatus.confirming"),
    DA_THANH_TOAN: t("statusBadge.paymentStatus.paid"),
    HUY: t("statusBadge.paymentStatus.cancelled"),
    TU_CHOI: t("statusBadge.paymentStatus.rejected"),
  };

  return map[status] || t("common.unknown");
};

export const notificationTypeEnumToString = (type: NotificationType, t: TFunction<"translate", undefined>) => {
  const map: Record<NotificationType, string> = {
    CHUNG: t("statusBadge.notificationType.common"),
    HE_THONG: t("statusBadge.notificationType.system"),
    KHAC: t("statusBadge.notificationType.other"),
  };

  return map[type] || t("common.unknown");
};

export const depositStatusEnumToString = (status: DepositStatus, t: TFunction<"translate", undefined>) => {
  const map: Record<DepositStatus, string> = {
    CHO_XAC_NHAN: t("statusBadge.depositStatus.pending"),
    CHUA_NHAN_COC: t("statusBadge.depositStatus.notReceived"),
    DA_DAT_COC: t("statusBadge.depositStatus.common"),
    DA_HOAN_TRA: t("statusBadge.depositStatus.refunded"),
    HUY: t("statusBadge.depositStatus.cancelled"),
    KHONG_TRA_COC: t("statusBadge.depositStatus.nonRefund"),
  };

  return map[status] || t("common.unknown");
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

export const switchRole = (role: RoleType, t: TFunction<"translation", undefined>): string => {
  const map: Record<RoleType, string> = {
    ADMIN: t("profile.admin"),
    MANAGER: t("profile.manager"),
    STAFF: t("profile.staff"),
    USER: t("profile.user"),
  };

  return map[role];
};

export const localeMap: Record<string, Locale> = {
  vi: vi,
  en: enUS,
};

export const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const genderToString = (gender: Gender | undefined) => {
  switch (gender) {
    case Gender.MALE:
      return "Nam";
    case Gender.FEMALE:
      return "Nữ";
    case Gender.OTHER:
      return "Khác";
    case Gender.UNKNOWN:
    default:
      return "N/A";
  } 
};

export const tenantStatusToString = (status: TenantStatus | undefined) => {
  switch (status) {
    case TenantStatus.DANG_THUE:
      return "Đang thuê";
    case TenantStatus.DA_TRA_PHONG:
      return "Đã trả phòng";
    case TenantStatus.CHO_TAO_HOP_DONG:
      return "Chờ tạo hợp đồng";
    case TenantStatus.KHOA:
      return "Khóa";
    case TenantStatus.HUY_BO:
      return "Hủy bỏ";
    default:
      return "N/A";
  }

};
export const assetStatusToString = (status: AssetStatus | string) => {
  switch (status) {
    case AssetStatus.HU_HONG:
      return "Hư hỏng";
    case AssetStatus.CAN_BAO_TRI:
      return "Cần bảo trì";
    case AssetStatus.THAT_LAC:
      return "Thất lạc";
    case AssetStatus.DA_THANH_LY:
      return "Đã thanh lý";
    case AssetStatus.KHONG_SU_DUNG:
      return "Không sử dụng";
    case AssetStatus.HOAT_DONG:
      return "Hoạt động";
    case AssetStatus.HUY:
      return "Hủy";
    default:
      return "N/A";
  }
};