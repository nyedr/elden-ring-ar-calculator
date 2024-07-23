import { useState } from "react";
import { Weapon } from "./weapon-types";

const useWeapons = () => {
  const [weapons, setWeapons] = useState<Weapon[]>([] as Weapon[]);
  const [count, setCount] = useState(0);

  const weaponsMap = new Map(weapons.map((weapon) => [weapon.name, weapon]));

  const find = (weaponName: string) => {
    return weaponsMap.get(weaponName);
  };

  const findAll = (weaponNames: string[]) => {
    return weaponNames.map((weaponName) => weaponsMap.get(weaponName));
  };

  return {
    weapons,
    count,
    setCount,
    find,
    findAll,
    setWeapons,
  };
};

export default useWeapons;
