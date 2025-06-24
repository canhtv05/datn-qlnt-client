import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import { ColumnConfig, CustomColumnDef } from "@/types";
import { Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export default function buildColumnsFromConfig<T extends object>(configs: ColumnConfig[]): CustomColumnDef<T>[] {
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

  const renderCellContent = (config: ColumnConfig, value: string | number, row: Row<T>) => {
    const isCenter = config.isCenter;
    const hasHighlight = config.hasHighlight;

    const wrapperClass = cn(
      isCenter && "flex w-full items-center justify-center",
      hasHighlight && "!text-primary font-bold"
    );

    if (config.render) {
      return <div className={wrapperClass}>{config.render(row.original)}</div>;
    }

    if (config.accessorKey === "amount") {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);

      return <div className={cn(wrapperClass, "text-right font-medium")}>{formatted}</div>;
    }

    if (config.accessorKey === "email") {
      return <div className={cn(wrapperClass, "lowercase")}>{value}</div>;
    }

    if (config.hasBadge) {
      return (
        <div className={wrapperClass}>
          <StatusBadge status={value} />
        </div>
      );
    }

    return <div className={wrapperClass}>{value}</div>;
  };

  const res: CustomColumnDef<T>[] = configs.map((config) => ({
    accessorKey: config.accessorKey,
    label: config.label,
    isSort: config.isSort,
    header: ({ column }) => {
      const isCenter = config.isCenter;
      return config.isSort ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={cn(isCenter && "flex w-full items-center justify-center")}
        >
          {config.label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <span className={cn(isCenter && "flex w-full items-center justify-center")}>{config.label}</span>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue(config.accessorKey as string) as string | number;
      return renderCellContent(config, value, row);
    },
  }));

  return [select, ...res];
}
