import { AssetStatus, AssetType, ContractStatus, Gender, ServiceCategory, VehicleType } from "@/enums";
import { RoleType } from "@/hooks/useHighestRole";
import { UserResponse } from "@/types";
import { useEditorStore } from "@/zustand/editorStore";
import { FindResultType } from "ckeditor5";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ROLE_PRIORITY: RoleType[] = ["USER", "STAFF", "MANAGER", "ADMIN"];

export const getHighestRole = (roles: RoleType[]): RoleType => {
  return roles.sort((a, b) => ROLE_PRIORITY.indexOf(b) - ROLE_PRIORITY.indexOf(a))[0];
};

export const formattedVND = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
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

export const vehicleTypeEnumToString = (vehicleType: VehicleType) => {
  const map: Record<VehicleType, string> = {
    XE_MAY: "Xe máy",
    O_TO: "Ô tô",
    XE_DAP: "Xe đạp",
    KHAC: "Khác",
  };

  return map[vehicleType] || "Không xác định";
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

export const checkUser = (user: UserResponse | null, isLoading: boolean): boolean => {
  if (
    (!user?.dob || (user?.gender !== Gender.FEMALE && user?.gender !== Gender.MALE) || !user?.phoneNumber) &&
    !isLoading
  ) {
    return false;
  }
  return true;
};
