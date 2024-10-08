"use client";

import React from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import DynamicStyledChart, { ChartData } from "./ui/chart";

interface WeaponArGraphProps {
  data: ChartData;
  clearSelectedWeapons: () => void;
  removeSelectedWeapon?: (name: string) => void;
  updateWeaponInfo: (name: string) => void;
}

export default function SelectedWeaponsChart({
  data,
  clearSelectedWeapons,
  removeSelectedWeapon,
  updateWeaponInfo,
}: WeaponArGraphProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  return (
    <div className="h-[500px] w-full flex flex-col">
      <Button
        className="p-2 ml-auto"
        size="icon"
        variant="ghost"
        onClick={clearSelectedWeapons}
      >
        <Icons.x className="w-6 h-6" />
      </Button>
      <DynamicStyledChart
        lineColors={undefined}
        data={data}
        elementType="line"
        setState={setState}
        viewItem={updateWeaponInfo}
        activeDatumIndex={activeDatumIndex}
        activeSeriesIndex={activeSeriesIndex}
        removeChartItem={removeSelectedWeapon}
      />
    </div>
  );
}
