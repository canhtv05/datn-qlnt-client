import { BuildingStatus, BuildingType } from "@/enums";
import { IBtnType } from "@/types";
import {
  Download,
  Banknote,
  BedDouble,
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
        title: "Giường",
        url: "/data-categories/beds",
        icon: BedDouble,
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
        url: "/customers",
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
