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
  ERROR_STATISTICS = "Có lỗi xảy ra khi lấy dữ liệu thống kê",
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
/* ROOM */
export enum RoomStatus {
  TRONG = "TRONG",
  DANG_THUE = "DANG_THUE",
  DA_DAT_COC = "DA_DAT_COC",
  DANG_BAO_TRI = "DANG_BAO_TRI",
  CHUA_HOAN_THIEN = "CHUA_HOAN_THIEN",
  TAM_KHOA = "TAM_KHOA",
  HUY_HOAT_DONG = "HUY_HOAT_DONG",
}
export enum RoomType {
  GHEP = "GHEP",
  DON = "DON",
  KHAC = "KHAC",
}
/* Asset */
export enum AssetBeLongTo {
  PHONG = "PHONG",
  CHUNG = "CHUNG",
  CA_NHAN = "CA_NHAN",
}

export enum AssetStatus {
  SU_DUNG = "SU_DUNG",
  HU_HONG = "HU_HONG",
  CAN_BAO_TRI = "CAN_BAO_TRI",
  THAT_LAC = "THAT_LAC",
  DA_THANH_LY = "DA_THANH_LY",
}

/* VEHICLE */
export enum VehicleType {
  XE_MAY = "XE_MAY",
  O_TO = "O_TO",
  XE_DAP = "XE_DAP",
  KHAC = "KHAC",
}

export enum VehicleStatus {
  SU_DUNG = "SU_DUNG",
  KHONG_SU_DUNG = "KHONG_SU_DUNG",
  TAM_KHOA = "TAM_KHOA",
}

/* TENANT */
export enum TenantStatus {
  DANG_THUE = "DANG_THUE",
  DA_TRA_PHONG = "DA_TRA_PHONG",
  TIEM_NANG = "TIEM_NANG",
  KHOA = "KHOA",
}
/*CONTRACT */
export enum ContractStatus {
  HIEU_LUC = "HIEU_LUC",
  SAP_HET_HAN = "SAP_HET_HAN",
  HET_HAN = "HET_HAN",
  DA_THANH_LY = "DA_THANH_LY",
  DA_HUY = "DA_HUY",
}

/* DEFAULT SERVICE */
export enum DefaultServiceAppliesTo {
  PHONG = "PHONG",
  HOP_DONG = "HOP_DONG",
}

export enum DefaultServiceStatus {
  HOAT_DONG = "HOAT_DONG",
  TAM_DUNG = "TAM_DUNG",
  HUY_BO = "HUY_BO",
}

/* SERVICE */
export enum ServiceAppliedBy {
  PHONG = "PHONG",
  NGUOI = "NGUOI",
  TANG = "TANG",
}

export enum ServiceStatus {
  HOAT_DONG = "HOAT_DONG",
  TAM_KHOA = "TAM_KHOA",
  KHONG_SU_DUNG = "KHONG_SU_DUNG",
}

export enum ServiceType {
  CO_DINH = "CO_DINH",
  TINH_THEO_SO = "TINH_THEO_SO",
}

/* SERVICE ROOM */
export enum ServiceRoomStatus {
  DANG_SU_DUNG = "DANG_SU_DUNG",
  TAM_DUNG = "TAM_DUNG",
  DA_HUY = "DA_HUY",
}

/* METER */
export enum MeterType {
  DIEN = "DIEN",
  NUOC = "NUOC",
}
