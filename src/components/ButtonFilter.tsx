import { RefreshCw, Search } from "lucide-react";
import Tooltip from "./ToolTip";
import { Button } from "./ui/button";

interface ButtonFilter {
  onClear: () => void;
}

const ButtonFilter = ({ onClear }: ButtonFilter) => {
  return (
    <div className="flex gap-2">
      <Tooltip content="Làm mới">
        <Button size={"icon"} variant={"ghost"} type="button" className="bg-secondary cursor-pointer" onClick={onClear}>
          <RefreshCw />
        </Button>
      </Tooltip>
      <Tooltip content="Tìm kiếm">
        <Button size={"icon"} type="submit" className="cursor-pointer text-white">
          <Search />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonFilter;
