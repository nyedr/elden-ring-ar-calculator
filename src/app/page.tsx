"use client";

import useCharacter from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import getWeapons from "@/lib/data/getWeapons";
import { useEffect, useMemo, useState } from "react";
import { Weapon } from "@/lib/data/weapon";
import WeaponsTableControl from "@/components/weapons-table-control";
import WeaponsTable from "@/components/weapons-table";
import {
  allStatusEffects,
  weaponAffinities,
  weaponTypes,
} from "@/lib/data/weapon-data";
import {
  filterWeapons,
  SortByOption,
  sortWeapons,
  WeaponFilter,
} from "@/lib/calc/weapons-filter";
import Header from "@/components/header";
import SelectedWeaponsChart from "@/components/selected-weapons-chart";
import { getWeaponsLevelsData, specialAndRegularLevelsDict } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import WeaponChart from "@/components/weapon-chart";
import WeaponInfo from "@/components/weapon-info";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { AttackRating } from "@/lib/data/attackRating";
import { Enemy, NewGame } from "@/lib/data/enemy-data";
import { ComboboxItem } from "@/components/ui/combobox";

const defaultWeaponTypesSelected = weaponTypes.map((type) => type.name);
const defaultStatusEffectsSelected = [...allStatusEffects.slice(), "None"];
const defaultWeaponAffinitiesSelected = [...weaponAffinities.slice()];

export interface WeaponState {
  selectedWeapons: Weapon[];
  selectedChartWeapon: Weapon | null;
  weaponInfo: Weapon | null;
  isWeaponInfoOpen: boolean;
  selectedWeaponLevel: [number, number, string];
}

export default function Home() {
  const { character, setCharacterAttribute, setIsTwoHanding } = useCharacter();

  const initialWeaponsData = useMemo(() => getWeapons(), []);
  const [weaponsData, setWeaponsData] = useState(initialWeaponsData);

  const [weaponFilter, setWeaponFilter] = useState<WeaponFilter>({
    selectedWeaponTypes: defaultWeaponTypesSelected,
    selectedStatusEffects: defaultStatusEffectsSelected,
    selectedWeaponAffinities: defaultWeaponAffinitiesSelected,
    sortBy: "AR",
    toggleSortBy: false,
  });

  const [weaponState, setWeaponState] = useState<WeaponState>({
    selectedWeapons: [],
    selectedChartWeapon: null,
    weaponInfo: null,
    isWeaponInfoOpen: false,
    selectedWeaponLevel:
      specialAndRegularLevelsDict[specialAndRegularLevelsDict.length - 1],
  });

  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [isDamageOnEnemy, setIsDamageOnEnemy] = useState(false);

  const updateWeaponInfo = (weaponName: string) => {
    const weapon = weaponsData.findWeapon(weaponName);
    if (weapon) {
      setWeaponState((prev) => ({
        ...prev,
        weaponInfo: weapon,
        isWeaponInfoOpen: true,
      }));
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

  const weaponSearchOptions: ComboboxItem[] = initialWeaponsData.weapons.map(
    (weapon) => ({
      value: weapon.weaponName,
      label: weapon.weaponName,
    })
  );

  const removeSelectedWeaponByName = (weaponName: string) => {
    const updatedSelectedWeapons = weaponState.selectedWeapons.filter(
      (weapon) => weapon.weaponName !== weaponName
    );
    setWeaponState((prev) => ({
      ...prev,
      selectedWeapons: updatedSelectedWeapons,
    }));
  };

  const updateSelectedWeapons = (updateFunc: (prev: Weapon[]) => Weapon[]) => {
    setWeaponState((prev) => {
      return {
        ...prev,
        selectedWeapons: updateFunc(prev.selectedWeapons),
        selectedChartWeapon: null,
      };
    });
  };

  const updateSelectedChartWeapon = (weapon: Weapon | null) => {
    setWeaponState((prev) => ({
      ...prev,
      selectedChartWeapon: weapon,
      selectedWeapons: [],
    }));
  };

  const weaponAttackRatings: AttackRating[] = weaponsData.weapons.map(
    (weapon) => {
      return calculateWeaponDamage(
        character,
        weapon,
        // TODO: This is a hacky way to handle the different upgrade levels
        weapon.maxUpgradeLevel > 10
          ? Math.min(weaponState.selectedWeaponLevel[0], weapon.maxUpgradeLevel)
          : Math.min(weaponState.selectedWeaponLevel[1], weapon.maxUpgradeLevel)
      );
    }
  );

  return (
    <main className="flex flex-col gap-4 items-center w-full max-w-[1420px] px-5 lg:px-0 mx-auto py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <div className="flex sm:flex-row flex-col justify-center h-full w-full gap-5 sm:justify-between">
        <CharacterStats {...{ character, setCharacterAttribute }} />
        {weaponState.weaponInfo ? (
          <WeaponInfo
            character={character}
            isWeaponInfoOpen={weaponState.isWeaponInfoOpen}
            setIsWeaponInfoOpen={(isOpen: boolean) =>
              setWeaponState((prev) => ({ ...prev, isWeaponInfoOpen: isOpen }))
            }
            weapon={weaponState.weaponInfo}
          />
        ) : null}
        <WeaponsTableControl
          {...{
            findWeapon: weaponsData.findWeapon,
            weaponSearchOptions,
            setSelectedWeapons: updateSelectedWeapons,
            setWeaponFilter,
            weaponFilter,
            setSelectedChartWeapon: updateSelectedChartWeapon,
            setFilteredWeapons,
            updateWeaponInfo,
            weaponState,
            setWeaponState,
            isTwoHanding: character.isTwoHanding,
            setIsTwoHanding,
          }}
        />
      </div>
      {weaponState.selectedChartWeapon ? (
        <WeaponChart
          character={character}
          removeSelectedChartWeapon={() =>
            setWeaponState((prev) => ({ ...prev, selectedChartWeapon: null }))
          }
          selectedChartWeapon={weaponState.selectedChartWeapon}
        />
      ) : null}
      {weaponState.selectedWeapons.length ? (
        <SelectedWeaponsChart
          clearSelectedWeapons={() =>
            setWeaponState((prev) => ({ ...prev, selectedWeapons: [] }))
          }
          data={getWeaponsLevelsData(character, weaponState.selectedWeapons)}
          removeSelectedWeapon={removeSelectedWeaponByName}
        />
      ) : null}
      {/* <pre className="w-full p-4 rounded-lg bg-secondary">
        <code>{JSON.stringify(enemies, null, 2)}</code>
      </pre> */}
      <WeaponsTable
        updateWeaponInfo={updateWeaponInfo}
        selectedWeapons={weaponState.selectedWeapons}
        sortWeaponsTable={sortWeaponsTable}
        character={useDebouncedValue(character)}
        weaponAttackRatings={weaponAttackRatings}
        setSelectedWeapons={updateSelectedWeapons}
        setSelectedChartWeapon={updateSelectedChartWeapon}
      />
    </main>
  );
}
