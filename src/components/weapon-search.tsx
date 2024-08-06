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
import { Weapon } from "@/lib/data/weapon";
import { Icons } from "./icons";

export interface ComboboxItem {
  value: string;
  label: string;
}

export interface WeaponSearchProps {
  items: ComboboxItem[];
  setSelectedWeapons: (func: (prev: Weapon[]) => Weapon[]) => void;
  findWeapon: (weaponName: string) => Weapon | undefined;
  setSelectedChartWeapon: (selectedChartWeapon: Weapon | null) => void;
  updateWeaponInfo: (weaponName: string) => void;
}

const DROPDOWN_ITEMS_SHOWN_LIMIT = 40;

export function WeaponSearch({
  items,
  findWeapon,
  setSelectedWeapons,
  setSelectedChartWeapon,
  updateWeaponInfo,
}: WeaponSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const addSelectedWeapon = (weaponName: string) => {
    const weapon = findWeapon(weaponName);
    if (weapon) {
      setSelectedWeapons((prev) => [...(prev || []), weapon]);
    } else {
      console.error(`Weapon "${weaponName}" not found.`);
    }
  };

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
              : "Select weapon"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput
              value={searchQuery}
              onValueChange={(search: string) => setSearchQuery(search)}
              placeholder="Search weapon..."
            />
            <CommandEmpty>No weapon found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {filteredItems
                  .slice(0, DROPDOWN_ITEMS_SHOWN_LIMIT)
                  .map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue: string) => {
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
      <Button
        onClick={() => addSelectedWeapon(value)}
        size="icon"
        variant="ghost"
      >
        <Icons.plus className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => {
          const selectedWeapon = findWeapon(value);
          setSelectedChartWeapon(selectedWeapon || null);
        }}
        size="icon"
        variant="ghost"
      >
        <Icons.chart className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => updateWeaponInfo(value)}
        size="icon"
        variant="ghost"
      >
        <Icons.book className="h-4 w-4" />
      </Button>
    </div>
  );
}
