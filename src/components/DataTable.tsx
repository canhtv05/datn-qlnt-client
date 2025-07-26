import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FieldsSelectLabel from "./FieldsSelectLabel";
import { ChevronDown, ChevronLeft, ChevronRight, Columns3, RefreshCcw, SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { CustomColumnDef } from "@/types";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import NoData from "./NoData";

type DataTableProps<T> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  loading?: boolean;
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  disablePagination?: boolean;
};

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  page,
  size,
  totalElements,
  totalPages,
  loading,
  rowSelection,
  disablePagination,
  setRowSelection,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

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
    if (page !== 1) searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      // Hiện tất cả nếu tổng số trang nhỏ hơn hoặc bằng 3
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (pageNum <= 2) {
      // Trang đầu hoặc trang thứ 2
      pages.push(1, 2, 3, "ellipsis", totalPages);
    } else if (pageNum >= totalPages - 1) {
      // Trang cuối hoặc áp chót
      pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Ở giữa
      pages.push(1, "ellipsis", pageNum - 1, pageNum, pageNum + 1, "ellipsis", totalPages);
    }

    return pages;
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    getRowId: (row) => {
      return row.id;
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="bg-background px-5 rounded-b-md">
      <div className="flex-1 text-sm text-muted-foreground py-2 flex justify-between items-center">
        {table.getFilteredSelectedRowModel().rows.length} trên {table.getFilteredRowModel().rows.length} dòng được chọn
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Columns3 /> Cột <ChevronDown className="ml-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                placeholder="Tìm kiếm"
                onKeyDown={(e) => e.stopPropagation()}
              />
              <SearchIcon className="absolute inset-y-0 my-auto left-2 h-4 w-4" />
            </div>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const isCustomColumnDef = (def: any): def is CustomColumnDef<T> => {
                  return "label" in def && typeof def.label === "string";
                };
                const columnLabel = isCustomColumnDef(column.columnDef) ? column.columnDef.label : column.id;

                if (searchQuery && !columnLabel!.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return null;
                }

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer hover:!bg-primary hover:!text-white"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {columnLabel}
                  </DropdownMenuCheckboxItem>
                );
              })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:[&_.icon]:stroke-white"
              onClick={() => {
                table.resetColumnVisibility();
                setSearchQuery("");
              }}
            >
              <RefreshCcw className="icon" /> Làm mới
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table className="border border-input">
        <TableHeader className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:border-input after:border after:absolute after:bottom-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="[&>th]:border-r [&>th]:border-input last:border-r-0 [&>th:first-child]:border-r-0"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 15 }).map((_, rowIndex) => (
              <TableRow
                key={`skeleton-row-${rowIndex}`}
                className="[&>td]:border-r last:border-r-0 h-12 [&>td]:border-input [&>td:first-child]:border-r-0"
              >
                {columns.map((_, colIndex) => (
                  <TableCell key={`skeleton-cell-${colIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="odd:bg-muted/50 [&>*]:whitespace-nowrap h-12 [&>td]:border-input [&>td]:border-r last:border-r-0 [&>td:first-child]:border-r-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <NoData />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!disablePagination && (
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
              name="size"
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
              disabled={pageNum <= 1 || totalPages === 0 || data.length === 0}
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
              disabled={pageNum >= totalPages || totalPages === 0 || data.length === 0}
            >
              <ChevronRight className="text-foreground size-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
