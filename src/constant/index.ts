import images from "@/assets/imgs";
import {
  AssetGroup,
  AssetBeLongTo,
  BuildingStatus,
  AssetStatus,
  BuildingType,
  FloorStatus,
  FloorType,
  RoomStatus,
  RoomType,
  TenantStatus,
  Gender,
  VehicleType,
  VehicleStatus,
  ContractStatus,
  ServiceType,
  ServiceAppliedBy,
  ServiceStatus,
  DefaultServiceAppliesTo,
  DefaultServiceStatus,
  ServiceRoomStatus,
  MeterType,
  InvoiceStatus,
  InvoiceType,
  ServiceCategory,
  ServiceCalculation,
  InvoiceItemType,
  AssetType,
  PaymentStatus,
  PaymentMethod,
  NotificationType,
  SidebarKey,
} from "@/enums";
import { formatNumber, formattedCurrency } from "@/lib/utils";
import { IBtnType } from "@/types";
import { TFunction } from "i18next";
import {
  Download,
  DoorOpen,
  PenTool,
  Plus,
  Trash2,
  Upload,
  SquarePen,
  ArrowRightLeft,
  Eye,
  Building2,
  ToggleLeft,
  Banknote,
  Gavel,
  History,
  Undo,
} from "lucide-react";

export interface SideBarType {
  label?: string;
  title: string;
  url: string;
  icon: string;
  items?: {
    title: string;
    url: string;
    icon: string;
  }[];
}

export const sidebarItems = (
  role: "USER" | "ADMIN" | "STAFF" | "MANAGER",
  t: TFunction<"translate", undefined>
): SideBarType[] | [] => {
  const MANAGER = [
    {
      label: t(SidebarKey.DASHBOARD_LABEL),
      title: t(SidebarKey.DASHBOARD_TITLE),
      url: "/dashboard",
      icon: images.bulletinBoard,
    },
    {
      label: t(SidebarKey.FACILITIES_LABEL),
      title: t(SidebarKey.FACILITIES_TITLE),
      url: "/facilities",
      icon: images.building,
      items: [
        {
          title: t(SidebarKey.BUILDINGS),
          url: "/facilities/buildings",
          icon: images.oneBuilding,
        },
        {
          title: t(SidebarKey.FLOORS),
          url: "/facilities/floors",
          icon: images.floor,
        },
        {
          title: t(SidebarKey.ROOMS),
          url: "/facilities/rooms",
          icon: images.room,
        },
      ],
    },
    {
      label: t(SidebarKey.ASSETS_LABEL),
      title: t(SidebarKey.ASSETS_TITLE),
      url: "/asset-management",
      icon: images.fixedAsset,
      items: [
        {
          title: t(SidebarKey.ASSETS),
          url: "/asset-management/assets",
          icon: images.assets,
        },
        {
          title: t(SidebarKey.ROOM_ASSETS),
          url: "/asset-management/room-assets",
          icon: images.coolingDevice,
        },
      ],
    },
    {
      label: t(SidebarKey.SERVICES_LABEL),
      title: t(SidebarKey.SERVICES_TITLE),
      url: "/service-management",
      icon: images.customerReview,
      items: [
        {
          title: t(SidebarKey.SERVICES),
          url: "/service-management/services",
          icon: images.optimizing,
        },
        {
          title: t(SidebarKey.ROOM_SERVICES),
          url: "/service-management/room-services",
          icon: images.mattress,
        },
      ],
    },
    {
      label: t(SidebarKey.CUSTOMERS_LABEL),
      title: t(SidebarKey.CUSTOMERS_TITLE),
      url: "/customers",
      icon: images.lender,
      items: [
        {
          title: t(SidebarKey.TENANTS),
          url: "/customers/tenants",
          icon: images.team,
        },
        {
          title: t(SidebarKey.VEHICLES),
          url: "/customers/vehicles",
          icon: images.hatchback,
        },
        {
          title: t(SidebarKey.CONTRACTS),
          url: "/customers/contracts",
          icon: images.contract,
        },
      ],
    },
    {
      label: t(SidebarKey.FINANCE_LABEL),
      title: t(SidebarKey.FINANCE_TITLE),
      url: "/finance",
      icon: images.finance,
      items: [
        {
          title: t(SidebarKey.METERS),
          url: "/finance/meters",
          icon: images.usage,
        },
        {
          title: t(SidebarKey.METER_READING),
          url: "/finance/meter-reading",
          icon: images.writing,
        },
        {
          title: t(SidebarKey.INVOICE),
          url: "/finance/invoice",
          icon: images.invoice,
        },
        {
          title: t(SidebarKey.RECEIPT),
          url: "/finance/payment-receipt",
          icon: images.receipt,
        },
      ],
    },
    {
      label: t(SidebarKey.NOTIFICATIONS_LABEL),
      title: t(SidebarKey.NOTIFICATIONS_TITLE),
      url: "/notifications",
      icon: images.notification,
    },
  ];

  const USER = [
    {
      label: t(SidebarKey.DASHBOARD_LABEL),
      title: t(SidebarKey.DASHBOARD_TITLE),
      url: "/dashboard",
      icon: images.bulletinBoard,
    },
    {
      label: t(SidebarKey.INFO),
      title: t(SidebarKey.ROOM_INFO),
      url: "/room",
      icon: images.room,
    },
    {
      title: t(SidebarKey.RECEIPTS),
      url: "/payment-receipts",
      icon: images.receipt,
    },
    {
      title: t(SidebarKey.INVOICES),
      url: "/invoices",
      icon: images.invoice,
    },
    {
      title: t(SidebarKey.USER_CONTRACTS),
      url: "/contracts",
      icon: images.contract,
    },
    // {
    //   title: "Xem hóa đơn cũ",
    //   url: "/invoices/history",
    //   icon: images.history,
    // },
    {
      title: t(SidebarKey.MEMBERS),
      url: "/members",
      icon: images.team,
    },
    {
      title: t(SidebarKey.ELECTRIC),
      url: "/electric",
      icon: images.energy,
    },
    {
      title: t(SidebarKey.WATER),
      url: "/water",
      icon: images.water,
    },
  ];

  if (role === "MANAGER" || role === "ADMIN") return MANAGER;
  else if (role === "USER") return USER;
  else return [];
};

