"use client";

import useCharacter from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import getWeapons from "@/lib/data/getWeapons";
import { useEffect, useMemo, useState } from "react";
import { Weapon } from "@/lib/data/weapon";
import { ComboboxItem } from "@/components/weapon-search";
import WeaponsFilterControl from "@/components/weapons-filter-control";
import WeaponsTable from "@/components/weapons-table";
import {
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
import SelectedWeaponsChart from "@/components/selected-weapons-chart";
import { getWeaponsLevelsData } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import WeaponChart from "@/components/weapon-chart";
import WeaponInfo from "@/components/weapon-info";

const defaultWeaponTypesSelected = weaponTypes.map((type) => type.name);
const defaultStatusEffectsSelected = [...statusEffects.slice(), "None"];
const defaultWeaponAffinitiesSelected = [...weaponAffinities.slice()];

export default function Home() {
  const { character, setCharacterAttribute } = useCharacter();

  const initialWeaponsData = useMemo(() => getWeapons(), []);

  const [weaponsData, setWeaponsData] = useState(initialWeaponsData);
  const [selectedWeapons, setSelectedWeapons] = useState<Weapon[]>([]);
  const [weaponFilter, setWeaponFilter] = useState<WeaponFilter>({
    selectedWeaponTypes: defaultWeaponTypesSelected,
    selectedStatusEffects: defaultStatusEffectsSelected,
    selectedWeaponAffinities: defaultWeaponAffinitiesSelected,
    sortBy: "AR",
    toggleSortBy: false,
  });
  const [selectedChartWeapon, setSelectedChartWeapon] = useState<Weapon | null>(
    null
  );
  const [weaponInfo, setWeaponInfo] = useState<Weapon | null>(null);
  const [isWeaponInfoOpen, setIsWeaponInfoOpen] = useState(false);

  const updateWeaponInfo = (weaponName: string) => {
    const weapon = weaponsData.findWeapon(weaponName);
    if (weapon) {
      setWeaponInfo(weapon);
      setIsWeaponInfoOpen(true);
    }
  };

  useEffect(() => {
    sortWeaponsTable(weaponFilter.sortBy, false);
  }, [character.attributes]);

  const setFilteredWeapons = () => {
    const sortedWeapons = sortWeapons(
      initialWeaponsData.weapons,
      character,
      weaponFilter.sortBy,
      weaponFilter.toggleSortBy
    );
    const filteredWeapons = filterWeapons(sortedWeapons, weaponFilter);

    setWeaponsData((prev) => ({
      ...prev,
      weapons: filteredWeapons,
    }));
  };

  const sortWeaponsTable = (sortByOption: SortByOption, toggle = true) => {
    const toggleSortBy =
      weaponFilter.sortBy === sortByOption ? !weaponFilter.toggleSortBy : false;

    setWeaponsData((prev) => ({
      ...prev,
      weapons: sortWeapons(
        weaponsData.weapons,
        character,
        sortByOption,
        toggle ? toggleSortBy : weaponFilter.toggleSortBy
      ),
    }));

    setWeaponFilter((prev) => ({
      ...prev,
      sortBy: sortByOption,
      toggleSortBy: toggle ? toggleSortBy : weaponFilter.toggleSortBy,
    }));
  };
  const setSelectedWeaponTypes = (selectedWeaponTypes: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedWeaponTypes }));
  const setSelectedStatusEffects = (selectedStatusEffects: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedStatusEffects }));
  const setSelectedWeaponAffinities = (selectedWeaponAffinities: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedWeaponAffinities }));
  const setSortBy = (sortBy: SortByOption) =>
    setWeaponFilter((prev) => ({ ...prev, sortBy }));

  const weaponSearchOptions: ComboboxItem[] = initialWeaponsData.weapons.map(
    (weapon) => ({
      value: weapon.weaponName,
      label: weapon.weaponName,
    })
  );

  const removeSelectedWeaponByName = (weaponName: string) => {
    const updatedSelectedWeapons = selectedWeapons.filter(
      (weapon) => weapon.weaponName !== weaponName
    );
    setSelectedWeapons(updatedSelectedWeapons);
  };

  const updateSelectedWeapons = (updateFunc: (prev: Weapon[]) => Weapon[]) => {
    setSelectedWeapons((prev) => {
      return updateFunc(prev);
    });

    setSelectedChartWeapon(null);
  };

  const updateSelectedChartWeapon = (weapon: Weapon | null) => {
    setSelectedChartWeapon(weapon);
    setSelectedWeapons([]);
  };

  return (
    <main className="flex flex-col gap-4 items-center max-w-[1420px] px-5 lg:px-0 mx-auto w-full py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <div className="flex sm:flex-row flex-col justify-center h-full w-full gap-5 sm:justify-between">
        <CharacterStats {...{ character, setCharacterAttribute }} />
        {weaponInfo ? (
          <WeaponInfo
            character={character}
            isWeaponInfoOpen={isWeaponInfoOpen}
            setIsWeaponInfoOpen={setIsWeaponInfoOpen}
            weapon={weaponInfo}
          />
        ) : null}
        <WeaponsFilterControl
          {...{
            findWeapon: weaponsData.findWeapon,
            weaponSearchOptions,
            setSelectedWeapons: updateSelectedWeapons,
            setSelectedWeaponTypes,
            setSelectedStatusEffects,
            setSelectedWeaponAffinities,
            sortByOptions,
            selectedStatusEffects: weaponFilter.selectedStatusEffects,
            selectedWeaponTypes: weaponFilter.selectedWeaponTypes,
            selectedWeaponAffinities: weaponFilter.selectedWeaponAffinities,
            setSelectedChartWeapon: updateSelectedChartWeapon,
            setFilteredWeapons,
            setSortBy,
            updateWeaponInfo,
          }}
        />
      </div>
      {selectedChartWeapon ? (
        <WeaponChart
          character={character}
          removeSelectedChartWeapon={() => setSelectedChartWeapon(null)}
          selectedChartWeapon={selectedChartWeapon}
        />
      ) : null}
      {selectedWeapons.length ? (
        <SelectedWeaponsChart
          clearSelectedWeapons={() => setSelectedWeapons([])}
          data={getWeaponsLevelsData(character, selectedWeapons)}
          removeSelectedWeapon={removeSelectedWeaponByName}
        />
      ) : null}

      <WeaponsTable
        updateWeaponInfo={updateWeaponInfo}
        selectedWeapons={selectedWeapons}
        sortWeaponsTable={sortWeaponsTable}
        character={useDebouncedValue(character)}
        weapons={useDebouncedValue(weaponsData.weapons)}
        setSelectedWeapons={updateSelectedWeapons}
        setSelectedChartWeapon={updateSelectedChartWeapon}
      />
    </main>
  );
}
