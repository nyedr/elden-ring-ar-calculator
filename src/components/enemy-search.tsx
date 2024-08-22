"use client";

import * as React from "react";

import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import Combobox, { ComboboxItem } from "./ui/combobox";

export interface EnemySearchProps {
  items: ComboboxItem[];
  setSelectedEnemy: (name: string) => void;
  setIsDamageOnEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  isDamageOnEnemy: boolean;
}

export function EnemySearch({
  items,
  setSelectedEnemy,
  setIsDamageOnEnemy,
  isDamageOnEnemy,
}: EnemySearchProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <Combobox
        items={items}
        onValueChange={(selected) => setSelectedEnemy(selected)}
        maxItemsShown={items.length}
        label="Enemy"
      />

      <Label className="whitespace-nowrap" htmlFor="isTwoHanding">
        <span className="sm:block hidden">Enemy Damage</span>{" "}
        <span className="sm:hidden block">Enemy Dmg</span>
      </Label>
      <Switch
        checked={isDamageOnEnemy}
        onCheckedChange={() => setIsDamageOnEnemy(!isDamageOnEnemy)}
        id="isTwoHanding"
      />
    </div>
  );
}
