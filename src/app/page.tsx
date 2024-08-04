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
  damageTypes,
  statusEffects,
  weaponAffinities,
  weaponTypes,
} from "@/lib/data/weapon-data";
import {
  filterWeapons,
  SortByOption,
  sortByOptions,
  sortWeapons,
  WeaponFilter,
} from "@/lib/calc/filter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { calculateWeaponDamage } from "@/lib/calc/damage";

const defaultWeaponTypesSelected = weaponTypes.map((type) => type.name);
const defaultDamageTypesSelected = damageTypes.slice();
const defaultStatusEffectsSelected = [...statusEffects.slice(), "None"];
const defaultWeaponAffinitiesSelected = [...weaponAffinities.slice()];

export default function Home() {
  const { character, setCharacterAttribute } = useCharacter();

  // Memoize the initial weapons data
  const initialWeaponsData = useMemo(() => getWeapons(), []);

  const [weaponsData, setWeaponsData] = useState(initialWeaponsData);
  const [selectedWeapons, setSelectedWeapons] = useState<Weapon[] | null>([]);
  const [weaponFilter, setWeaponFilter] = useState<WeaponFilter>({
    selectedWeaponTypes: defaultWeaponTypesSelected,
    selectedDamageTypes: defaultDamageTypesSelected,
    selectedStatusEffects: defaultStatusEffectsSelected,
    selectedWeaponAffinities: defaultWeaponAffinitiesSelected,
    sortBy: "AR",
    toggleSortBy: false,
  });

  const filterAndSortWeapons = () => {
    const filteredWeapons = filterWeapons(weaponsData.weapons, weaponFilter);
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

  const sortWeaponsTable = (sortByOption: SortByOption) => {
    const toggleSortBy =
      weaponFilter.sortBy === sortByOption ? !weaponFilter.toggleSortBy : false;

    setWeaponsData((prev) => ({
      ...prev,
      weapons: sortWeapons(
        weaponsData.weapons,
        character,
        sortByOption,
        toggleSortBy
      ),
    }));

    setWeaponFilter((prev) => ({
      ...prev,
      sortBy: sortByOption,
      toggleSortBy,
    }));
  };
  const setSelectedWeaponTypes = (selectedWeaponTypes: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedWeaponTypes }));
  const setSelectedDamageTypes = (selectedDamageTypes: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedDamageTypes }));
  const setSelectedStatusEffects = (selectedStatusEffects: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedStatusEffects }));
  const setSelectedWeaponAffinities = (selectedWeaponAffinities: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedWeaponAffinities }));
  const setSortBy = (sortBy: SortByOption) =>
    setWeaponFilter((prev) => ({ ...prev, sortBy }));

  const weaponOptions: ComboboxItem[] = weaponsData.weapons.map((weapon) => ({
    value: weapon.weaponName,
    label: weapon.weaponName,
  }));

  return (
    <main className="flex flex-col gap-4 items-center max-w-[1420px] px-5 lg:px-0 mx-auto w-full py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <div className="flex sm:flex-row flex-col justify-center h-full w-full gap-5 sm:justify-between">
        <CharacterStats {...{ character, setCharacterAttribute }} />
        <WeaponsFilterControl
          {...{
            findWeapon: weaponsData.findWeapon,
            items: weaponOptions,
            setSelectedWeapons,
            setSelectedWeaponTypes,
            setSelectedDamageTypes,
            setSelectedStatusEffects,
            setSelectedWeaponAffinities,
            sortByOptions,
            selectedDamageTypes: weaponFilter.selectedDamageTypes,
            selectedStatusEffects: weaponFilter.selectedStatusEffects,
            selectedWeaponTypes: weaponFilter.selectedWeaponTypes,
            selectedWeaponAffinities: weaponFilter.selectedWeaponAffinities,
            filterAndSortWeapons,
            setSortBy,
          }}
        />
      </div>
      <WeaponsTable
        sortWeaponsTable={sortWeaponsTable}
        character={character}
        weapons={weaponsData.weapons}
      />
    </main>
  );
}
