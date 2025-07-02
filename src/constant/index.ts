import {
  AssetGroup,
  BuildingStatus,
  BuildingType,
  FloorStatus,
  FloorType,
  RoomStatus,
  RoomType,
} from "@/enums";
import { IBtnType } from "@/types";
import {
  Download,
  Banknote,
  Bell,
  BookOpen,
  CalendarRange,
  Car,
  DoorOpen,
  Droplets,
  FilePen,
  FileText,
  FolderPlus,
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

export const sidebarItems: SideBarType[] = [
  {
    label: "Theo dõi nhanh",
    title: "Bảng tin",
    url: "/dashboard",
    icon: Layers,
  },
  {
    label: "Quản lý vận hành",
    title: "Danh mục dữ liệu",
    url: "/data-categories",
    icon: Layers,
    items: [
      {
        title: "Tòa nhà",
        url: "/data-categories/buildings",
        icon: House,
      },
      {
        title: "Phòng",
        url: "/data-categories/rooms",
        icon: DoorOpen,
      },
      {
        title: "Tầng",
        url: "/data-categories/floors",
        icon: Building,
      },
      {
        title: "Loại tài sản",
        url: "/data-categories/asset-types",
        icon: Wrench,
      },
      {
        title: "Tài sản",
        url: "/data-categories/room-assets",
        icon: Scale,
      },
      {
        title: "Phí dịch vụ",
        url: "/data-categories/service-charges",
        icon: Droplets,
      },
    ],
  },
  {
    title: "Khách hàng",
    url: "/customers",
    icon: BookOpen,
    items: [
      {
        title: "Đặt cọc",
        url: "/customers/deposits",
        icon: FilePen,
      },
      {
        title: "Hợp đồng thuê",
        url: "/customers/contracts",
        icon: FileText,
      },
      {
        title: "Khách hàng",
        url: "/customers/",
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
    title: "Tài chính",
    url: "/finance",
    icon: BookOpen,
    items: [
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
      {
        title: "Thu chi",
        url: "/finance/transactions",
        icon: FolderPlus,
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

export const STATUS_BADGE = [
  // --- Trạng thái hoạt động của tòa nhà ---
  {
    value: BuildingStatus.HOAT_DONG,
    label: "Hoạt động",
    className:
      "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: BuildingStatus.TAM_KHOA,
    label: "Tạm khóa",
    className:
      "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: BuildingStatus.HUY_HOAT_DONG,
    label: "Hủy hoạt động",
    className:
      "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },

  // --- Loại tòa nhà ---
  {
    value: BuildingType.NHA_TRO,
    label: "Nhà trọ",
    className:
      "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: BuildingType.CHUNG_CU_MINI,
    label: "Chung cư mini",
    className:
      "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: BuildingType.CAN_HO_DICH_VU,
    label: "Căn hộ dịch vụ",
    className:
      "text-indigo-600 bg-indigo-100 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-700",
  },
  {
    value: BuildingType.KHAC,
    label: "Khác",
    className:
      "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  // --- Trạng thái phòng ---
  {
    value: RoomStatus.TRONG,
    label: "Còn trống",
    className:
      "text-green-600 bg-green-100 border border-green-200 hover:bg-green-200 hover:text-green-700",
  },
  {
    value: RoomStatus.DANG_THUE,
    label: "Đã thuê",
    className:
      "text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:text-red-700",
  },
  {
    value: RoomStatus.DA_DAT_COC,
    label: "Đã đặt cọc",
    className:
      "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },
  {
    value: RoomStatus.DANG_BAO_TRI,
    label: "Bảo trì",
    className:
      "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },
  {
    value: RoomStatus.CHUA_HOAN_THIEN,
    label: "Chưa hoàn thiện",
    className:
      "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: RoomStatus.TAM_KHOA,
    label: "Tạm khóa",
    className:
      "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: RoomStatus.HUY_HOAT_DONG,
    label: "Huỷ hoạt động",
    className:
      "text-black bg-gray-200 border border-gray-300 hover:bg-gray-300 hover:text-black",
  },
  // --- Loại Phòng ---
  {
    value: RoomType.GHEP,
    label: "Phòng ghép",
    className:
      "text-blue-600 bg-blue-100 border border-blue-200 hover:bg-blue-200 hover:text-blue-700",
  },
  {
    value: RoomType.DON,
    label: "Phòng đơn",
    className:
      "text-purple-600 bg-purple-100 border border-purple-200 hover:bg-purple-200 hover:text-purple-700",
  },
  {
    value: RoomType.KHAC,
    label: "Khác",
    className:
      "text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-gray-700",
  },

  // --- Trạng thái tầng ---
  {
    value: FloorStatus.HOAT_DONG,
    label: "Đang sử dụng",
    className:
      "text-emerald-600 bg-emerald-100 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-700",
  },
  {
    value: FloorStatus.KHONG_SU_DUNG,
    label: "Không sử dụng",
    className:
      "text-stone-600 bg-stone-100 border border-stone-200 hover:bg-stone-200 hover:text-stone-700",
  },
  {
    value: FloorStatus.TAM_KHOA,
    label: "Tạm khóa",
    className:
      "text-yellow-600 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-700",
  },

  // --- Loại tầng ---
  {
    value: FloorType.CHO_THUE,
    label: "Cho thuê",
    className:
      "text-sky-600 bg-sky-100 border border-sky-200 hover:bg-sky-200 hover:text-sky-700",
  },
  {
    value: FloorType.KHONG_CHO_THUE,
    label: "Không cho thuê",
    className:
      "text-zinc-600 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-700",
  },
  {
    value: FloorType.DE_O,
    label: "Để ở",
    className:
      "text-cyan-600 bg-cyan-100 border border-cyan-200 hover:bg-cyan-200 hover:text-cyan-700",
  },
  {
    value: FloorType.KHO,
    label: "Kho",
    className:
      "text-amber-600 bg-amber-100 border border-amber-200 hover:bg-amber-200 hover:text-amber-700",
  },
  {
    value: FloorType.KHAC,
    label: "Khác",
    className:
      "text-neutral-600 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 hover:text-neutral-700",
  },

  // --- Nhóm tài sản ---
  {
    value: AssetGroup.GIA_DUNG,
    label: "Gia dụng",
    className:
      "text-rose-600 bg-rose-100 border border-rose-200 hover:bg-rose-200 hover:text-rose-700",
  },
  {
    value: AssetGroup.NOI_THAT,
    label: "Nội thất",
    className:
      "text-lime-600 bg-lime-100 border border-lime-200 hover:bg-lime-200 hover:text-lime-700",
  },
  {
    value: AssetGroup.DIEN,
    label: "Điện",
    className:
      "text-orange-600 bg-orange-100 border border-orange-200 hover:bg-orange-200 hover:text-orange-700",
  },
  {
    value: AssetGroup.CA_NHAN,
    label: "Cá nhân",
    className:
      "text-pink-600 bg-pink-100 border border-pink-200 hover:bg-pink-200 hover:text-pink-700",
  },
  {
    value: AssetGroup.KHAC,
    label: "Khác",
    className:
      "text-slate-600 bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:text-slate-700",
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
