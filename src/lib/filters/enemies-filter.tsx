import { Enemy } from "../data/enemy-data";

export const filterEnemiesByLocation = (
  enemies: Enemy[],
  location: string
): Enemy[] => {
  if (!location) {
    return enemies;
  }

  return enemies.filter(
    (enemy) =>
      enemy.location === location || enemy.location.startsWith(location)
  );
};

export const filterEnemiesByDrop = (
  enemies: Enemy[],
  drop: string
): Enemy[] => {
  if (!drop) {
    return enemies;
  }

  return enemies.filter((enemy) => enemy.drops.some((d) => d.drop === drop));
};
