"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../button";
import { Input } from "../input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CustomSelect {
  defaultValue: string;
  options: string[];
  onChange: (value: string) => void;
  triggerClassName?: string;
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterBy: {
    accessorKey: string;
    label: string;
  };
  customSelect?: CustomSelect;
}

export function Toolbar<TData>({
  table,
  filterBy,
  customSelect,
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
            table
              .getColumn(filterBy?.accessorKey)
              ?.setFilterValue(event.target.value);
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

      {customSelect && (
        <Select
          onValueChange={(val) => customSelect.onChange(val)}
          defaultValue={customSelect.defaultValue}
        >
          <SelectTrigger className={customSelect.triggerClassName}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent defaultValue={customSelect.defaultValue}>
            <SelectGroup>
              {customSelect.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
