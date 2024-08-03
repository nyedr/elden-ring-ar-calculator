"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { ColumnFilter, Table } from "@tanstack/react-table";

import { Button } from "../button";
import { Input } from "../input";
import { ViewOptions } from "./view-options";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterBy: {
    accessorKey: string;
    label: string;
    // This parameter dictates how deep the filter should go
    depth?: number;
  };
}

export function Toolbar<TData>({
  table,
  filterBy,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 space-x-2">
        <Input
          placeholder={`Filter by ${filterBy.label}...`}
          value={
            (table
              .getColumn(filterBy?.accessorKey)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            // TODO: Fix weapon filtering
          }}
          className="h-10 w-[180px] lg:w-[270px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      <ViewOptions table={table} />
    </div>
  );
}
