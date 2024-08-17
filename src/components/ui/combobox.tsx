"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  onValueChange: (selected: string) => void;
  maxItemsShown?: number;
  label?: string;
  filter?: (value: string, search: string) => number;
}

const DROPDOWN_ITEMS_SHOWN_LIMIT = 40;

export default function Combobox({
  items,
  onValueChange,
  maxItemsShown,
  label,
  filter,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex items-center gap-3 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between truncate"
          >
            {value
              ? items.find((item) => item.value === value)?.label
              : `Select ${label?.toLowerCase() ?? "item"}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command
            filter={
              filter
                ? filter
                : (value, search) => {
                    return +!!value
                      .toLowerCase()
                      .includes(search.toLowerCase());
                  }
            }
          >
            <CommandInput
              value={searchQuery}
              onValueChange={(search: string) => setSearchQuery(search)}
              placeholder={`Search ${label?.toLowerCase() ?? "item"}...`}
            />
            <CommandEmpty>No {label ?? "item"}s found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {items
                  .slice(0, maxItemsShown ?? DROPDOWN_ITEMS_SHOWN_LIMIT)
                  .map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue: string) => {
                        onValueChange(currentValue);
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
