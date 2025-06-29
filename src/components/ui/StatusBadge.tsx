import { STATUS_BADGE } from "@/constant";
import { Badge } from "./badge";

const StatusBadge = ({ status }: { status: string | number }) => {
  const matched = STATUS_BADGE.find((s) => s.value === status);

  if (!matched) return null;

  return (
    <Badge className={`px-2 rounded-full text-[10px] font-medium transition-colors duration-200 ${matched.className}`}>
      {matched.label}
    </Badge>
  );
};

export default StatusBadge;
