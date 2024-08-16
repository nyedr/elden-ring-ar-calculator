"use client";

import EnemiesTable from "@/components/enemies-table";
import EnemyInfo from "@/components/enemy-info";
import Header from "@/components/header";
import enemiesNG from "@/lib/data/csv/enemies/enemiesNG.json";
import { Enemy } from "@/lib/data/enemy-data";
import { useState, useEffect } from "react";
import EnemiesTableControl from "@/components/enemies-table-control";
import {
  filterEnemiesByLocation,
  filterEnemiesByDrop,
} from "@/lib/calc/enemies-filter";

export interface EmemyFilterData {
  location: string;
  type: string;
  drop: string;
}

export default function Enemies() {
  const [isEnemyInfoOpen, setIsEnemyInfoOpen] = useState(false);
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [enemiesFilterData, setEnemiesFilterData] = useState<EmemyFilterData>({
    location: "",
    type: "",
    drop: "",
  });
  const [enemiesData, setEnemiesData] = useState<Enemy[]>(enemiesNG as Enemy[]);

  const setEnemyInfo = (enemy: Enemy) => {
    setSelectedEnemy(enemy);
    setIsEnemyInfoOpen(true);
  };

  const filterEnemies = () => {
    const enemiesFilteredByLocation = filterEnemiesByLocation(
      enemiesNG as Enemy[],
      enemiesFilterData.location
    );

    const enemiesFilteredByDrop = filterEnemiesByDrop(
      enemiesFilteredByLocation,
      enemiesFilterData.drop
    );

    setEnemiesData(enemiesFilteredByDrop);
  };

  // TODO: Should be able to select an enemy and see more detailed information
  // Ex: Like items drops, location, etc.
  // TODO: Should have a filter for enemy type?
  // TODO: Should have a filter for enemy location?
  // TODO: Should have a filter for enemy drops?
  // TODO: Should be able to interact with the AR calculator to see how much damage you do to the enemy

  const clearFilters = () => {
    setEnemiesFilterData({ location: "", type: "", drop: "" });
    setEnemiesData(enemiesNG as Enemy[]);
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
      {/* <pre className="w-full p-4 rounded-lg bg-secondary">
        <code>{JSON.stringify(enemiesFilterData, null, 2)}</code>
      </pre> */}
      <EnemiesTable setSelectedEnemy={setEnemyInfo} enemiesData={enemiesData} />
    </main>
  );
}