export const COLOR_CLASS = {
  gray: "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-100",

  green:
    "text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 hover:text-green-700 dark:hover:text-green-100",

  yellow:
    "text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-800 hover:text-yellow-700 dark:hover:text-yellow-100",

  red: "text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-700 dark:hover:text-red-100",

  blue: "text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-100",

  purple:
    "text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800 hover:text-purple-700 dark:hover:text-purple-100",

  orange:
    "text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 hover:bg-orange-200 dark:hover:bg-orange-800 hover:text-orange-700 dark:hover:text-orange-100",

  pink: "text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-pink-900 border border-pink-200 dark:border-pink-700 hover:bg-pink-200 dark:hover:bg-pink-800 hover:text-pink-700 dark:hover:text-pink-100",

  indigo:
    "text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-800 hover:text-indigo-700 dark:hover:text-indigo-100",

  teal: "text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-900 border border-teal-200 dark:border-teal-700 hover:bg-teal-200 dark:hover:bg-teal-800 hover:text-teal-700 dark:hover:text-teal-100",

  cyan: "text-cyan-600 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700 hover:bg-cyan-200 dark:hover:bg-cyan-800 hover:text-cyan-700 dark:hover:text-cyan-100",

  sky: "text-sky-600 dark:text-sky-300 bg-sky-100 dark:bg-sky-900 border border-sky-200 dark:border-sky-700 hover:bg-sky-200 dark:hover:bg-sky-800 hover:text-sky-700 dark:hover:text-sky-100",

  neutral:
    "text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-100",

  amber:
    "text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800 hover:text-amber-700 dark:hover:text-amber-100",

  rose: "text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 hover:bg-rose-200 dark:hover:bg-rose-800 hover:text-rose-700 dark:hover:text-rose-100",

  lime: "text-lime-600 dark:text-lime-300 bg-lime-100 dark:bg-lime-900 border border-lime-200 dark:border-lime-700 hover:bg-lime-200 dark:hover:bg-lime-800 hover:text-lime-700 dark:hover:text-lime-100",

  stone:
    "text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 hover:text-stone-700 dark:hover:text-stone-100",

  zinc: "text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-100",

  black:
    "text-black dark:text-white bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white",
};

