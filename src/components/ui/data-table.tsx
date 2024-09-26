"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  GroupingState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  CustomSelect,
  DataTableToolbarProps,
  Toolbar,
} from "./data-table/toolbar";
import { Pagination } from "./data-table/pagination";
import { cn } from "@/lib/utils";
import { WeaponAttackResult } from "@/lib/calc/calculator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  filterBy?: DataTableToolbarProps<TData>["filterBy"];
  isSelectable?: boolean;
  selectedItems?: TData[];
  customSelect?: CustomSelect;
  defaultSortBy?: {
    id: string;
    desc: boolean;
  };
}

const DEFAULT_TABLE_PAGE_SIZE = 30;

export function DataTable<TData, TValue>({
  columns,
  data = [],
  isLoading,
  filterBy,
  isSelectable = false,
  selectedItems,
  customSelect,
  defaultSortBy,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>(
    defaultSortBy ? [defaultSortBy] : []
  );
  const [grouping, setGrouping] = React.useState<GroupingState>([]);

  const handleColumnVisibilityChange = (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState)
  ) => {
    setColumnVisibility((old) => {
      const newColumnVisibility =
        updater instanceof Function ? updater(old) : updater;
      // You can add any additional logic here if needed
      return newColumnVisibility;
    });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      grouping,
    },
    enableRowSelection: isSelectable,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onGroupingChange: setGrouping,
    enableGrouping: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    debugTable: true,
  });

  React.useEffect(() => {
    // Set the default page size
    table.setPageSize(DEFAULT_TABLE_PAGE_SIZE);
  }, [table, selectedItems, data]);

  return (
    <div className="w-full space-y-4 overflow-y-visible">
      {filterBy && (
        <Toolbar
          customSelect={customSelect}
          filterBy={filterBy}
          table={table}
        />
      )}
      <div className="border rounded-md overflow-y-clip">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "border border-secondary text-center",
                        header.column.columnDef.meta?.headerClassName ?? ""
                      )}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn(
                        "py-2",
                        cell.column.columnDef.meta?.cellClassName,
                        cell.getIsGrouped() &&
                          cell.column.getGroupedIndex() === 0
                          ? "border-t border-secondary"
                          : ""
                      )}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={`h-24 text-center ${
                    isLoading ? "animate-pulse bg-muted" : null
                  }`}
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination selectedItemsCounts={selectedItems?.length} table={table} />
    </div>
  );
}
