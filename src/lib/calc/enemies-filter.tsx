import { Enemy } from "../data/enemy-data";

// TODO: Fix filter enemies by location, it's not working as expected

export const filterEnemiesByLocation = (
  enemies: Enemy[],
  location: string
): Enemy[] => {
  const generalAreaPattern = new RegExp(`^${location}`, "i");

  if (!location) {
    return enemies;
  }

  return enemies.filter(
    (enemy) =>
      generalAreaPattern.test(enemy.location) || enemy.location === location
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
