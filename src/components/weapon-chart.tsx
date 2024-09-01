import { Weapon } from "@/lib/data/weapon";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import DynamicStyledChart, { ChartItem } from "./ui/chart";
import React from "react";
import { Character, getAttackAttributes } from "@/hooks/useCharacter";
import { Enemy } from "@/lib/data/enemy-data";
import { getWeaponAttack } from "@/lib/calc/calculator";
import {
  allDamageTypes,
  AttackPowerType,
  getDamageTypeKey,
} from "@/lib/data/attackPowerTypes";

interface WeaponChartProps {
  selectedChartWeapon: Weapon;
  removeSelectedChartWeapon: () => void;
  character: Character;
  enemy: Enemy | null;
}

const getWeaponARBreakdownData = (
  character: Character,
  weapon: Weapon,
  damageType: AttackPowerType,
  enemy: Enemy | null
): ChartItem => ({
  label: `${getDamageTypeKey(damageType)}`,
  data: weapon.attack.map((_, level) => {
    const attackRating = getWeaponAttack({
      weapon,
      attributes: getAttackAttributes(character.attributes),
      upgradeLevel: level,
    });

    if (!attackRating.attackPower[damageType]) {
      return {
        primary: level,
        secondary: 0,
      };
    }

    return {
      primary: level,
      secondary: Math.floor(attackRating.attackPower[damageType].total),
    };
  }),
});

const getWeaponSpellScalingData = (
  character: Character,
  weapon: Weapon
): ChartItem => ({
  label: "Spell Scaling",
  data: weapon.attack.map((_, level) => {
    const attackRating = getWeaponAttack({
      weapon,
      attributes: getAttackAttributes(character.attributes),
      upgradeLevel: level,
    });

    return {
      primary: level,
      secondary: attackRating.spellScaling[AttackPowerType.MAGIC] ?? 0,
    };
  }),
});

export default function WeaponChart({
  selectedChartWeapon,
  removeSelectedChartWeapon,
  character,
  enemy,
}: WeaponChartProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  const data = React.useMemo(() => {
    const breakdownData = allDamageTypes
      .map((damageType) =>
        getWeaponARBreakdownData(
          character,
          selectedChartWeapon,
          damageType as AttackPowerType,
          enemy
        )
      )
      .filter(
        (data) =>
          (data.data[selectedChartWeapon.attack.length - 1].secondary ?? 0) > 0
      );

    if (
      selectedChartWeapon.sorceryTool ||
      selectedChartWeapon.incantationTool
    ) {
      breakdownData.push(
        getWeaponSpellScalingData(character, selectedChartWeapon)
      );
    }

    return breakdownData;
  }, [character, selectedChartWeapon, enemy]);

  const colorsByDamageType = {
    [getDamageTypeKey(AttackPowerType.PHYSICAL)]: "#202C39",
    [getDamageTypeKey(AttackPowerType.MAGIC)]: "#008DD5",
    [getDamageTypeKey(AttackPowerType.FIRE)]: "#F03A47",
    [getDamageTypeKey(AttackPowerType.LIGHTNING)]: "#F8C537",
    [getDamageTypeKey(AttackPowerType.HOLY)]: "#ECE4B7",
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
