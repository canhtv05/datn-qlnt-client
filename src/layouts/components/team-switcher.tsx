import images from "@/assets/imgs";
import Image from "@/components/Image";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-1">
          <Image src={images.react} className="size-[30px] object-contain" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
