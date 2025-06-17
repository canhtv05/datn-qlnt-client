import * as React from "react";
import {
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { CustomColumnDef } from "@/types";

type DataTableProps<T> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export default function DataTable<T>({ data, columns, page, size, totalElements, totalPages }: DataTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const pageNum = Number(searchParams.get("page") || page || 1);
  const sizeNum = Number(searchParams.get("size") || size || 15);

  const [pagination, setPagination] = React.useState({
    pageIndex: pageNum - 1,
    pageSize: sizeNum,
  });

  React.useEffect(() => {
    setPagination({
      pageIndex: pageNum - 1,
      pageSize: sizeNum,
    });
  }, [pageNum, sizeNum]);

  const handlePageChange = (newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleSizeChange = (newSize: number) => {
    searchParams.set("size", newSize.toString());
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const getPageNumbers = (): (number | string)[] => {
    const maxPagesToShow = 3;
    const pages: (number | string)[] = [];
    let startPage = Math.max(1, pageNum - 2);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("ellipsis");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
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

      {/* Phân trang */}
      <div className="flex md:flex-row flex-col items-center justify-between space-x-2 py-3">
        <div className="flex items-center gap-2 md:pb-0 pb-5">
          <span className="text-[13px]">Hiển thị</span>
          <FieldsSelectLabel
            placeholder="Số bản ghi mỗi trang"
            labelSelect="Số bản ghi mỗi trang"
            data={[
              { label: "15", value: 15 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
            ]}
            value={pagination.pageSize.toString()}
            onChange={(value) => handleSizeChange(Number(value))}
            classNameTrigger="h-8"
          />
          <span className="text-[13px]">trên tổng số {totalElements} kết quả</span>
        </div>
        <div className="h-full flex items-center gap-2 flex-wrap">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-secondary cursor-pointer"
            onClick={() => handlePageChange(pageNum - 1)}
            disabled={pageNum === 1}
          >
            <ChevronLeft className="text-foreground size-5" />
          </Button>

          {getPageNumbers().map((item, idx) =>
            item === "ellipsis" ? (
              <span key={idx} className="text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={idx}
                className={`w-6 h-6 flex justify-center items-center rounded-full cursor-pointer text-sm ${
                  item === pageNum ? "bg-primary text-white" : "hover:bg-muted text-foreground"
                }`}
                onClick={() => handlePageChange(item as number)}
              >
                {item}
              </button>
            )
          )}

          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-secondary cursor-pointer"
            onClick={() => handlePageChange(pageNum + 1)}
            disabled={pageNum === totalPages}
          >
            <ChevronRight className="text-foreground size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
