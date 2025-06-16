import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FieldsSelectLabel from "./FieldsSelectLabel";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export type CustomColumnDef<T> = ColumnDef<T> & {
  isSort?: boolean;
  label?: string;
};

type DataTableDemoProps = {
  data: Payment[];
  columns: CustomColumnDef<Payment>[];
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
};

export default function DataTableDemo({
  data,
  columns,
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
}: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
    },
  });

  return (
    <div className="w-full bg-background px-5 rounded-b-md">
      <div className="flex-1 text-sm text-muted-foreground py-2">
        {table.getFilteredSelectedRowModel().rows.length} trên {table.getFilteredRowModel().rows.length} dòng được chọn
      </div>
      <Table className="border">
        <TableHeader className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="odd:bg-muted/50 [&>*]:whitespace-nowrap h-12"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Không có kết quả.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[13px]">Hiển thị tối đa</span>
          <FieldsSelectLabel
            placeholder="Số bản ghi mỗi trang"
            labelSelect="Số bản ghi mỗi trang"
            data={[
              { label: "15", value: 15 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
            ]}
            value={size.toString()}
            onChange={(value) => onSizeChange(Number(value))}
            classNameTrigger="h-8"
          />
          <span className="text-[13px]">trên tổng số {total} kết quả</span>
        </div>
        <div className="h-full">
          <div className="h-full flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <span>
              <strong>{page}</strong>
            </span>
            <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page * size >= total}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
