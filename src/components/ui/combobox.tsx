"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
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
import { Label } from "./label";
import { Badge } from "./badge";

export interface SelectItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: SelectItem[];
  onValueChange: (selected: string) => void;
  maxItemsShown?: number;
  label?: string;
  filter?: (value: string, search: string) => number;
  defaultValue?: string;
  hasBadge?: boolean;
  id?: string;
  hasLabel?: boolean;
  buttonProps?: ButtonProps;
}

const DROPDOWN_ITEMS_SHOWN_LIMIT = 40;

export default function Combobox({
  items,
  onValueChange,
  maxItemsShown,
  label,
  filter,
  defaultValue,
  hasBadge = false,
  id,
  hasLabel = true,
  buttonProps,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center w-full gap-3 overflow-hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full space-y-2">
            {hasLabel && (
              <Label
                htmlFor={id}
                className="flex items-center gap-2 text-sm font-medium"
              >
                {label}
                {hasBadge && (
                  <Badge variant="outline" className="font-normal">
                    {items.length}
                  </Badge>
                )}
              </Label>
            )}
            <Button
              {...buttonProps}
              size={buttonProps?.size ?? "sm"}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "justify-between w-full truncate",
                buttonProps?.className
              )}
              id={id}
            >
              {value
                ? items.find((item) => item.value === value)?.label
                : `Select a ${label?.toLowerCase() ?? "item"}`}
              <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </div>
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
            defaultValue={value}
          >
            <CommandInput
              value={searchQuery}
              onValueChange={(search: string) => setSearchQuery(search)}
              placeholder={`Search ${label?.toLowerCase() ?? "item"}...`}
            />
            <CommandEmpty>No {label ?? "item"}s found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {filteredItems
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
