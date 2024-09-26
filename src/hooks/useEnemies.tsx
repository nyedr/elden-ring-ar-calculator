"use client";

import { Enemy, EnemyTypeData, NewGame } from "@/lib/data/enemy-data";
import { useState, useEffect, useMemo, useCallback } from "react";

import {
  filterEnemiesByDrop,
  filterEnemiesByLocation,
} from "@/lib/filters/enemies-filter";

import enemiesNG from "@/public/data/enemies/enemiesNG.json";
import enemiesNGPlus from "@/public/data/enemies/enemiesNG+.json";
import enemiesNGPlus2 from "@/public/data/enemies/enemiesNG+2.json";
import enemiesNGPlus3 from "@/public/data/enemies/enemiesNG+3.json";
import enemiesNGPlus4 from "@/public/data/enemies/enemiesNG+4.json";
import enemiesNGPlus5 from "@/public/data/enemies/enemiesNG+5.json";
import enemiesNGPlus6 from "@/public/data/enemies/enemiesNG+6.json";
import enemiesNGPlus7 from "@/public/data/enemies/enemiesNG+7.json";
import { EmemyFilterData } from "@/app/enemies/page";

const enemieDataByNewGame = {
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

  // Update enemies data and selected enemy when the new game mode changes
  useEffect(() => {
    const enemies = enemieDataByNewGame[newGame] as Enemy[];
    setEnemiesData(enemies);
    setSelectedEnemy((prev) =>
      prev ? enemies.find((enemy) => enemy.id === prev.id) ?? null : null
    );
  }, [newGame]);

  // Memoize the filtered enemies map
  const enemiesMap = useMemo(() => {
    return new Map<string, Enemy>(
      enemiesData.map((enemy) => [enemy.name, enemy])
    );
  }, [enemiesData]);

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
    setEnemiesData(enemieDataByNewGame[newGame] as Enemy[]);
  }, [newGame]);

  const filterEnemies = useCallback(
    (enemiesFilterData: EmemyFilterData) => {
      const enemiesFilteredByLocation = filterEnemiesByLocation(
        enemieDataByNewGame[newGame] as Enemy[],
        enemiesFilterData.location
      );

      const enemiesFilteredByDrop = filterEnemiesByDrop(
        enemiesFilteredByLocation,
        enemiesFilterData.drop
      );

      if (enemiesFilterData.type !== "None") {
        const enemiesFilteredByType = enemiesFilteredByDrop.filter(
          (enemy) => enemy.types[enemiesFilterData.type as keyof EnemyTypeData]
        );

        setEnemiesData(enemiesFilteredByType);
        return;
      }

      setEnemiesData(enemiesFilteredByDrop);
    },
    [newGame]
  );

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