export const STATUS_BADGE = (t: TFunction<"translation", undefined>) => {
  return [
    {
      value: "__EMPTY__",
      label: t("statusBadge.empty"),
      className: COLOR_CLASS.gray,
    },
    {
      value: "",
      label: t("statusBadge.empty"),
      className: COLOR_CLASS.gray,
    },
    {
      value: null,
      label: t("statusBadge.empty"),
      className: COLOR_CLASS.gray,
    },
    {
      value: "isRepresentative=true",
      label: t("statusBadge.yes"),
      className: COLOR_CLASS.green,
    },
    {
      value: "isRepresentative=false",
      label: t("statusBadge.no"),
      className: COLOR_CLASS.stone,
    },
    // --- Trạng thái hoạt động của tòa nhà ---
    {
      value: BuildingStatus.HOAT_DONG,
      label: t("statusBadge.buildingStatus.active"),
      className: COLOR_CLASS.green,
    },
    {
      value: BuildingStatus.TAM_KHOA,
      label: t("statusBadge.buildingStatus.locked"),
      className: COLOR_CLASS.yellow,
    },
    {
      value: BuildingStatus.HUY_HOAT_DONG,
      label: t("statusBadge.buildingStatus.inactive"),
      className: COLOR_CLASS.red,
    },
    // --- Loại phòng ---
    {
      value: RoomType.CAO_CAP,
      label: t("statusBadge.roomType.vip"),
      className: COLOR_CLASS.rose,
    },
    {
      value: RoomType.GHEP,
      label: t("statusBadge.roomType.shared"),
      className: COLOR_CLASS.blue,
    },
    {
      value: RoomType.DON,
      label: t("statusBadge.roomType.single"),
      className: COLOR_CLASS.purple,
    },
    {
      value: RoomType.KHAC,
      label: t("statusBadge.roomType.other"),
      className: COLOR_CLASS.neutral,
    },
    // --- Loại tòa nhà ---
    {
      value: BuildingType.NHA_TRO,
      label: t("statusBadge.buildingType.nhaTro"),
      className: COLOR_CLASS.blue,
    },
    {
      value: BuildingType.CHUNG_CU_MINI,
      label: t("statusBadge.buildingType.chungCuMini"),
      className: COLOR_CLASS.purple,
    },
    {
      value: BuildingType.CAN_HO_DICH_VU,
      label: t("statusBadge.buildingType.canHoDichVu"),
      className: COLOR_CLASS.indigo,
    },
    {
      value: BuildingType.KHAC,
      label: t("statusBadge.buildingType.other"),
      className: COLOR_CLASS.neutral,
    },
    // --- Trạng thái phòng ---
    {
      value: RoomStatus.TRONG,
      label: t("statusBadge.roomStatus.empty"),
      className: COLOR_CLASS.green,
    },
    {
      value: RoomStatus.DA_DAT_COC,
      label: t("statusBadge.roomStatus.deposit"),
      className: COLOR_CLASS.yellow,
    },
    {
      value: RoomStatus.DANG_BAO_TRI,
      label: t("statusBadge.roomStatus.maintain"),
      className: COLOR_CLASS.gray,
    },
    {
      value: RoomStatus.CHUA_HOAN_THIEN,
      label: t("statusBadge.roomStatus.unfinished"),
      className: COLOR_CLASS.blue,
    },
    {
      value: RoomStatus.TAM_KHOA,
      label: t("statusBadge.roomStatus.locked"),
      className: COLOR_CLASS.purple,
    },
    {
      value: RoomStatus.HUY_HOAT_DONG,
      label: t("statusBadge.roomStatus.inactive"),
      className: COLOR_CLASS.black,
    },
    // --- Trạng thái tầng ---
    {
      value: FloorStatus.HOAT_DONG,
      label: t("statusBadge.floorStatus.active"),
      className: COLOR_CLASS.green,
    },
    {
      value: FloorStatus.KHONG_SU_DUNG,
      label: t("statusBadge.floorStatus.inactive"),
      className: COLOR_CLASS.stone,
    },
    {
      value: FloorStatus.TAM_KHOA,
      label: t("statusBadge.floorStatus.locked"),
      className: COLOR_CLASS.yellow,
    },
    // --- Loại tầng ---
    {
      value: FloorType.CHO_THUE,
      label: t("statusBadge.floorType.forRent"),

      className: COLOR_CLASS.sky,
    },
    {
      value: FloorType.KHONG_CHO_THUE,
      label: t("statusBadge.floorType.notForRent"),
      className: COLOR_CLASS.zinc,
    },
    {
      value: FloorType.DE_O,
      label: t("statusBadge.floorType.residential"),
      className: COLOR_CLASS.cyan,
    },
    {
      value: FloorType.KHO,
      label: t("statusBadge.floorType.storage"),
      className: COLOR_CLASS.amber,
    },
    {
      value: FloorType.KHAC,
      label: t("statusBadge.floorType.other"),
      className: COLOR_CLASS.neutral,
    },
    // --- Nhóm tài sản ---
    {
      value: AssetGroup.GIA_DUNG,
      label: t("statusBadge.assetGroup.houseware"),
      className: COLOR_CLASS.rose,
    },
    {
      value: AssetGroup.NOI_THAT,
      label: t("statusBadge.assetGroup.furniture"),
      className: COLOR_CLASS.lime,
    },
    {
      value: AssetGroup.DIEN,
      label: t("statusBadge.assetGroup.electric"),
      className: COLOR_CLASS.orange,
    },
    {
      value: AssetGroup.CA_NHAN,
      label: t("statusBadge.assetGroup.personal"),
      className: COLOR_CLASS.pink,
    },
    {
      value: AssetGroup.KHAC,
      label: t("statusBadge.assetGroup.other"),
      className: COLOR_CLASS.neutral,
    },
    // --- Thuộc về tài sản ---
    {
      value: AssetBeLongTo.PHONG,
      label: t("statusBadge.assetBelongTo.room"),
      className: COLOR_CLASS.teal,
    },
    {
      value: AssetBeLongTo.CHUNG,
      label: t("statusBadge.assetBelongTo.common"),
      className: COLOR_CLASS.indigo,
    },
    {
      value: AssetBeLongTo.CA_NHAN,
      label: t("statusBadge.assetBelongTo.personal"),
      className: COLOR_CLASS.purple,
    },
    // --- Loại tài sản ---
    {
      value: AssetType.GIA_DUNG,
      label: t("statusBadge.assetType.houseware"),
      className: COLOR_CLASS.rose,
    },
    {
      value: AssetType.VE_SINH,
      label: t("statusBadge.assetType.cleaning"),
      className: COLOR_CLASS.lime,
    },
    {
      value: AssetType.NOI_THAT,
      label: t("statusBadge.assetType.furniture"),
      className: COLOR_CLASS.orange,
    },
    {
      value: AssetType.DIEN,
      label: t("statusBadge.assetType.electric"),
      className: COLOR_CLASS.pink,
    },
    {
      value: AssetType.AN_NINH,
      label: t("statusBadge.assetType.security"),
      className: COLOR_CLASS.sky,
    },
    {
      value: AssetType.KHAC,
      label: t("statusBadge.assetType.other"),
      className: COLOR_CLASS.neutral,
    },
    // --- Trạng thái tài sản ---
    {
      value: AssetStatus.HOAT_DONG,
      label: t("statusBadge.assetStatus.active"),
      className: COLOR_CLASS.green,
    },
    {
      value: AssetStatus.HUY,
      label: t("statusBadge.assetStatus.cancelled"),
      className: COLOR_CLASS.red,
    },
    {
      value: AssetStatus.HU_HONG,
      label: t("statusBadge.assetStatus.broken"),
      className: COLOR_CLASS.red,
    },
    {
      value: AssetStatus.CAN_BAO_TRI,
      label: t("statusBadge.assetStatus.maintenance"),
      className: COLOR_CLASS.yellow,
    },
    {
      value: AssetStatus.THAT_LAC,
      label: t("statusBadge.assetStatus.lost"),
      className: COLOR_CLASS.orange,
    },
    {
      value: AssetStatus.DA_THANH_LY,
      label: t("statusBadge.assetStatus.liquidated"),
      className: COLOR_CLASS.gray,
    },
    // --- TENANT ---
    {
      value: TenantStatus.DANG_THUE,
      label: "Đang thuê",
      className: COLOR_CLASS.green,
    },
    {
      value: TenantStatus.DA_TRA_PHONG,
      label: "Đã trả phòng",
      className: COLOR_CLASS.gray,
    },
    {
      value: TenantStatus.TIEM_NANG,
      label: "Tiềm năng",
      className: COLOR_CLASS.yellow,
    },
    {
      value: TenantStatus.KHOA,
      label: "Bị khóa",
      className: COLOR_CLASS.red,
    },
    // --- GENDER ---
    {
      value: Gender.MALE,
      label: "Nam",
      className: COLOR_CLASS.blue,
    },
    {
      value: Gender.FEMALE,
      label: "Nữ",
      className: COLOR_CLASS.pink,
    },
    // --- Vehicle Types ---
    {
      value: VehicleType.XE_MAY,
      label: "Xe máy",
      className: COLOR_CLASS.blue,
    },
    {
      value: VehicleType.O_TO,
      label: "Ô tô",
      className: COLOR_CLASS.green,
    },
    {
      value: VehicleType.XE_DAP,
      label: "Xe đạp",
      className: COLOR_CLASS.orange,
    },
    {
      value: VehicleType.KHAC,
      label: "Khác",
      className: COLOR_CLASS.neutral,
    },
    // --- Vehicle Status ---
    {
      value: VehicleStatus.SU_DUNG,
      label: "Đang sử dụng",
      className: COLOR_CLASS.green,
    },
    {
      value: VehicleStatus.KHONG_SU_DUNG,
      label: "Ngừng sử dụng",
      className: COLOR_CLASS.gray,
    },
    {
      value: VehicleStatus.TAM_KHOA,
      label: "Tạm khóa",
      className: COLOR_CLASS.red,
    },
    // --- Contract status ---
    {
      value: ContractStatus.HIEU_LUC,
      label: "Hiệu lực",
      className: COLOR_CLASS.green,
    },
    {
      value: ContractStatus.SAP_HET_HAN,
      label: "Sắp hết hạn",
      className: COLOR_CLASS.yellow,
    },
    {
      value: ContractStatus.CHO_KICH_HOAT,
      label: "Chờ kích hoạt",
      className: COLOR_CLASS.orange,
    },
    {
      value: ContractStatus.KET_THUC_CO_BAO_TRUOC,
      label: "Kết thúc có báo trước",
      className: COLOR_CLASS.blue,
    },
    {
      value: ContractStatus.KET_THUC_DUNG_HAN,
      label: "Kết thúc đúng hạn",
      className: COLOR_CLASS.green,
    },
    {
      value: ContractStatus.TU_Y_HUY_BO,
      label: "Tự ý hủy bỏ",
      className: COLOR_CLASS.red,
    },
    {
      value: ContractStatus.DA_HUY,
      label: "Đã hủy",
      className: COLOR_CLASS.red,
    },
    // --- Loại dịch vụ ---
    {
      value: ServiceType.CO_DINH,
      label: "Cố định",
      className: COLOR_CLASS.green,
    },
    {
      value: ServiceType.TINH_THEO_SO,
      label: "Tính theo số",
      className: COLOR_CLASS.blue,
    },
    // --- Áp dụng theo ---
    {
      value: ServiceAppliedBy.PHONG,
      label: "Phòng",
      className: COLOR_CLASS.orange,
    },
    {
      value: ServiceAppliedBy.TANG,
      label: "Tầng",
      className: COLOR_CLASS.purple,
    },
    {
      value: ServiceAppliedBy.NGUOI,
      label: "Người",
      className: COLOR_CLASS.pink,
    },
    // --- Trạng thái dịch vụ ---
    {
      value: ServiceStatus.HOAT_DONG,
      label: "Hoạt động",
      className: COLOR_CLASS.green,
    },
    {
      value: ServiceStatus.TAM_KHOA,
      label: "Tạm khóa",
      className: COLOR_CLASS.yellow,
    },
    {
      value: ServiceStatus.KHONG_SU_DUNG,
      label: "Ngừng sử dụng",
      className: COLOR_CLASS.gray,
    },
    // --- DEFAULT SERVICE ---
    {
      value: DefaultServiceAppliesTo.PHONG,
      label: "Phòng",
      className: COLOR_CLASS.orange,
    },
    {
      value: DefaultServiceAppliesTo.HOP_DONG,
      label: "Hợp đồng",
      className: COLOR_CLASS.purple,
    },
    {
      value: DefaultServiceStatus.HOAT_DONG,
      label: "Hoạt động",
      className: COLOR_CLASS.green,
    },
    {
      value: DefaultServiceStatus.TAM_DUNG,
      label: "Tạm dừng",
      className: COLOR_CLASS.yellow,
    },
    {
      value: DefaultServiceStatus.HUY_BO,
      label: "Hủy bỏ",
      className: COLOR_CLASS.red,
    },
    {
      value: ServiceRoomStatus.DANG_SU_DUNG,
      label: "Đang sử dụng",
      className: COLOR_CLASS.green,
    },
    {
      value: ServiceRoomStatus.TAM_DUNG,
      label: "Tạm dừng",
      className: COLOR_CLASS.yellow,
    },
    {
      value: ServiceRoomStatus.DA_HUY,
      label: "Đã hủy",
      className: COLOR_CLASS.red,
    },
    // --- Meter Types ---
    {
      value: MeterType.DIEN,
      label: "Công tơ điện",
      className: COLOR_CLASS.yellow,
    },
    {
      value: MeterType.NUOC,
      label: "Công tơ nước",
      className: COLOR_CLASS.blue,
    },
    // --- Invoice Status ---
    {
      value: InvoiceStatus.CHUA_THANH_TOAN,
      label: "Chưa thanh toán",
      className: COLOR_CLASS.red,
    },
    {
      value: InvoiceStatus.KHOI_PHUC,
      label: "Khôi phục",
      className: COLOR_CLASS.yellow,
    },
    {
      value: InvoiceStatus.DA_THANH_TOAN,
      label: "Đã thanh toán",
      className: COLOR_CLASS.green,
    },
    {
      value: InvoiceStatus.QUA_HAN,
      label: "Quá hạn",
      className: COLOR_CLASS.orange,
    },
    {
      value: InvoiceStatus.HUY,
      label: "Đã hủy",
      className: COLOR_CLASS.gray,
    },
    // --- Invoice Type ---
    {
      value: InvoiceType.HANG_THANG,
      label: "Hàng tháng",
      className: COLOR_CLASS.blue,
    },
    {
      value: InvoiceType.CUOI_CUNG,
      label: "Cuối cùng",
      className: COLOR_CLASS.purple,
    },
    // --- Service Category ---
    {
      value: ServiceCategory.DIEN,
      label: "Điện",
      className: COLOR_CLASS.yellow,
    },
    {
      value: ServiceCategory.NUOC,
      label: "Nước",
      className: COLOR_CLASS.blue,
    },
    {
      value: ServiceCategory.GUI_XE,
      label: "Gửi xe",
      className: COLOR_CLASS.gray,
    },
    {
      value: ServiceCategory.INTERNET,
      label: "Internet",
      className: COLOR_CLASS.indigo,
    },
    {
      value: ServiceCategory.VE_SINH,
      label: "Vệ sinh",
      className: COLOR_CLASS.green,
    },
    {
      value: ServiceCategory.THANG_MAY,
      label: "Thang máy",
      className: COLOR_CLASS.purple,
    },
    {
      value: ServiceCategory.BAO_TRI,
      label: "Bảo trì",
      className: COLOR_CLASS.red,
    },
    {
      value: ServiceCategory.AN_NINH,
      label: "An ninh",
      className: COLOR_CLASS.orange,
    },
    {
      value: ServiceCategory.GIAT_SAY,
      label: "Giặt sấy",
      className: COLOR_CLASS.pink,
    },
    {
      value: ServiceCategory.TIEN_PHONG,
      label: "Tiền phòng",
      className: COLOR_CLASS.teal,
    },
    {
      value: ServiceCategory.KHAC,
      label: "Khác",
      className: COLOR_CLASS.neutral,
    },
    {
      value: ServiceCalculation.TINH_THEO_SO,
      label: "Tính theo số",
      className: COLOR_CLASS.blue,
    },
    {
      value: ServiceCalculation.TINH_THEO_NGUOI,
      label: "Tính theo người",
      className: COLOR_CLASS.green,
    },
    {
      value: ServiceCalculation.TINH_THEO_PHONG,
      label: "Tính theo phòng",
      className: COLOR_CLASS.purple,
    },
    {
      value: ServiceCalculation.TINH_THEO_PHUONG_TIEN,
      label: "Tính theo phương tiện",
      className: COLOR_CLASS.indigo,
    },
    // --- Invoice Item Type ---
    {
      value: InvoiceItemType.DIEN,
      label: "Điện",
      className: COLOR_CLASS.yellow,
    },
    {
      value: ServiceCategory.DEN_BU,
      label: "Trống",
      className: COLOR_CLASS.gray,
    },
    {
      value: InvoiceItemType.NUOC,
      label: "Nước",
      className: COLOR_CLASS.blue,
    },
    {
      value: InvoiceItemType.DICH_VU,
      label: "Dịch vụ",
      className: COLOR_CLASS.green,
    },
    {
      value: InvoiceItemType.TIEN_PHONG,
      label: "Tiền phòng",
      className: COLOR_CLASS.teal,
    },
    {
      value: InvoiceItemType.DEN_BU,
      label: "Đền bù",
      className: COLOR_CLASS.red,
    },
    // --- Phương thức thanh toán ---
    {
      value: PaymentMethod.CHON_PHUONG_THUC,
      label: "Chọn phương thức",
      className: COLOR_CLASS.orange,
    },
    {
      value: PaymentMethod.TIEN_MAT,
      label: "Tiền mặt",
      className: COLOR_CLASS.amber,
    },
    {
      value: PaymentMethod.CHUYEN_KHOAN,
      label: "Chuyển khoản",
      className: COLOR_CLASS.blue,
    },
    {
      value: PaymentMethod.VNPAY,
      label: "VNPay",
      className: COLOR_CLASS.purple,
    },
    {
      value: PaymentMethod.ZALOPAY,
      label: "ZaloPay",
      className: COLOR_CLASS.pink,
    },
    {
      value: PaymentMethod.MOMO,
      label: "MoMo",
      className: COLOR_CLASS.red,
    },
    // --- Trạng thái thanh toán ---
    {
      value: PaymentStatus.CHO_THANH_TOAN,
      label: "Chờ thanh toán",
      className: COLOR_CLASS.yellow,
    },
    {
      value: PaymentStatus.CHO_XAC_NHAN,
      label: "Chờ xác nhận",
      className: COLOR_CLASS.blue,
    },
    {
      value: PaymentStatus.DA_THANH_TOAN,
      label: "Đã thanh toán",
      className: COLOR_CLASS.green,
    },
    {
      value: PaymentStatus.TU_CHOI,
      label: "Từ chối",
      className: COLOR_CLASS.red,
    },
    {
      value: PaymentStatus.HUY,
      label: "Hủy",
      className: COLOR_CLASS.gray,
    },
    {
      value: NotificationType.CHUNG,
      label: "Chung",
      className: COLOR_CLASS.blue,
    },
    {
      value: NotificationType.HE_THONG,
      label: "Hệ thống",
      className: COLOR_CLASS.green,
    },
    {
      value: NotificationType.KHAC,
      label: "Khác",
      className: COLOR_CLASS.red,
    },
  ];
};

