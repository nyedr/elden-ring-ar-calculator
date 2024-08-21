import { Weapon } from "@/lib/data/weapon";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import DynamicStyledChart, { ChartItem } from "./ui/chart";
import React from "react";
import { Character } from "@/hooks/useCharacter";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { DamageType, allSimplifiedDamageTypes } from "@/lib/data/weapon-data";

interface WeaponChartProps {
  selectedChartWeapon: Weapon;
  removeSelectedChartWeapon: () => void;
  character: Character;
}

const getWeaponARBreakdownData = (
  character: Character,
  weapon: Weapon,
  damageType: DamageType
): ChartItem => ({
  label: `${damageType}`,
  data: weapon.levels.map((_, level) => {
    const attackRating = calculateWeaponDamage(character, weapon, level);
    return {
      primary: level,
      secondary: Math.floor(attackRating.damages[damageType].total),
    };
  }),
});

const getWeaponSpellScalingData = (
  character: Character,
  weapon: Weapon
): ChartItem => ({
  label: "Spell Scaling",
  data: weapon.levels.map((_, level) => {
    const attackRating = calculateWeaponDamage(character, weapon, level);
    return {
      primary: level,
      secondary: attackRating.spellScaling,
    };
  }),
});

export default function WeaponChart({
  selectedChartWeapon,
  removeSelectedChartWeapon,
  character,
}: WeaponChartProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  const data = React.useMemo(() => {
    const breakdownData = allSimplifiedDamageTypes
      .map((damageType) =>
        getWeaponARBreakdownData(
          character,
          selectedChartWeapon,
          damageType as DamageType
        )
      )
      .filter(
        (data) =>
          (data.data[selectedChartWeapon.maxUpgradeLevel].secondary ?? 0) > 0
      );

    if (selectedChartWeapon.canCastSpells) {
      breakdownData.push(
        getWeaponSpellScalingData(character, selectedChartWeapon)
      );
    }

    return breakdownData;
  }, [character, selectedChartWeapon]);

  const colorsByDamageType = {
    [DamageType.Physical]: "#202C39",
    [DamageType.Magic]: "#008DD5",
    [DamageType.Fire]: "#F03A47",
    [DamageType.Lightning]: "#F8C537",
    [DamageType.Holy]: "#ECE4B7",
    "Spell Scaling": "#6C5B7B",
  };

  const lineColorsByDamageType = React.useMemo(
    () =>
      data.map(
        (data) =>
          colorsByDamageType[data!.label as keyof typeof colorsByDamageType]
      ),
    [data]
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
