"use client";

import EnemiesTable from "@/components/enemies-table";
import EnemyInfo from "@/components/enemy-info";
import Header from "@/components/header";

import { Enemy, EnemyType } from "@/lib/data/enemy-data";
import { useState } from "react";
import EnemiesTableControl from "@/components/enemies-table-control";
import useEnemies from "@/hooks/useEnemies";

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
        <EnemyInfo
          enemy={selectedEnemy}
          isOpen={isEnemyInfoOpen}
          setIsOpen={setIsEnemyInfoOpen}
        />
      )}
      <EnemiesTable
        setNewGame={setNewGame}
        setSelectedEnemy={setEnemyInfo}
        enemiesData={enemiesData}
      />
    </main>
  );
}
