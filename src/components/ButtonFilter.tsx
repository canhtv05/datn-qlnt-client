import { RefreshCw, Search } from "lucide-react";
import Tooltip from "./ToolTip";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

interface ButtonFilter {
  onClear: () => void;
}

const ButtonFilter = ({ onClear }: ButtonFilter) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2">
      <Tooltip content={t("common.button.reload")}>
        <Button size={"icon"} variant={"ghost"} type="button" className="bg-secondary cursor-pointer" onClick={onClear}>
          <RefreshCw />
        </Button>
      </Tooltip>
      <Tooltip content={t("common.button.search")}>
        <Button size={"icon"} type="submit" className="cursor-pointer text-white">
          <Search />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonFilter;
