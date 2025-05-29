import {
  CalendarDays,
  ChartColumn,
  ClockFading,
  File,
  List,
  NotebookPen,
  NotepadText,
  Package,
  Pen,
  Users,
} from "lucide-react";
import type { MenuSidebarItemType } from "@/types";

export const menusSidebar: MenuSidebarItemType[] = [
  {
    label: "Trưởng phòng PR",
    type: "pr",
    children: [
      {
        label: "Thống kê",
        to: "/pr/chart",
        type: "chart",
        icon: ChartColumn,
      },
      {
        label: "Quản lý chủ đề",
        to: "/pr/topic-management",
        type: "topic-management",
        icon: NotepadText,
      },
      {
        label: "Danh sách bài viết",
        to: "/pr/list-articles",
        type: "list-articles",
        icon: List,
      },
      {
        label: "Danh sách nhân viên",
        to: "/pr/staffs-pr",
        type: "staffs-pr",
        icon: Users,
      },
    ],
  },
  {
    label: "Quản trị viên",
    type: "admin",
    children: [
      {
        label: "Thống kê",
        to: "/admin/chart",
        type: "chart",
        icon: ChartColumn,
      },
      {
        label: "Phê duyệt bài viết",
        to: "/admin/approve-article",
        type: "approve-article",
        icon: NotebookPen,
      },
      {
        label: "Quản lý đợt đăng ký",
        to: "/admin/registration-period",
        type: "registration-period",
        icon: CalendarDays,
      },
      {
        label: "Kho lưu trữ",
        to: "/admin/archive",
        type: "archive",
        icon: Package,
      },
      {
        label: "Lịch sử phê duyệt",
        to: "/admin/archive-history",
        type: "archive-history",
        icon: ClockFading,
      },
    ],
  },
  {
    label: "Giảng viên bộ môn",
    type: "user",
    children: [
      {
        label: "Đăng ký viết bài",
        to: "/user/register-to-write",
        type: "register-to-write",
        icon: CalendarDays,
      },
      {
        label: "Tạo bài viết",
        to: "/user/create-article",
        type: "create-article",
        icon: Pen,
      },
      {
        label: "Danh sách bài viết",
        to: "/user/list-articles",
        type: "list-articles",
        icon: List,
      },
      {
        label: "Bài viết của tôi",
        to: "/user/my-articles",
        type: "my-articles",
        icon: File,
      },
      {
        label: "Lịch sử đã xem",
        to: "/user/viewed-history",
        type: "viewed-history",
        icon: ClockFading,
      },
    ],
  },
  {
    label: "Nhân viên PR",
    type: "staff",
    children: [
      {
        label: "Danh sách bài viết",
        to: "/staff/list-articles",
        type: "list-articles",
        icon: List,
      },
    ],
  },
];
