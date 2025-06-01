import RenderIf from "@/components/RenderIf";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { BookOpenText, LucideIcon, MailPlus } from "lucide-react";

const items: { label: string; icon: LucideIcon; style: "primary" | "orange" }[] = [
  {
    label: "Hướng dẫn sử dụng",
    icon: BookOpenText,
    style: "primary",
  },
  {
    label: "Nhắn tin hỗ trợ",
    icon: MailPlus,
    style: "orange",
  },
];

const FooterLayout = () => {
  const { isMobile } = useSidebar();

  return (
    <RenderIf value={!isMobile}>
      <footer className="py-3 px-4 flex justify-between items-center">
        <h1 className="text-[12px] text-primary">
          <span className="text-primary">&copy; </span>
          2025 TroHub
        </h1>
        <div className="flex gap-2 items-center">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`group hover:text-white ${
                item.style === "primary"
                  ? "hover:shadow-primary dark:border-primary dark:hover:bg-primary"
                  : "hover:shadow-[0_8px_25px_-8px_#ff9f43] hover:bg-[#ff9f43] border-[#ff9f43] dark:border-[#ff9f43] dark:hover:bg-[#ff9f43]"
              } flex items-center gap-2`}
            >
              <item.icon
                className={`group-hover:stroke-white ${
                  item.style === "primary" ? "stroke-primary" : "stroke-[#ff9f43]"
                }`}
              />
              <span
                className={`text-[12px] group-hover:text-white ${
                  item.style === "primary" ? "text-primary" : "text-[#ff9f43]"
                }`}
              >
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </footer>
    </RenderIf>
  );
};

export default FooterLayout;
