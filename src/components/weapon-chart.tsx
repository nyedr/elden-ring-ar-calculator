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
    label: `${damageType}`,
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

// TODO: Weapons with spell scaling should be compared by their spell scaling

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

  const colorsByDamageType = {
    Physical: "#202C39",
    Magic: "#008DD5",
    Fire: "#F03A47",
    Lightning: "#F8C537",
    Holy: "#ECE4B7",
  };

  const lineColorsByDamageType = data.map(
    (data) => colorsByDamageType[data.label as DamageType]
  );

  return (
    <div className="h-[400px] w-full flex flex-col">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-semibold">
          {selectedChartWeapon.weaponName} AR Breakdown
        </h3>
        <Button
          className="p-2 ml-auto"
          size="icon"
          variant="ghost"
          onClick={removeSelectedChartWeapon}
        >
          <Icons.x className="w-6 h-6" />
        </Button>
      </div>
      <DynamicStyledChart
        data={data}
        elementType="area"
        setState={setState}
        activeDatumIndex={activeDatumIndex}
        activeSeriesIndex={activeSeriesIndex}
        lineColors={lineColorsByDamageType}
      />
    </div>
  );
}
