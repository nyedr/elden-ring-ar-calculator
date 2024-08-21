"use client";

import { Enemy, NewGame } from "@/lib/data/enemy-data";
import { useState, useEffect, useMemo, useCallback } from "react";

import {
  filterEnemiesByLocation,
  filterEnemiesByDrop,
} from "@/lib/calc/enemies-filter";

import enemiesNG from "@/lib/data/csv/enemies/enemiesNG.json";
import enemiesNGPlus from "@/lib/data/csv/enemies/enemiesNG+.json";
import enemiesNGPlus2 from "@/lib/data/csv/enemies/enemiesNG+2.json";
import enemiesNGPlus3 from "@/lib/data/csv/enemies/enemiesNG+3.json";
import enemiesNGPlus4 from "@/lib/data/csv/enemies/enemiesNG+4.json";
import enemiesNGPlus5 from "@/lib/data/csv/enemies/enemiesNG+5.json";
import enemiesNGPlus6 from "@/lib/data/csv/enemies/enemiesNG+6.json";
import enemiesNGPlus7 from "@/lib/data/csv/enemies/enemiesNG+7.json";
import { EmemyFilterData } from "@/app/enemies/page";

const enemiesByNewGame = {
  [NewGame.NG]: enemiesNG,
  [NewGame.NGPlus]: enemiesNGPlus,
  [NewGame.NGPlus2]: enemiesNGPlus2,
  [NewGame.NGPlus3]: enemiesNGPlus3,
  [NewGame.NGPlus4]: enemiesNGPlus4,
  [NewGame.NGPlus5]: enemiesNGPlus5,
  [NewGame.NGPlus6]: enemiesNGPlus6,
  [NewGame.NGPlus7]: enemiesNGPlus7,
};

export default function useEnemies() {
  const [enemiesData, setEnemiesData] = useState<Enemy[]>(enemiesNG as Enemy[]);
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [isDamageOnEnemy, setIsDamageOnEnemy] = useState(false);
  const [newGame, setNewGame] = useState<NewGame>(NewGame.NG);

  useEffect(() => {
    const enemies = enemiesByNewGame[newGame] as Enemy[];
    setEnemiesData(enemies);
    setSelectedEnemy(
      (prev) => enemies.find((enemy) => enemy.id === prev?.id) ?? null
    );
  }, [newGame]);

  const filterEnemies = useCallback((enemiesFilterData: EmemyFilterData) => {
    const enemiesFilteredByLocation = filterEnemiesByLocation(
      enemiesNG as Enemy[],
      enemiesFilterData.location
    );

    const enemiesFilteredByDrop = filterEnemiesByDrop(
      enemiesFilteredByLocation,
      enemiesFilterData.drop
    );

    setEnemiesData(enemiesFilteredByDrop);
  }, []);

  const enemiesMap = useMemo(
    () =>
      new Map<string, Enemy>(enemiesData.map((enemy) => [enemy.name, enemy])),
    [enemiesData]
  );

  const findEnemy = useCallback(
    (name: string) => {
      return enemiesMap.get(name);
    },
    [enemiesMap]
  );

  const updateSelectedEnemy = useCallback(
    (name: string) => {
      const enemy = findEnemy(name);
      if (enemy) {
        setSelectedEnemy(enemy);
      }
    },
    [findEnemy]
  );

  const resetEnemiesData = useCallback(() => {
    setEnemiesData(enemiesByNewGame[newGame] as Enemy[]);
  }, [newGame]);

  return {
    enemiesData,
    selectedEnemy,
    setSelectedEnemy: updateSelectedEnemy,
    isDamageOnEnemy,
    setIsDamageOnEnemy,
    newGame,
    setNewGame,
    filterEnemies,
    setEnemiesData,
    resetEnemiesData,
  };
}
