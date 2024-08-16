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
import { Icons } from "./icons";
import { Enemy } from "@/lib/data/enemy-data";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ComboboxItem } from "./ui/combobox";

export interface EnemySearchProps {
  items: ComboboxItem[];
  findEnemy: (enemyName: string) => Enemy | undefined;
  setSelectedEnemy: React.Dispatch<React.SetStateAction<Enemy | null>>;
  setIsDamageOnEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  isDamageOnEnemy: boolean;
}

const DROPDOWN_ITEMS_SHOWN_LIMIT = 40;

export function EnemySearch({
  items,
  findEnemy,
  setSelectedEnemy,
  setIsDamageOnEnemy,
  isDamageOnEnemy,
}: EnemySearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const updateSelectedEnemy = (enemyName: string) => {
    if (!enemyName) {
      setSelectedEnemy(null);
      return;
    }
    const enemy = findEnemy(enemyName);
    if (enemy) {
      setSelectedEnemy(enemy);
    } else {
      console.error(`Enemy "${enemyName}" not found.`);
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
              : "Select Enemy"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
          <Command>
            <CommandInput
              value={searchQuery}
              onValueChange={(search: string) => setSearchQuery(search)}
              placeholder="Search enemy..."
            />
            <CommandEmpty>No enemy found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {filteredItems
                  .slice(0, DROPDOWN_ITEMS_SHOWN_LIMIT)
                  .map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue: string) => {
                        updateSelectedEnemy(currentValue);
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

      <Label className="whitespace-nowrap" htmlFor="isTwoHanding">
        Two Handing
      </Label>
      <Switch
        checked={isDamageOnEnemy}
        onCheckedChange={() => setIsDamageOnEnemy(!isDamageOnEnemy)}
        id="isTwoHanding"
      />

      {/* <Button
        onClick={() => updateWeaponInfo(value)}
        size="icon"
        variant="ghost"
      >
        <Icons.book className="h-4 w-4" />
      </Button> */}
    </div>
  );
}
