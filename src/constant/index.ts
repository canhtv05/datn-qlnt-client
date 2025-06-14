import {
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
  Scale,
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
