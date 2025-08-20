import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

const NoData = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center">
      <Inbox className="size-15 stroke-[0.5px] stroke-foreground" />
      <span className="text-sm text-foreground">{t("common.noData")}</span>
    </div>
  );
};

export default NoData;
