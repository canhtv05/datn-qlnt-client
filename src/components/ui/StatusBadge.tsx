import { STATUS_BADGE } from "@/constant";
import { Badge } from "./badge";

const StatusBadge = ({ status }: { status: string | number }) => {
  return STATUS_BADGE.map((s, index) => {
    if (s.value === status) {
      return (
        <Badge
          key={index}
          className={`px-2 rounded-full text-[10px] font-medium transition-colors duration-200 ${s.className}`}
        >
          {s.label}
        </Badge>
      );
    }
  });
};

export default StatusBadge;
