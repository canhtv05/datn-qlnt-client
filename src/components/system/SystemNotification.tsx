import { Button } from "../ui/button";
import { BellIcon, EllipsisVertical, Eye, Loader2, Mail, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import useSystemNotification from "./useSystemNotification";
import NoData from "../NoData";
import RenderIf from "../RenderIf";
import { formatDate } from "@/lib/utils";

const SystemNotification = () => {
  const {
    query: { data, isLoading, isFetchingNextPage },
    data: count,
    handleReadAllNotification,
    handleReadNotification,
    handleRemoveReadNotification,
    handleScroll,
  } = useSystemNotification();

  // const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string | number; type: "remove" | "read" }>({
  //   onConfirm: async ({ id, type }) => {
  //     console.log(id, type);
  //     return false;
  //   },
  // });

  // const handleClick = (id: string | number, type: "remove" | "read") => {
  //   openDialog({ id, type }, { type: "warn", desc: type === "remove" ? "remove" : "read" });
  // };

  const notifications = data?.pages.flatMap((page) => page.data.data ?? []) ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <div className="flex items-center gap-2 mr-4">
            <div className="relative">
              <Button size="icon" className="shadow-none cursor-pointer">
                <BellIcon className="size-5 stroke-white" />
              </Button>
              <RenderIf value={!!count && count?.data.totalUnreadNotifications !== 0}>
                <span className="absolute top-2 right-0 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-white">
                  {count?.data.totalUnreadNotifications || 0}
                </span>
              </RenderIf>
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) md:min-w-94 min-w-90 md:ml-0 ml-2 rounded-lg px-2"
        side={"top"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal cursor-default">
          <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-left text-sm">
            <strong>Thông báo</strong>
            <div className="flex gap-2 items-center justify-between">
              <Badge variant="default" className="text-white">
                {count?.data.totalUnreadNotifications || 0} Mới
              </Badge>
              <Mail className="stroke-[1.5px] size-5" />
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto overflow-hidden" onScroll={handleScroll}>
          {isLoading && <p className="px-2 py-1 text-sm">Đang tải...</p>}
          {notifications.length === 0 && !isLoading && <NoData />}
          {notifications.map((notification) => (
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                if (!notification.isRead) handleReadNotification(notification.systemNotificationId);
              }}
              key={notification.systemNotificationId}
              className="hover:!bg-secondary focus:!bg-secondary focus:!shadow-none data-[highlighted]:!bg-secondary data-[highlighted]:!shadow-none data-[highlighted]:!text-black dark:data-[highlighted]:!text-white"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex-1 min-w-0 flex flex-col [&_*]:text-foreground space-y-0.5 max-w-[65%]">
                  <span className="text-sm dark:!text-white !text-black">{notification.title}</span>
                  <p className="text-sm max-w-[100%] truncate text-[12px]">{notification.content}</p>
                  <span className="text-[12px]">{formatDate(new Date(notification.createdAt))}</span>
                </div>
                <div className="flex items-center [&_*]:text-foreground flex-shrink-0 gap-1 ml-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${notification.isRead ? "bg-emerald-500" : "bg-red-500"} mr-1`}
                  />
                  <span className="text-xs">{notification.isRead ? "Đã đọc" : "Chưa đọc"}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="ml-3 cursor-pointer">
                        <EllipsisVertical />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-(--radix-dropdown-menu-trigger-width) px-2"
                      side={"bottom"}
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuItem className="hover:!bg-secondary h-7 focus:!bg-secondary focus:!shadow-none data-[highlighted]:!bg-secondary data-[highlighted]:!shadow-none data-[highlighted]:!text-black dark:data-[highlighted]:!text-white">
                        <Button
                          className="h-7 flex !p-0 justify-start w-full bg-transparent shadow-none hover:!bg-transparent"
                          // onClick={() => handleClick(idx, "read")}
                          onClick={() => {
                            if (!notification.isRead) handleReadNotification(notification.systemNotificationId);
                          }}
                        >
                          <Eye />
                          <span className="text-[14px] dark:!text-white !text-foreground">Đã đọc</span>
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="hover:!bg-secondary h-7 focus:!bg-secondary focus:!shadow-none data-[highlighted]:!bg-secondary data-[highlighted]:!shadow-none data-[highlighted]:!text-black dark:data-[highlighted]:!text-white">
                        <Button
                          className="h-7 flex !p-0 justify-start w-full bg-transparent shadow-none hover:!bg-transparent"
                          // onClick={() => handleClick(idx, "remove")}
                          onClick={() => handleRemoveReadNotification(notification.systemNotificationId)}
                        >
                          <Trash2 />
                          <span className="text-[14px] dark:!text-white !text-foreground">Xóa</span>
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="animate-spin size-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:!bg-transparent hover:!shadow-none">
          <Button
            className="h-7 w-full"
            onClick={() => {
              if (count?.data.totalUnreadNotifications !== 0) handleReadAllNotification();
            }}
          >
            <span className="text-[14px] text-white">Đánh dấu đọc hết thông báo</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      {/* <ConfirmDialog /> */}
    </DropdownMenu>
  );
};

export default SystemNotification;
