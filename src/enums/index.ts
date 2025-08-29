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
  OTHER = "OTHER",
}

export enum Status {
  UPDATE_SUCCESS = "status.updateSuccess",
  UPDATE_FAILED = "status.updateFailed",
  ADD_SUCCESS = "status.addSuccess",
  ADD_FAILED = "status.addFailed",
  REMOVE_SUCCESS = "status.removeSuccess",
  REMOVE_FAILED = "status.removeFailed",
  ERROR = "status.error",
  LOGOUT_FAILED = "status.logoutFailed",
  LOGOUT_SUCCESS = "status.logoutSuccess",
  REGISTER_SUCCESS = "status.registerSuccess",
  ERROR_STATISTICS = "status.errorStatistics",
  RESTORE_SUCCESS = "status.restoreSuccess",
  RESTORE_FAILED = "status.restoreFailed",
}

export enum Notice {
  REMOVE = "notice.remove",
  TOGGLE_STATUS = "notice.toggleStatus",
  RESTORE = "notice.restore",
  RESTORES = "notice.restores",
  UPDATE = "notice.update",
  ADD = "notice.add",
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
  CAO_CAP = "CAO_CAP",
}

/* Asset */
export enum AssetBeLongTo {
  PHONG = "PHONG",
  CHUNG = "CHUNG",
  CA_NHAN = "CA_NHAN",
}

export enum AssetType {
  GIA_DUNG = "GIA_DUNG",
  VE_SINH = "VE_SINH",
  NOI_THAT = "NOI_THAT",
  DIEN = "DIEN",
  AN_NINH = "AN_NINH",
  KHAC = "KHAC",
}

export enum AssetStatus {
  HU_HONG = "HU_HONG",
  CAN_BAO_TRI = "CAN_BAO_TRI",
  THAT_LAC = "THAT_LAC",
  DA_THANH_LY = "DA_THANH_LY",
  KHONG_SU_DUNG = "KHONG_SU_DUNG",
  HOAT_DONG = "HOAT_DONG",
  HUY = "HUY",
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
  CHO_TAO_HOP_DONG = "CHO_TAO_HOP_DONG",
  KHOA = "KHOA",
  HUY_BO = "HUY_BO",
}
/*CONTRACT */
export enum ContractStatus {
  HIEU_LUC = "HIEU_LUC",
  SAP_HET_HAN = "SAP_HET_HAN",
  DA_HUY = "DA_HUY",
  KET_THUC_DUNG_HAN = "KET_THUC_DUNG_HAN",
  KET_THUC_CO_BAO_TRUOC = "KET_THUC_CO_BAO_TRUOC",
  TU_Y_HUY_BO = "TU_Y_HUY_BO",
  CHO_KICH_HOAT = "CHO_KICH_HOAT",
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

export enum ServiceCategory {
  DIEN = "DIEN",
  NUOC = "NUOC",
  GUI_XE = "GUI_XE",
  INTERNET = "INTERNET",
  VE_SINH = "VE_SINH",
  THANG_MAY = "THANG_MAY",
  BAO_TRI = "BAO_TRI",
  AN_NINH = "AN_NINH",
  GIAT_SAY = "GIAT_SAY",
  TIEN_PHONG = "TIEN_PHONG",
  KHAC = "KHAC",
  DEN_BU = "DEN_BU",
}

export enum ServiceCalculation {
  TINH_THEO_SO = "TINH_THEO_SO",
  TINH_THEO_NGUOI = "TINH_THEO_NGUOI",
  TINH_THEO_PHONG = "TINH_THEO_PHONG",
  TINH_THEO_PHUONG_TIEN = "TINH_THEO_PHUONG_TIEN",
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

// invoice
export enum InvoiceStatus {
  CHUA_THANH_TOAN = "CHUA_THANH_TOAN",
  DA_THANH_TOAN = "DA_THANH_TOAN",
  CHO_THANH_TOAN = "CHO_THANH_TOAN",
  QUA_HAN = "QUA_HAN",
  HUY = "HUY",
  KHOI_PHUC = "KHOI_PHUC", // ko dung
}

export enum InvoiceType {
  HANG_THANG = "HANG_THANG",
  CUOI_CUNG = "CUOI_CUNG",
}

export enum InvoiceItemType {
  DIEN = "DIEN",
  NUOC = "NUOC",
  DICH_VU = "DICH_VU",
  TIEN_PHONG = "TIEN_PHONG",
  DEN_BU = "DEN_BU",
}

/* PAYMENT RECEIPT */
export enum PaymentMethod {
  CHON_PHUONG_THUC = "CHON_PHUONG_THUC",
  TIEN_MAT = "TIEN_MAT",
  CHUYEN_KHOAN = "CHUYEN_KHOAN",
  VNPAY = "VNPAY",
  ZALOPAY = "ZALOPAY",
  MOMO = "MOMO",
}

export enum PaymentStatus {
  CHO_THANH_TOAN = "CHO_THANH_TOAN",
  CHO_XAC_NHAN = "CHO_XAC_NHAN",
  DA_THANH_TOAN = "DA_THANH_TOAN",
  TU_CHOI = "TU_CHOI",
  HUY = "HUY",
}

/* NOTIFICATION */
export enum NotificationType {
  CHUNG = "CHUNG",
  HE_THONG = "HE_THONG",
  KHAC = "KHAC",
}

export enum SidebarKey {
  DASHBOARD_LABEL = "sidebar.dashboard.label",
  DASHBOARD_TITLE = "sidebar.dashboard.title",
  STATISTICS_TITLE = "sidebar.statistics.title",

