"use client";

import EnemiesTable from "@/components/enemies-table";
import EnemyInfo from "@/components/enemy-info";
import Header from "@/components/header";

import { Enemy, EnemyType } from "@/lib/data/enemy-data";
import { useState } from "react";
import EnemiesTableControl from "@/components/enemies-table-control";
import useEnemies from "@/hooks/useEnemies";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface EmemyFilterData {
  location: string;
  type: EnemyType | "None";
  drop: string;
}

export default function Enemies() {
  const [isEnemyInfoOpen, setIsEnemyInfoOpen] = useState(false);
  const [enemiesFilterData, setEnemiesFilterData] = useState<EmemyFilterData>({
    location: "",
    type: "None",
    drop: "",
  });
  const {
    enemiesData,
    selectedEnemy,
    setSelectedEnemy,
    setNewGame,
    filterEnemies,
    resetEnemiesData,
  } = useEnemies();

  const setEnemyInfo = (enemy: Enemy) => {
    setSelectedEnemy(enemy.name);
    setIsEnemyInfoOpen(true);
  };

  const clearFilters = () => {
    setEnemiesFilterData({ location: "", type: "None", drop: "" });
    resetEnemiesData();
  };

  return (
    <main className="flex flex-col gap-4 items-center max-w-[1420px] px-5 lg:px-0 mx-auto w-full py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <EnemiesTableControl
        enemiesFilterData={enemiesFilterData}
        setEnemiesFilterData={setEnemiesFilterData}
        filterEnemies={filterEnemies}
        clearFilters={clearFilters}
      />
      {selectedEnemy && (
        <Dialog open={isEnemyInfoOpen}>
          <DialogContent
            onXClick={() => setIsEnemyInfoOpen(false)}
            className="flex flex-col max-w-[850px] sm:max-h-[90%] max-[800px]:px-[calc(10vw/2)] h-full sm:h-auto sm:overflow-y-auto overflow-y-scroll"
          >
            <EnemyInfo enemy={selectedEnemy} />
          </DialogContent>
        </Dialog>
      )}

      <EnemiesTable
        setNewGame={setNewGame}
        setSelectedEnemy={setEnemyInfo}
        enemiesData={enemiesData}
      />
    </main>
  );
}
