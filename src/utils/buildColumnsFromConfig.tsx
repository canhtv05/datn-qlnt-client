import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomColumnDef } from "@/types";
import { ArrowUpDown } from "lucide-react";

export default function buildColumnsFromConfig<T extends object>(
  configs: { label: string; isSort: boolean; accessorKey: keyof T }[]
): CustomColumnDef<T>[] {
  const select: CustomColumnDef<T> = {
    id: "select",
    accessorKey: "select" as keyof T,
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
  };

  const res: CustomColumnDef<T>[] = configs.map((config) => ({
    accessorKey: config.accessorKey,
    label: config.label,
    isSort: config.isSort,
    header: ({ column }) =>
      config.isSort ? (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {config.label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        config.label
      ),
    cell: ({ row }) => {
      const value = row.getValue(config.accessorKey as string) as string | number;
      if (config.accessorKey === "amount") {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      }
      if (config.accessorKey === "email") {
        return <div className="lowercase">{value}</div>;
      }
      if (config.accessorKey === "status") {
        return <div className="capitalize">{value}</div>;
      }
      return <div>{value}</div>;
    },
  }));

  return [select, ...res];
}
