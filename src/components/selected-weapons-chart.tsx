"use client";

import React from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import DynamicStyledChart, { ChartData } from "./ui/chart";

interface WeaponArGraphProps {
  data: ChartData;
  clearSelectedWeapons: () => void;
}

export default function SelectedWeaponsChart({
  data,
  clearSelectedWeapons,
}: WeaponArGraphProps) {
  const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
    activeSeriesIndex: -1,
    activeDatumIndex: -1,
  });

  return (
    <div className="h-[400px] w-full flex flex-col">
      <Button
        className="mb-3 p-2 ml-auto"
        size="icon"
        variant="ghost"
        onClick={clearSelectedWeapons}
      >
        <Icons.x className="w-6 h-6" />
      </Button>
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
