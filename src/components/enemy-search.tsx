"use client";

import * as React from "react";

import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import Combobox, { SelectItem } from "./ui/combobox";

export interface EnemySearchProps {
  items: SelectItem[];
  setSelectedEnemy: (name: string) => void;
  setIsDamageOnEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  isDamageOnEnemy: boolean;
}

const DROPDOWN_ITEMS_SHOWN_LIMIT = 50;

export function EnemySearch({
  items,
  setSelectedEnemy,
  setIsDamageOnEnemy,
  isDamageOnEnemy,
}: EnemySearchProps) {
  return (
    <div className="flex items-center w-full gap-3">
      <Combobox
        hasLabel={false}
        items={items}
        buttonProps={{
          size: "default",
        }}
        onValueChange={(selected) => setSelectedEnemy(selected)}
        maxItemsShown={DROPDOWN_ITEMS_SHOWN_LIMIT}
        label="Enemy"
      />

      <Label className="whitespace-nowrap" htmlFor="isTwoHanding">
        <span className="hidden sm:block">Enemy Damage</span>{" "}
        <span className="block sm:hidden">Enemy Dmg</span>
      </Label>
      <Switch
        checked={isDamageOnEnemy}
        onCheckedChange={() => setIsDamageOnEnemy(!isDamageOnEnemy)}
        id="isTwoHanding"
      />
    </div>
  );
}