export const ACTION_BUTTONS_FOR_CONTRACT: IBtnType[] = [
  {
    tooltipContent: "Chỉnh sửa",
    icon: PenTool,
    arrowColor: "var(--color-primary)",
    type: "default",
    hasConfirm: true,
  },
  {
    tooltipContent: "Tải lên Docx",
    icon: Upload,
    arrowColor: "var(--color-amber-500)",
    type: "upload",
    hasConfirm: false,
  },
  {
    tooltipContent: "Tải xuống",
    icon: Download,
    arrowColor: "var(--color-emerald-500)",
    type: "download",
    hasConfirm: false,
  },
];

export const ACTION_BUTTONS: IBtnType[] = [
  {
    tooltipContent: "Thêm mới",
    icon: Plus,
    arrowColor: "var(--color-primary)",
    type: "default",
    hasConfirm: true,
  },
  // {
  //   tooltipContent: "Tải lên Excel",
  //   icon: Upload,
  //   arrowColor: "var(--color-amber-500)",
  //   type: "upload",
  //   hasConfirm: false,
  // },
  {
    tooltipContent: "Tải xuống Excel",
    icon: Download,
    arrowColor: "var(--color-emerald-500)",
    type: "download",
    hasConfirm: false,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

export const ACTION_BUTTONS_HISTORY: IBtnType[] = [
  {
    tooltipContent: "Xem lịch sử",
    icon: History,
    arrowColor: "#5a5e78",
    type: "history",
    hasConfirm: false,
  },
  {
    tooltipContent: "Thêm mới",
    icon: Plus,
    arrowColor: "var(--color-primary)",
    type: "default",
    hasConfirm: true,
  },
  // {
  //   tooltipContent: "Tải lên Excel",
  //   icon: Upload,
  //   arrowColor: "var(--color-amber-500)",
  //   type: "upload",
  //   hasConfirm: false,
  // },
  {
    tooltipContent: "Tải xuống Excel",
    icon: Download,
    arrowColor: "var(--color-emerald-500)",
    type: "download",
    hasConfirm: false,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

export const BUTTON_HISTORY: IBtnType[] = [
  {
    tooltipContent: "Khôi phục",
    icon: Undo,
    arrowColor: "var(--color-violet-500)",
    type: "undo",
    hasConfirm: true,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

export const ACTION_BUTTONS_SERVICE_ROOM: IBtnType[] = [
  {
    tooltipContent: "Thêm 1 dịch vụ cho 1 phòng",
    icon: Plus,
    arrowColor: "var(--color-primary)",
    type: "default",
    hasConfirm: true,
  },
  {
    tooltipContent: "Thêm 1 dịch vụ cho tất cả các phòng trong 1 tòa nhà",
    icon: Building2,
    arrowColor: "var(--color-sky-600)",
    type: "building",
    hasConfirm: true,
  },
  {
    tooltipContent: "Thêm 1 dịch vụ vào các phòng",
    icon: DoorOpen,
    arrowColor: "var(--color-teal-500)",
    type: "floor",
    hasConfirm: true,
  },
  {
    tooltipContent: "Thêm các dịch vụ vào phòng cho 1 phòng",
    icon: Gavel,
    arrowColor: "var(--color-violet-500)",
    type: "undo",
    hasConfirm: true,
  },
  {
    tooltipContent: "Tải xuống Excel",
    icon: Download,
    arrowColor: "var(--color-emerald-500)",
    type: "download",
    hasConfirm: false,
  },
];

export const formatNumberField = {
  price: (val: number) => `${formattedCurrency(val)}`,
  acreage: (val: number) => `${formatNumber(val)} m²`,
  maximumPeople: (val: number) => `${val} người/phòng`,
  asset: (val: number) => `${val} tài sản`,
};

export const GENDER_OPTIONS = (t: TFunction<"translate", undefined>) => {
  return [
    { label: t(`profile.genderOptions.${Gender.MALE}`), value: Gender.MALE },
    { label: t(`profile.genderOptions.${Gender.FEMALE}`), value: Gender.FEMALE },
  ];
};

export const GET_BTNS = (...type: IBtnType["type"][]): IBtnType[] => {
  return BTNS.filter((btn) => type.includes(btn.type));
};

export const BTNS: IBtnType[] = [
  {
    tooltipContent: "Khôi phục",
    icon: Undo,
    arrowColor: "var(--color-violet-500)",
    type: "undo",
    hasConfirm: true,
  },
  {
    tooltipContent: "Chỉnh sửa",
    icon: SquarePen,
    arrowColor: "#44475A",
    type: "update",
    hasConfirm: true,
  },
  {
    tooltipContent: "Chuyển đổi",
    icon: ToggleLeft,
    arrowColor: "#44475A",
    type: "toggle",
    hasConfirm: true,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
  {
    tooltipContent: "Đổi trạng thái",
    icon: ArrowRightLeft,
    arrowColor: "var(--color-sky-500)",
    type: "status",
    hasConfirm: true,
  },
  {
    tooltipContent: "Xem",
    icon: Eye,
    arrowColor: "var(--color-emerald-500)",
    type: "view",
    hasConfirm: false,
  },
];

/* PAYMENT RECEIPT */
export const ACTION_BUTTONS_FOR_PAYMENT_RECEIPT = (type: PaymentMethod, status: PaymentStatus): IBtnType[] => {
  const CASH: IBtnType[] = [
    {
      tooltipContent: "Xác nhận đã thanh toán",
      icon: Banknote,
      arrowColor: "var(--color-amber-500)",
      type: "cash",
      hasConfirm: false,
    },
  ];

  const res: IBtnType[] = [
    {
      tooltipContent: "Xem",
      icon: Eye,
      arrowColor: "var(--color-emerald-500)",
      type: "view",
      hasConfirm: false,
    },
    {
      tooltipContent: "Xóa",
      icon: Trash2,
      arrowColor: "var(--color-red-400)",
      type: "delete",
      hasConfirm: true,
    },
  ];

  return (type === PaymentMethod.TIEN_MAT || type === PaymentMethod.CHUYEN_KHOAN) &&
    status !== PaymentStatus.DA_THANH_TOAN
    ? [...CASH, ...res]
    : res;
};
