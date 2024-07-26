"use client";

import useCharacter from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import getWeapons from "@/lib/data/getWeapons";
import { useMemo, useState } from "react";
import { Weapon } from "@/lib/data/weapon";
import { ComboboxItem } from "@/components/weapon-search";
import WeaponsFilterControl from "@/components/weapons-filter-control";
import WeaponsTable from "@/components/weapons-table";
import {
  DamageType,
  damageTypes,
  PassiveType,
  passiveTypes,
  weaponTypes,
} from "@/lib/data/weapon-data";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { fitlerWeapons, sortWeapons } from "@/lib/calc/filter";
import { Button } from "@/components/ui/button";

export const sortByOptions = [
  ...passiveTypes.slice(),
  ...damageTypes.slice(),
  "AR",
  "Spell scaling",
] as const;

export type SortByOption = (typeof sortByOptions)[number];

export interface WeaponFilter {
  selectedWeaponTypes: string[];
  selectedDamageTypes: string[];
  selectedPassiveEffects: string[];
  sortBy: SortByOption;
}

const defaultWeaponTypesSelected = weaponTypes.map((type) => type.name);
const defaultDamageTypesSelected = damageTypes.slice();
const defaultPassiveEffectsSelected = [...passiveTypes.slice(), "None"];

export default function Home() {
  const { character, setCharacterAttribute } = useCharacter();

  // Memoize the initial weapons data
  const initialWeaponsData = useMemo(() => getWeapons(), []);

  const [weaponsData, setWeaponsData] = useState(initialWeaponsData);
  const [selectedWeapons, setSelectedWeapons] = useState<Weapon[] | null>([]);
  const [weaponFilter, setWeaponFilter] = useState<WeaponFilter>({
    selectedWeaponTypes: defaultWeaponTypesSelected,
    selectedDamageTypes: defaultDamageTypesSelected,
    selectedPassiveEffects: defaultPassiveEffectsSelected,
    sortBy: "AR",
  });

  const filterAndSortWeapons = () => {
    const filteredWeapons = fitlerWeapons(weaponsData.weapons, weaponFilter);
    const sortedAndFilteredWeapons = sortWeapons(
      filteredWeapons,
      character,
      weaponFilter.sortBy
    );

    return setWeaponsData((prev) => ({
      ...prev,
      weapons: sortedAndFilteredWeapons,
    }));
  };

  const setSelectedWeaponTypes = (selectedWeaponTypes: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedWeaponTypes }));
  const setSelectedDamageTypes = (selectedDamageTypes: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedDamageTypes }));
  const setSelectedPassiveEffects = (selectedPassiveEffects: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedPassiveEffects }));
  const setSortBy = (sortBy: SortByOption) =>
    setWeaponFilter((prev) => ({ ...prev, sortBy }));

  const weaponOptions: ComboboxItem[] = weaponsData.weapons.map((weapon) => ({
    value: weapon.weaponName,
    label: weapon.weaponName,
  }));

  return (
    <main className="flex flex-col gap-10 items-center max-w-[1420px] px-5 lg:px-0 mx-auto w-full py-4 max-[800px]:px-[calc(10vw/2)]">
      <div className="flex sm:flex-row flex-col justify-center h-full w-full gap-5 sm:justify-between">
        <CharacterStats {...{ character, setCharacterAttribute }} />
        <WeaponsFilterControl
          {...{
            findWeapon: weaponsData.findWeapon,
            items: weaponOptions,
            setSelectedWeapons,
            setSelectedWeaponTypes,
            setSelectedDamageTypes,
            setSelectedPassiveEffects,
            sortByOptions,
            selectedDamageTypes: weaponFilter.selectedDamageTypes,
            selectedPassiveEffects: weaponFilter.selectedPassiveEffects,
            selectedWeaponTypes: weaponFilter.selectedWeaponTypes,
            filterAndSortWeapons,
            setSortBy,
          }}
        />
      </div>
      <WeaponsTable character={character} weapons={weaponsData.weapons} />
    </main>
  );
}
