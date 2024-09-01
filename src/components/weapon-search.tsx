"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Weapon } from "@/lib/data/weapon";
import { Icons } from "./icons";
import Combobox, { ComboboxItem } from "./ui/combobox";

export interface WeaponSearchProps {
  items: ComboboxItem[];
  setSelectedWeapons: (func: (prev: Weapon[]) => Weapon[]) => void;
  findWeapon: (name: string) => Weapon | undefined;
  setSelectedChartWeapon: (selectedChartWeapon: Weapon | null) => void;
  updateWeaponInfo: (name: string) => void;
}

const DROPDOWN_ITEMS_SHOWN_LIMIT = 50;

export function WeaponSearch({
  items,
  findWeapon,
  setSelectedWeapons,
  setSelectedChartWeapon,
  updateWeaponInfo,
}: WeaponSearchProps) {
  const [value, setValue] = React.useState("");

  const addSelectedWeapon = (name: string) => {
    const weapon = findWeapon(name);
    if (weapon) {
      setSelectedWeapons((prev) => [...(prev || []), weapon]);
    } else {
      console.error(`Weapon "${name}" not found.`);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <Combobox
        items={items}
        onValueChange={(currentValue) =>
          setValue(currentValue === value ? "" : currentValue)
        }
        maxItemsShown={DROPDOWN_ITEMS_SHOWN_LIMIT}
        label="Weapon"
      />
      <Button
        onClick={() => addSelectedWeapon(value)}
        size="icon"
        variant="ghost"
        title="Add to comparison chart"
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
        title="View damage breakdown chart"
      >
        <Icons.chart className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => updateWeaponInfo(value)}
        size="icon"
        variant="ghost"
        title="View additional information"
      >
        <Icons.book className="h-4 w-4" />
      </Button>
    </div>
  );
}
