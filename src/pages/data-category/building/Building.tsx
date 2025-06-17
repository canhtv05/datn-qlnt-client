import { useMemo, useState } from "react";
import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import { PenTool } from "lucide-react";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import BuildingButton from "@/components/data-category/building/BuildingButton";
import BuildingFilter from "@/components/data-category/building/BuildingFilter";
import { useSearchParams } from "react-router-dom";

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

interface FilterValues {
  status: string;
  search: string;
}

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

const generateFakePayments = (count: number, page: number): Payment[] => {
  const statuses: Payment["status"][] = ["pending", "processing", "success", "failed"];
  return Array.from({ length: count }, (_, index) => ({
    id: `pay_${page}_${index}_${Math.random().toString(36).substring(2, 8)}`,
    amount: Math.floor(Math.random() * 1000) + 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    email: `user${(page - 1) * count + index + 1}@${
      ["gmail.com", "yahoo.com", "hotmail.com"][Math.floor(Math.random() * 3)]
    }`,
  }));
};

const columnConfigs: { label: string; accessorKey: keyof Payment; isSort: boolean }[] = [
  { label: "Trạng thái", accessorKey: "status", isSort: true },
  { label: "Email", accessorKey: "email", isSort: true },
  { label: "Số tiền", accessorKey: "amount", isSort: true },
];

const Building = () => {
  const totalRecords = 1000;
  const dataPayments = useMemo(() => generateFakePayments(totalRecords, 15), []);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    status: "",
  });

  const handleClear = () => {
    setFilterValues({
      search: "",
      status: "",
    });
    setSearchParams({});
  };

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
  };

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataBuildings} />
      <BuildingButton />
      <BuildingFilter props={props} />
      <DataTable<Payment>
        data={dataPayments}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={1}
        size={15}
        totalElements={totalRecords}
        totalPages={Math.ceil(totalRecords / Number(searchParams.get("size") ?? 15))}
      />
    </div>
  );
};

export default Building;
