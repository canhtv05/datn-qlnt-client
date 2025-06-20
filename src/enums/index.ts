export enum Viewport {
  "2XL" = 1536,
  XL = 1280,
  LG = 1024,
  MD = 768,
  SM = 640,
}

export enum Gender {
  UNKNOWN = "UNKNOWN",
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum Status {
  UPDATE_SUCCESS = "Cập nhật thành công",
  UPDATE_FAILED = "Cập nhật thất bại",
  ADD_SUCCESS = "Thêm thành công",
  ADD_FAILED = "Thêm thất bại",
  REMOVE_SUCCESS = "Xóa thành công",
  REMOVE_FAILED = "Xóa thất bại",
  ERROR = "Có lỗi xảy ra",
  LOGOUT_FAILED = "Đăng xuất thất bại",
  LOGOUT_SUCCESS = "Đăng xuất thành công",
}

/* BUILDING */
export enum BuildingType {
  NHA_TRO = "NHA_TRO",
  CHUNG_CU_MINI = "CHUNG_CU_MINI",
  CAN_HO_DICH_VU = "CAN_HO_DICH_VU",
  KHAC = "KHAC",
}

export enum BuildingStatus {
  HOAT_DONG = "HOAT_DONG",
  TAM_KHOA = "TAM_KHOA",
  HUY_HOAT_DONG = "HUY_HOAT_DONG",
}
