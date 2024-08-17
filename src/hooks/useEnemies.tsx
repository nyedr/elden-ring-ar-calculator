"use client";

import { Enemy, NewGame } from "@/lib/data/enemy-data";
import { useState, useEffect } from "react";

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

export default function useEnemies() {
  const [enemiesData, setEnemiesData] = useState<Enemy[]>(enemiesNG as Enemy[]);
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [isDamageOnEnemy, setIsDamageOnEnemy] = useState(false);
  const [newGame, setNewGame] = useState<NewGame>(NewGame.NG);

  const getEnemiesByNewGame = (newGame: NewGame) => {
    switch (newGame) {
      case NewGame.NG:
        return enemiesNG;
      case NewGame.NGPlus:
        return enemiesNGPlus;
      case NewGame.NGPlus2:
        return enemiesNGPlus2;
      case NewGame.NGPlus3:
        return enemiesNGPlus3;
      case NewGame.NGPlus4:
        return enemiesNGPlus4;
      case NewGame.NGPlus5:
        return enemiesNGPlus5;
      case NewGame.NGPlus6:
        return enemiesNGPlus6;
      case NewGame.NGPlus7:
        return enemiesNGPlus7;
      default:
        return enemiesNG;
    }
  };

  useEffect(() => {
    setEnemiesData(getEnemiesByNewGame(newGame) as Enemy[]);
  }, [newGame]);

  const filterEnemies = (enemiesFilterData: EmemyFilterData) => {
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

  const enemiesMap = new Map<string, Enemy>(
    enemiesData.map((enemy) => [enemy.name, enemy])
  );

  const findEnemy = (name: string) => {
    return enemiesMap.get(name);
  };

  const updateSelectedEnemy = (name: string) => {
    const enemy = findEnemy(name);
    if (enemy) {
      setSelectedEnemy(enemy);
    }
  };

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
    resetEnemiesData: () =>
      setEnemiesData(getEnemiesByNewGame(newGame) as Enemy[]),
  };
}
