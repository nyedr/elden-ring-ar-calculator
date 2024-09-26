import { Weapon } from "@/lib/data/weapon";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import DynamicStyledChart, { ChartData } from "./ui/chart";
import React from "react";
import { Character } from "@/hooks/useCharacter";
import { Attribute } from "@/lib/data/attributes";
import { capitalize } from "@/lib/utils";

interface WeaponChartProps {
  selectedChartWeapon: Weapon;
  removeSelectedChartWeapon: () => void;
  character: Character;
}

export default function WeaponChart({
  selectedChartWeapon,
  removeSelectedChartWeapon,
  character,
}: WeaponChartProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  const data: ChartData = React.useMemo(() => {
    return Object.keys(selectedChartWeapon.attributeScaling[0]).map((key) => {
      return {
        label: capitalize(key),
        data: selectedChartWeapon.attributeScaling.map((point, level) => ({
          primary: level,
          secondary: +(point[key as Attribute] ?? 0) * 100,
        })),
      };
    }) as ChartData;
  }, [selectedChartWeapon.attributeScaling]);

  return (
    <div className="h-[400px] w-full flex flex-col">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-semibold">
          {selectedChartWeapon.name} Scaling Chart
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
        elementType="line"
        setState={setState}
        activeDatumIndex={activeDatumIndex}
        activeSeriesIndex={activeSeriesIndex}
      />
    </div>
  );
}
