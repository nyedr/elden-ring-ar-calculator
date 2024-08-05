import { Weapon } from "@/lib/data/weapon";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import DynamicStyledChart from "./ui/chart";
import React from "react";
import { Character } from "@/hooks/useCharacter";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { DamageType, damageTypes } from "@/lib/data/weapon-data";

interface WeaponChartProps {
  selectedChartWeapon: Weapon;
  removeSelectedChartWeapon: () => void;
  character: Character;
}

const getWeaponARBreakdownData = (
  character: Character,
  weapon: Weapon,
  damageType: DamageType | "Total"
) => {
  return {
    label: `${damageType} AR`,
    data: weapon.levels.map((_, index) => {
      const attackRating = calculateWeaponDamage(character, weapon, index);

      if (damageType === "Total") {
        return {
          primary: index,
          secondary: Math.floor(attackRating.getAr),
        };
      }

      return {
        primary: index,
        secondary: Math.floor(attackRating.damages[damageType].total),
      };
    }),
  };
};

export default function WeaponChart({
  selectedChartWeapon,
  removeSelectedChartWeapon,
  character,
}: WeaponChartProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  const data = [...damageTypes.slice()]
    .map((damageType) =>
      getWeaponARBreakdownData(
        character,
        selectedChartWeapon,
        damageType as DamageType | "Total"
      )
    )
    .filter(
      (data) => data.data[selectedChartWeapon.maxUpgradeLevel].secondary > 0
    );

  return (
    <div className="h-[400px] w-full flex flex-col">
      <Button
        className="mb-3 p-2 ml-auto"
        size="icon"
        variant="ghost"
        onClick={removeSelectedChartWeapon}
      >
        <Icons.x className="w-6 h-6" />
      </Button>
      <DynamicStyledChart
        data={data}
        elementType="area"
        setState={setState}
        activeDatumIndex={activeDatumIndex}
        activeSeriesIndex={activeSeriesIndex}
      />
    </div>
  );
}
