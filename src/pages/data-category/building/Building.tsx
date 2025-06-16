import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BuildingComp from "@/components/data-category/building/BuildingComp";
import StatisticCard from "@/components/StatisticCard";
import DataTableDemo, { Payment, CustomColumnDef } from "@/components/table-09";
import { PenTool, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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

const columns: CustomColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const colDef = column.columnDef as CustomColumnDef<Payment>;
      return colDef.isSort ? (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {colDef.label ?? "Status"}
          <ArrowUpDown />
        </Button>
      ) : (
        colDef.label ?? "Status"
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
    isSort: true,
    label: "Trạng thái",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const colDef = column.columnDef as CustomColumnDef<Payment>;
      return colDef.isSort ? (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          {colDef.label ?? "Email"}
          <ArrowUpDown />
        </Button>
      ) : (
        colDef.label ?? "Email"
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    isSort: true,
    label: "Email",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      const colDef = column.columnDef as CustomColumnDef<Payment>;
      return colDef.isSort ? (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {colDef.label ?? "Amount"}
          <ArrowUpDown />
        </Button>
      ) : (
        <div className="text-right">{colDef.label ?? "Amount"}</div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
    isSort: false,
    label: "Số tiền",
  },
];

const Building = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const size = Number(searchParams.get("size") || 15);
  const totalRecords = 100;

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleSizeChange = (newSize: number) => {
    searchParams.set("size", newSize.toString());
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const dataPayments = useMemo(() => generateFakePayments(size, page), [page, size]);

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataBuildings} />
      <BuildingComp />
      <DataTableDemo
        data={dataPayments}
        columns={columns}
        page={page}
        size={size}
        total={totalRecords}
        onPageChange={handlePageChange}
        onSizeChange={handleSizeChange}
      />
    </div>
  );
};

export default Building;
