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
} from "@/enums";
import { IBtnType } from "@/types";
import {
  Download,
  Banknote,
  Bell,
  CalendarRange,
  Car,
  DoorOpen,
  FileText,
  House,
  Layers,
  LucideIcon,
  PenTool,
  PieChart,
  Plus,
  Scale,
  Trash2,
  Upload,
  UsersRound,
  Building,
  Wrench,
  SquarePen,
  ArrowRightLeft,
  Eye,
  Building2,
  Hammer,
  Sparkles,
  CircleGauge,
  BedDouble,
  CreditCard,
  History,
  Users,
  Flashlight,
  Droplet,
  Landmark,
  Handshake,
  BookOpenCheck,
} from "lucide-react";

export interface SideBarType {
  label?: string;
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export const sidebarItems = (role: "USER" | "ADMIN" | "STAFF" | "MANAGER"): SideBarType[] | [] => {
  const MANAGER = [
    {
      label: "Theo dõi nhanh",
      title: "Bảng tin",
      url: "/dashboard",
      icon: Layers,
    },
    {
      label: "Quản lý vận hành",
      title: "Cơ sở vật chất",
      url: "/facilities",
      icon: Landmark,
      items: [
        {
          title: "Tòa nhà",
          url: "/facilities/buildings",
          icon: House,
        },
        {
          title: "Tầng",
          url: "/facilities/floors",
          icon: Building,
        },
        {
          title: "Phòng",
          url: "/facilities/rooms",
          icon: DoorOpen,
        },
      ],
    },
    {
      label: "Quản lý tài sản",
      title: "Tài sản",
      url: "/asset-management",
      icon: Scale,
      items: [
        {
          title: "Loại tài sản",
          url: "/asset-management/asset-types",
          icon: Wrench,
        },
        {
          title: "Tài sản",
          url: "/asset-management/assets",
          icon: Scale,
        },
      ],
    },
    {
      label: "Quản lý dịch vụ",
      title: "Dịch vụ",
      url: "/service-management",
      icon: Hammer,
      items: [
        {
          title: "Dịch vụ phòng",
          url: "/service-management/room-services",
          icon: Building2,
        },
        {
          title: "Dịch vụ",
          url: "/service-management/services",
          icon: Hammer,
        },
        {
          title: "Dịch vụ mặc định",
          url: "/service-management/default-services",
          icon: Sparkles,
        },
      ],
    },
    {
      label: "Quản lý khách thuê",
      title: "Khách hàng",
      url: "/customers",
      icon: Handshake,
      items: [
        {
          title: "Hợp đồng thuê",
          url: "/customers/contracts",
          icon: FileText,
        },
        {
          title: "Khách hàng",
          url: "/customers/tenants",
          icon: UsersRound,
        },
        {
          title: "Phương tiện",
          url: "/customers/vehicles",
          icon: Car,
        },
      ],
    },
    {
      label: "Quản lý tài chính",
      title: "Tài chính",
      url: "/finance",
      icon: BookOpenCheck,
      items: [
        {
          title: "Công tơ",
          url: "/finance/meters",
          icon: CircleGauge,
        },
        {
          title: "Ghi chỉ số",
          url: "/finance/meter-reading",
          icon: PenTool,
        },
        {
          title: "Hóa đơn",
          url: "/finance/invoice",
          icon: FileText,
        },
      ],
    },
    {
      title: "Gửi thông báo",
      url: "/notifications",
      icon: Bell,
    },
    {
      label: "Báo cáo",
      title: "Báo cáo tài chính",
      url: "/financial-reports",
      icon: PieChart,
      items: [
        {
          title: "Dòng tiền",
          icon: Banknote,
          url: "/financial-reports/cash-flow",
        },
        {
          title: "Danh sách tiền cọc",
          icon: FileText,
          url: "/financial-reports/deposits",
        },
        {
          title: "Lịch thanh toán",
          icon: CalendarRange,
          url: "/financial-reports/payment-schedule",
        },
      ],
    },
  ];

  const USER = [
    {
      label: "Thông tin",
      title: "Xem thông tin phòng",
      url: "/room",
      icon: BedDouble,
    },
    {
      title: "Xem hợp đồng",
      url: "/contracts",
      icon: FileText,
    },
    {
      title: "Xem hóa đơn",
      url: "/invoices",
      icon: CreditCard,
    },
    {
      title: "Thanh toán hóa đơn",
      url: "/payment",
      icon: CreditCard,
    },
    {
      title: "Xem hóa đơn cũ",
      url: "/invoices/history",
      icon: History,
    },
    {
      title: "Xem thành viên trong phòng",
      url: "/room/members",
      icon: Users,
    },
    {
      title: "Xem điện",
      url: "/electric",
      icon: Flashlight,
    },
    {
      title: "Xem nước",
      url: "/water",
      icon: Droplet,
    },
  ];

  if (role === "MANAGER" || role === "ADMIN") return MANAGER;
  else if (role === "USER") return USER;
  else return [];
};

export const STATUS_BADGE = [
  {
    value: "__EMPTY__",
    label: "Trống",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  {
    value: null,
    label: "Trống",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  {
    value: "isRepresentative=true",
    label: "Có",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: "isRepresentative=false",
    label: "Không",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  // --- Trạng thái hoạt động của tòa nhà ---
  {
    value: BuildingStatus.HOAT_DONG,
    label: "Hoạt động",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: BuildingStatus.TAM_KHOA,
    label: "Tạm khóa",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: BuildingStatus.HUY_HOAT_DONG,
    label: "Hủy hoạt động",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },

  // --- Loại tòa nhà ---
  {
    value: BuildingType.NHA_TRO,
    label: "Nhà trọ",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: BuildingType.CHUNG_CU_MINI,
    label: "Chung cư mini",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: BuildingType.CAN_HO_DICH_VU,
    label: "Căn hộ dịch vụ",
    className: "text-indigo-600 bg-indigo-100 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-700",
  },
  {
    value: BuildingType.KHAC,
    label: "Khác",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  // --- Trạng thái phòng ---
  {
    value: RoomStatus.TRONG,
    label: "Còn trống",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: RoomStatus.DANG_THUE,
    label: "Đã thuê",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  {
    value: RoomStatus.DA_DAT_COC,
    label: "Đã đặt cọc",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: RoomStatus.DANG_BAO_TRI,
    label: "Bảo trì",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: RoomStatus.CHUA_HOAN_THIEN,
    label: "Chưa hoàn thiện",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: RoomStatus.TAM_KHOA,
    label: "Tạm khóa",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: RoomStatus.HUY_HOAT_DONG,
    label: "Huỷ hoạt động",
    className: "text-black bg-gray-200 border border-gray-300 hover:bg-gray-300 hover:text-black",
  },
  // --- Loại Phòng ---
  {
    value: RoomType.GHEP,
    label: "Phòng ghép",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: RoomType.DON,
    label: "Phòng đơn",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: RoomType.KHAC,
    label: "Khác",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  // --- Trạng thái tầng ---
  {
    value: FloorStatus.HOAT_DONG,
    label: "Đang sử dụng",
    className: "text-emerald-600 bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-700",
  },
  {
    value: FloorStatus.KHONG_SU_DUNG,
    label: "Không sử dụng",
    className: "text-stone-600 bg-stone-100 border border-stone-200 hover:bg-stone-200 hover:text-stone-700",
  },
  {
    value: FloorStatus.TAM_KHOA,
    label: "Tạm khóa",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },

  // --- Loại tầng ---
  {
    value: FloorType.CHO_THUE,
    label: "Cho thuê",
    className: "text-sky-600 bg-sky-100 border border-sky-200 hover:bg-sky-200 hover:text-sky-700",
  },
  {
    value: FloorType.KHONG_CHO_THUE,
    label: "Không cho thuê",
    className: "text-zinc-600 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-700",
  },
  {
    value: FloorType.DE_O,
    label: "Để ở",
    className: "text-cyan-600 bg-cyan-100 border border-cyan-200 hover:bg-cyan-200 hover:text-cyan-700",
  },
  {
    value: FloorType.KHO,
    label: "Kho",
    className: "text-amber-600 bg-amber-100 border border-amber-200 hover:bg-amber-200 hover:text-amber-700",
  },
  {
    value: FloorType.KHAC,
    label: "Khác",
    className: "text-neutral-600 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-700",
  },

  // --- Nhóm tài sản ---
  {
    value: AssetGroup.GIA_DUNG,
    label: "Gia dụng",
    className: "text-rose-600 bg-rose-100 border border-rose-200 hover:bg-rose-200 hover:text-rose-700",
  },
  {
    value: AssetGroup.NOI_THAT,
    label: "Nội thất",
    className: "text-lime-600 bg-lime-100 border border-lime-200 hover:bg-lime-200 hover:text-lime-700",
  },
  {
    value: AssetGroup.DIEN,
    label: "Điện",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: AssetGroup.CA_NHAN,
    label: "Cá nhân",
    className: "text-pink-600 bg-pink-100 border border-pink-200 hover:bg-pink-200 hover:text-pink-700",
  },
  {
    value: AssetGroup.KHAC,
    label: "Khác",
    className: "text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-700",
  },

  // --- Thuộc về tài sản ---
  {
    value: AssetBeLongTo.PHONG,
    label: "Phòng",
    className: "text-teal-600 bg-teal-100 border border-teal-200 hover:bg-teal-200 hover:text-teal-700",
  },
  {
    value: AssetBeLongTo.CHUNG,
    label: "Dùng chung",
    className: "text-indigo-600 bg-indigo-100 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-700",
  },
  {
    value: AssetBeLongTo.CA_NHAN,
    label: "Cá nhân",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },

  // --- Trạng thái tài sản ---
  {
    value: AssetStatus.SU_DUNG,
    label: "Đang sử dụng",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: AssetStatus.HU_HONG,
    label: "Hư hỏng",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  {
    value: AssetStatus.CAN_BAO_TRI,
    label: "Cần bảo trì",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: AssetStatus.THAT_LAC,
    label: "Thất lạc",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: AssetStatus.DA_THANH_LY,
    label: "Đã thanh lý",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  /* TENANT */
  {
    value: TenantStatus.DANG_THUE,
    label: "Đang thuê",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: TenantStatus.DA_TRA_PHONG,
    label: "Đã trả phòng",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: TenantStatus.TIEM_NANG,
    label: "Tiềm năng",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: TenantStatus.KHOA,
    label: "Bị khóa",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },

  /* GENDER*/
  {
    value: Gender.MALE,
    label: "Nam",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: Gender.FEMALE,
    label: "Nữ",
    className: "text-pink-600 bg-pink-100 border border-pink-200 hover:bg-pink-200 hover:text-pink-700",
  },

  // Vehicle Types
  {
    value: VehicleType.XE_MAY,
    label: "Xe máy",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: VehicleType.O_TO,
    label: "Ô tô",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: VehicleType.XE_DAP,
    label: "Xe đạp",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: VehicleType.KHAC,
    label: "Khác",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  // Vehicle Status
  {
    value: VehicleStatus.SU_DUNG,
    label: "Đang sử dụng",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: VehicleStatus.KHONG_SU_DUNG,
    label: "Ngừng sử dụng",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: VehicleStatus.TAM_KHOA,
    label: "Tạm khóa",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  // Contract status
  {
    value: ContractStatus.HIEU_LUC,
    label: "Hiệu lực",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: ContractStatus.SAP_HET_HAN,
    label: "Sắp hết hạn",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: ContractStatus.HET_HAN,
    label: "Hết hạn",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: ContractStatus.DA_THANH_LY,
    label: "Đã thanh lý",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: ContractStatus.DA_HUY,
    label: "Đã hủy",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },

  // Loại dịch vụ
  {
    value: ServiceType.CO_DINH,
    label: "Cố định",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: ServiceType.TINH_THEO_SO,
    label: "Tính theo số",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },

  // Áp dụng theo
  {
    value: ServiceAppliedBy.PHONG,
    label: "Phòng",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: ServiceAppliedBy.TANG,
    label: "Tầng",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: ServiceAppliedBy.NGUOI,
    label: "Người",
    className: "text-pink-600 bg-pink-100 border border-pink-200 hover:bg-pink-200 hover:text-pink-700",
  },

  // Trạng thái
  {
    value: ServiceStatus.HOAT_DONG,
    label: "Hoạt động",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: ServiceStatus.TAM_KHOA,
    label: "Tạm khóa",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: ServiceStatus.KHONG_SU_DUNG,
    label: "Ngừng sử dụng",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  // DEFAULT SERVICE
  {
    value: DefaultServiceAppliesTo.PHONG,
    label: "Phòng",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: DefaultServiceAppliesTo.HOP_DONG,
    label: "Hợp đồng",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: DefaultServiceStatus.HOAT_DONG,
    label: "Hoạt động",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: DefaultServiceStatus.TAM_DUNG,
    label: "Tạm dừng",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: DefaultServiceStatus.HUY_BO,
    label: "Hủy bỏ",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  {
    value: ServiceRoomStatus.DANG_SU_DUNG,
    label: "Đang sử dụng",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: ServiceRoomStatus.TAM_DUNG,
    label: "Tạm dừng",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: ServiceRoomStatus.DA_HUY,
    label: "Đã hủy",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },

  {
    value: MeterType.DIEN,
    label: "Công tơ điện",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: MeterType.NUOC,
    label: "Công tơ nước",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },

  {
    value: InvoiceStatus.CHUA_THANH_TOAN,
    label: "Chưa thanh toán",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  {
    value: InvoiceStatus.DA_THANH_TOAN,
    label: "Đã thanh toán",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: InvoiceStatus.QUA_HAN,
    label: "Quá hạn",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: InvoiceStatus.HUY,
    label: "Đã hủy",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  {
    value: InvoiceType.HANG_THANG,
    label: "Hàng tháng",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: InvoiceType.CUOI_CUNG,
    label: "Cuối cùng",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: ServiceCategory.DIEN,
    label: "Điện",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: ServiceCategory.NUOC,
    label: "Nước",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: ServiceCategory.GUI_XE,
    label: "Gửi xe",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: ServiceCategory.INTERNET,
    label: "Internet",
    className: "text-indigo-600 bg-indigo-100 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-700",
  },
  {
    value: ServiceCategory.VE_SINH,
    label: "Vệ sinh",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: ServiceCategory.THANG_MAY,
    label: "Thang máy",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: ServiceCategory.BAO_TRI,
    label: "Bảo trì",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  {
    value: ServiceCategory.AN_NINH,
    label: "An ninh",
    className: "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: ServiceCategory.GIAT_SAY,
    label: "Giặt sấy",
    className: "text-pink-600 bg-pink-100 border border-pink-200 hover:bg-pink-200 hover:text-pink-700",
  },
  {
    value: ServiceCategory.TIEN_PHONG,
    label: "Tiền phòng",
    className: "text-teal-600 bg-teal-100 border border-teal-200 hover:bg-teal-200 hover:text-teal-700",
  },
  {
    value: ServiceCategory.KHAC,
    label: "Khác",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: ServiceCalculation.TINH_THEO_SO,
    label: "Tính theo số",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: ServiceCalculation.TINH_THEO_NGUOI,
    label: "Tính theo người",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: ServiceCalculation.TINH_THEO_PHONG,
    label: "Tính theo phòng",
    className: "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: ServiceCalculation.TINH_THEO_PHUONG_TIEN,
    label: "Tính theo phương tiện",
    className: "text-indigo-600 bg-indigo-100 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-700",
  },
  {
    value: InvoiceItemType.DIEN,
    label: "Điện",
    className: "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: ServiceCategory.DEN_BU,
    label: "Trống",
    className: "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: InvoiceItemType.NUOC,
    label: "Nước",
    className: "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: InvoiceItemType.DICH_VU,
    label: "Dịch vụ",
    className: "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: InvoiceItemType.TIEN_PHONG,
    label: "Tiền phòng",
    className: "text-teal-600 bg-teal-100 border border-teal-200 hover:bg-teal-200 hover:text-teal-700",
  },
  {
    value: InvoiceItemType.DEN_BU,
    label: "Đền bù",
    className: "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
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
  {
    tooltipContent: "Tải lên Excel",
    icon: Upload,
    arrowColor: "var(--color-amber-500)",
    type: "upload",
    hasConfirm: false,
  },
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
export const formatNumberField = {
  price: (val: number) => `${val.toLocaleString("vi-VN")} VNĐ`,
  acreage: (val: number) => `${val.toLocaleString("vi-VN")} m²`,
  maximumPeople: (val: number) => `${val} người/phòng`,
};

export const GENDER_OPTIONS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
];

export const GET_BTNS = (...type: IBtnType["type"][]): IBtnType[] => {
  return BTNS.filter((btn) => type.includes(btn.type));
};

export const BTNS: IBtnType[] = [
  {
    tooltipContent: "Chỉnh sửa",
    icon: SquarePen,
    arrowColor: "#44475A",
    type: "update",
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
    tooltipContent: "Xem chi tiết",
    icon: Eye,
    arrowColor: "var(--color-emerald-500)",
    type: "view",
    hasConfirm: false,
  },
];
