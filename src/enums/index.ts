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
  REGISTER_SUCCESS = "Đăng ký thành công, vui lòng đăng nhập",
}

export enum Notice {
  REMOVE = "Hành động này sẽ xóa vĩnh viễn dữ liệu đã chọn khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục?",
  TOGGLE_STATUS = "Bạn có chắc chắn muốn thay đổi trạng thái của mục này?",
  UPDATE = "Hành động này sẽ cập nhật thông tin hiện tại. Bạn có chắc chắn muốn tiếp tục?",
  ADD = "Hành động này sẽ thêm mới một mục vào hệ thống. Bạn có chắc chắn muốn thực hiện?",
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

/* FLOOR */
export enum FloorType {
  CHO_THUE = "CHO_THUE",
  KHONG_CHO_THUE = "KHONG_CHO_THUE",
  DE_O = "DE_O",
  KHO = "KHO",
  KHAC = "KHAC",
}

export enum FloorStatus {
  HOAT_DONG = "HOAT_DONG",
  KHONG_SU_DUNG = "KHONG_SU_DUNG",
  TAM_KHOA = "TAM_KHOA",
}

/* Asset Type */
export enum AssetGroup {
  GIA_DUNG = "GIA_DUNG",
  NOI_THAT = "NOI_THAT",
  DIEN = "DIEN",
  CA_NHAN = "CA_NHAN",
  KHAC = "KHAC",
}
