import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { CustomColumnDef } from "@/types";

type DataTableProps<T> = {
  data: T[];
  columns: CustomColumnDef<T>[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  loading?: boolean;
};

export function useDataTable<T extends { id: string }>({
  data,
  columns,
  page,
  size,
  totalElements,
  totalPages,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  console.log(rowSelection);

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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (pageNum <= 2) {
      pages.push(1, 2, 3, "ellipsis", totalPages);
    } else if (pageNum >= totalPages - 1) {
      pages.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
    } else {
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
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return {
    table,
    rowSelection,
    searchQuery,
    setSearchQuery,
    pageNum,
    totalElements,
    totalPages,
    pagination,
    getPageNumbers,
    handlePageChange,
    handleSizeChange,
  };
}