  FACILITIES_LABEL = "sidebar.facilities.label",
  FACILITIES_TITLE = "sidebar.facilities.title",
  BUILDINGS = "sidebar.facilities.buildings",
  FLOORS = "sidebar.facilities.floors",
  ROOMS = "sidebar.facilities.rooms",

  ASSETS_LABEL = "sidebar.assets.label",
  ASSETS_TITLE = "sidebar.assets.title",
  ASSETS = "sidebar.assets.assets",
  ROOM_ASSETS = "sidebar.assets.roomAssets",

  SERVICES_LABEL = "sidebar.services.label",
  SERVICES_TITLE = "sidebar.services.title",
  SERVICES = "sidebar.services.services",
  ROOM_SERVICES = "sidebar.services.roomServices",

  CUSTOMERS_LABEL = "sidebar.customers.label",
  CUSTOMERS_TITLE = "sidebar.customers.title",
  TENANTS = "sidebar.customers.tenants",
  VEHICLES = "sidebar.customers.vehicles",
  CONTRACTS = "sidebar.customers.contracts",

  FINANCE_LABEL = "sidebar.finance.label",
  FINANCE_TITLE = "sidebar.finance.title",
  METERS = "sidebar.finance.meters",
  METER_READING = "sidebar.finance.meterReading",
  INVOICE = "sidebar.finance.invoice",
  RECEIPT = "sidebar.finance.receipt",
  DEPOSIT = "sidebar.finance.deposit",

  NOTIFICATIONS_LABEL = "sidebar.notifications.label",
  NOTIFICATIONS_TITLE = "sidebar.notifications.title",

  INFO = "sidebar.user.info",
  ROOM_INFO = "sidebar.user.roomInfo",
  RECEIPTS = "sidebar.user.receipts",
  INVOICES = "sidebar.user.invoices",
  USER_CONTRACTS = "sidebar.user.contracts",
  USER_DEPOSITS = "sidebar.user.deposits",
  MEMBERS = "sidebar.user.members",
  ASSETS_USER = "sidebar.user.assets",
  SERVICES_USER = "sidebar.user.services",
  VEHICLES_USER = "sidebar.user.vehicles",
  ELECTRIC = "sidebar.user.electric",
  WATER = "sidebar.user.water",
}

/* DEPOSIT */
export enum DepositStatus {
  DA_DAT_COC = "DA_DAT_COC",
  DA_HOAN_TRA = "DA_HOAN_TRA",
  CHUA_NHAN_COC = "CHUA_NHAN_COC",
  CHO_XAC_NHAN = "CHO_XAC_NHAN",
  KHONG_TRA_COC = "KHONG_TRA_COC",
  HUY = "HUY",
}
