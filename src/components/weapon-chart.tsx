import { Weapon } from "@/lib/data/weapon";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import DynamicStyledChart from "./ui/chart";
import React from "react";
import { Character } from "@/hooks/useCharacter";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { DamageType, allDamageTypes } from "@/lib/data/weapon-data";

interface WeaponChartProps {
  selectedChartWeapon: Weapon;
  removeSelectedChartWeapon: () => void;
  character: Character;
  isCharacterTwoHanding: boolean;
}

const getWeaponARBreakdownData = (
  character: Character,
  weapon: Weapon,
  damageType: DamageType | "Total",
  isCharacterTwoHanding: boolean = false
) => {
  return {
    label: `${damageType}`,
    data: weapon.levels.map((_, index) => {
      const attackRating = calculateWeaponDamage(
        character,
        weapon,
        index,
        isCharacterTwoHanding
      );

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
  isCharacterTwoHanding,
}: WeaponChartProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  const data = [...allDamageTypes.slice()]
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
    [DamageType.Physical]: "#202C39",
    [DamageType.Magic]: "#008DD5",
    [DamageType.Fire]: "#F03A47",
    [DamageType.Lightning]: "#F8C537",
    [DamageType.Holy]: "#ECE4B7",
  };

  const lineColorsByDamageType = data.map(
    (data) => colorsByDamageType[data.label as keyof typeof colorsByDamageType]
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
