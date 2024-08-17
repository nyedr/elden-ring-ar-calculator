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
import {
  getWeaponsLevelsData,
  specialAndRegularLevelsDict,
  removeDuplicateNames,
} from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import WeaponChart from "@/components/weapon-chart";
import WeaponInfo from "@/components/weapon-info";
import { calculateEnemyDamage, calculateWeaponDamage } from "@/lib/calc/damage";
import { AttackRating } from "@/lib/data/attackRating";
import { ComboboxItem } from "@/components/ui/combobox";
import useEnemies from "@/hooks/useEnemies";
import EnemyInfo from "@/components/enemy-info";

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
  const [isEnemyInfoOpen, setIsEnemyInfoOpen] = useState(false);

  const [weaponState, setWeaponState] = useState<WeaponState>({
    selectedWeapons: [],
    selectedChartWeapon: null,
    weaponInfo: null,
    isWeaponInfoOpen: false,
    selectedWeaponLevel:
      specialAndRegularLevelsDict[specialAndRegularLevelsDict.length - 1],
  });

  const {
    enemiesData,
    selectedEnemy,
    setSelectedEnemy,
    isDamageOnEnemy,
    setIsDamageOnEnemy,
    newGame,
    setNewGame,
  } = useEnemies();

  const getWeaponAttackRating = (weapon: Weapon) => {
    if (!selectedEnemy || !isDamageOnEnemy) {
      return calculateWeaponDamage(
        character,
        weapon,
        weapon.maxUpgradeLevel > 10
          ? Math.min(weaponState.selectedWeaponLevel[0], weapon.maxUpgradeLevel)
          : Math.min(weaponState.selectedWeaponLevel[1], weapon.maxUpgradeLevel)
      );
    }

    return calculateEnemyDamage(
      calculateWeaponDamage(
        character,
        weapon,
        // TODO: This is a hacky way to handle the different upgrade levels
        weapon.maxUpgradeLevel > 10
          ? Math.min(weaponState.selectedWeaponLevel[0], weapon.maxUpgradeLevel)
          : Math.min(weaponState.selectedWeaponLevel[1], weapon.maxUpgradeLevel)
      ),
      selectedEnemy
    );
  };

  const updateWeaponInfo = (weaponName: string) => {
    const weapon = weaponsData.findWeapon(weaponName);

    if (!weapon) return;

    if (isDamageOnEnemy && selectedEnemy) {
      setWeaponState((prev) => ({
        ...prev,
        weaponInfo: weapon,
        isWeaponInfoOpen: false,
      }));

      setIsEnemyInfoOpen(true);
    }

    setWeaponState((prev) => ({
      ...prev,
      weaponInfo: weapon,
      isWeaponInfoOpen: true,
    }));
  };

  useEffect(() => {
    sortWeaponsTable(weaponFilter.sortBy, false);
  }, [character.attributes, selectedEnemy, isDamageOnEnemy]);

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
        toggle ? toggleSortBy : weaponFilter.toggleSortBy,
        {
          isDamageOnEnemy,
          selectedEnemy,
        }
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

  return (
    <main className="flex flex-col gap-4 items-center w-full max-w-[1420px] px-5 lg:px-0 mx-auto py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <div className="flex sm:flex-row flex-col justify-center h-full w-full gap-5 sm:justify-between">
        <CharacterStats {...{ character, setCharacterAttribute }} />
        {/* TODO: Weapon info opens when isEnemyDamage is set to false after weapon info was set */}
        {weaponState.weaponInfo ? (
          <WeaponInfo
            character={character}
            isWeaponInfoOpen={weaponState.isWeaponInfoOpen && !isDamageOnEnemy}
            setIsWeaponInfoOpen={(isOpen: boolean) => {
              setWeaponState((prev) => ({ ...prev, isWeaponInfoOpen: isOpen }));
            }}
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
            enemySearchOptions: removeDuplicateNames(enemiesData).map(
              (enemy) => ({
                label: enemy.name,
                value: enemy.name,
              })
            ),
            isDamageOnEnemy,
            setIsDamageOnEnemy,
            setSelectedEnemy,
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
      {!!selectedEnemy && (
        <EnemyInfo
          enemy={selectedEnemy}
          isOpen={isEnemyInfoOpen}
          setIsOpen={setIsEnemyInfoOpen}
          attackRating={
            !!weaponState.weaponInfo
              ? getWeaponAttackRating(weaponState.weaponInfo)
              : undefined
          }
        />
      )}
      {/* <pre className="w-full p-4 rounded-lg bg-secondary">
        <code>
          {JSON.stringify(weaponAttackRatingsTest.slice(0, 5), null, 2)}
        </code>
      </pre> */}
      <WeaponsTable
        updateWeaponInfo={updateWeaponInfo}
        selectedWeapons={weaponState.selectedWeapons}
        sortWeaponsTable={sortWeaponsTable}
        character={useDebouncedValue(character)}
        weaponAttackRatings={weaponsData.weapons.map((weapon) =>
          getWeaponAttackRating(weapon)
        )}
        setSelectedWeapons={updateSelectedWeapons}
        setSelectedChartWeapon={updateSelectedChartWeapon}
        isDamageOnEnemy={isDamageOnEnemy && !!selectedEnemy}
      />
    </main>
  );
}
