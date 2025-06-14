import StatisticCard from "@/components/StatisticCard";
import { PenTool } from "lucide-react";

const dataBuildings = [
  {
    icon: PenTool,
    label: "Tòa nhà",
    value: 20,
  },
  {
    icon: PenTool,
    label: "Hoạt động",
    value: 9,
  },
  {
    icon: PenTool,
    label: "Không hoạt động",
    value: 3,
  },
];

const Building = () => {
  return (
    <div>
      <StatisticCard data={dataBuildings} />
    </div>
  );
};

export default Building;
