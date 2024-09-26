"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Weapon } from "@/lib/data/weapon";
import { Icons } from "./icons";
import Combobox, { SelectItem } from "./ui/combobox";

export interface WeaponSearchProps {
  items: SelectItem[];
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
    <div className="flex items-center w-full gap-3">
      <Combobox
        hasLabel={false}
        buttonProps={{ size: "default" }}
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
        <Icons.plus className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => {
          const selectedWeapon = findWeapon(value);
          setSelectedChartWeapon(selectedWeapon || null);
        }}
        size="icon"
        variant="ghost"
        title="View scaling chart"
      >
        <Icons.chart className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => updateWeaponInfo(value)}
        size="icon"
        variant="ghost"
        title="View additional information"
      >
        <Icons.book className="w-4 h-4" />
      </Button>
    </div>
  );
}
