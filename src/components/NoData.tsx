import { Inbox } from "lucide-react";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Inbox className="size-15 stroke-[0.5px] stroke-foreground" />
      <span className="text-sm text-foreground">Không có dữ liệu</span>
    </div>
  );
};

export default NoData;
