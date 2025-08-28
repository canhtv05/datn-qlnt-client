import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bot, MailPlus, LucideIcon } from "lucide-react";
import ChatComponent from "@/components/ChatComponent";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const items = (
  t: TFunction<"translation", undefined>
): { label: string; icon: LucideIcon; style: "primary" | "orange" }[] => {
  return [
    {
      label: "Chatbot AI",
      icon: Bot,
      style: "primary",
    },
    {
      label: t("common.footer.supportMessage"),
      icon: MailPlus,
      style: "orange",
    },
  ];
};

const FooterLayout = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <footer className="py-3 px-4 flex justify-between border-t items-center">
      <h1 className="text-[12px] text-primary">
        <span className="text-primary">&copy; </span>
        {new Date().getFullYear()} TroHub
      </h1>

      <div className="flex gap-2 items-center">
        {items(t).map((item, index) => {
          const isPrimary = item.style === "primary";

          if (isPrimary) {
            return (
              <Sheet key={index} open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group hover:text-white flex items-center hover:shadow-primary dark:hover:bg-primary hover:bg-primary border-primary dark:border-primary"
                  >
                    <item.icon className="stroke-primary group-hover:stroke-white" />
                    <span className="text-[12px] text-primary group-hover:text-white leading-none">{item.label}</span>
                  </Button>
                </SheetTrigger>
                <VisuallyHidden>
                  <SheetTitle>Chatbot AI</SheetTitle>
                  <SheetDescription>Mô tả chatbot</SheetDescription>
                </VisuallyHidden>
                <ChatComponent />
              </Sheet>
            );
          }

          return (
            <a key={index} href={`https://zalo.me/0981635840`} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="group hover:text-white hover:shadow-[0_8px_25px_-8px_#ff9f43] hover:bg-[#ff9f43] border-[#ff9f43] dark:border-[#ff9f43] dark:hover:bg-[#ff9f43] flex items-center justify-center gap-2"
              >
                <item.icon className="stroke-[#ff9f43] group-hover:stroke-white" />
                <span className="text-[12px] text-[#ff9f43] group-hover:text-white leading-none">{item.label}</span>
              </Button>
            </a>
          );
        })}
      </div>
    </footer>
  );
};

export default FooterLayout;
