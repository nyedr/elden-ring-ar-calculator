"use client";

import useCharacter from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import getWeapons from "@/lib/data/getWeapons";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Weapon } from "@/lib/data/weapon";
import WeaponsTableControl from "@/components/weapons-table-control";
import WeaponsTable from "@/components/weapons-table";
import {
  allStatusEffects,
  weaponAffinities,
  weaponTypes,
} from "@/lib/data/weapon-data";
import { filterWeapons, WeaponFilter } from "@/lib/calc/weapons-filter";
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
    setNewGame,
  } = useEnemies();

  const getWeaponAttackRating = useCallback(
    (weapon: Weapon) => {
      if (!selectedEnemy || !isDamageOnEnemy) {
        return calculateWeaponDamage(
          character,
          weapon,
          Math.min(weaponState.selectedWeaponLevel[0], weapon.maxUpgradeLevel)
        );
      }

      return calculateEnemyDamage(
        calculateWeaponDamage(
          character,
          weapon,
          Math.min(weaponState.selectedWeaponLevel[0], weapon.maxUpgradeLevel)
        ),
        selectedEnemy
      );
    },
    [character, selectedEnemy, isDamageOnEnemy, weaponState.selectedWeaponLevel]
  );

  const updateWeaponInfo = useCallback(
    (weaponName: string) => {
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
    },
    [weaponsData, isDamageOnEnemy, selectedEnemy]
  );

  useEffect(() => {}, [character.attributes, selectedEnemy, isDamageOnEnemy]);

  const setFilteredWeapons = useCallback(() => {
    const filteredWeapons = filterWeapons(
      initialWeaponsData.weapons,
      weaponFilter
    );

    setWeaponsData((prev) => ({
      ...prev,
      weapons: filteredWeapons,
    }));
  }, [initialWeaponsData, character, weaponFilter]);

  const weaponSearchOptions: ComboboxItem[] = initialWeaponsData.weapons.map(
    (weapon) => ({
      value: weapon.weaponName,
      label: weapon.weaponName,
    })
  );

  const removeSelectedWeaponByName = useCallback(
    (weaponName: string) => {
      const updatedSelectedWeapons = weaponState.selectedWeapons.filter(
        (weapon) => weapon.weaponName !== weaponName
      );
      setWeaponState((prev) => ({
        ...prev,
        selectedWeapons: updatedSelectedWeapons,
      }));
    },
    [weaponState.selectedWeapons]
  );

  const updateSelectedWeapons = useCallback(
    (updateFunc: (prev: Weapon[]) => Weapon[]) => {
      setWeaponState((prev) => ({
        ...prev,
        selectedWeapons: updateFunc(prev.selectedWeapons),
        selectedChartWeapon: null,
      }));
    },
    []
  );

  const updateSelectedChartWeapon = useCallback((weapon: Weapon | null) => {
    setWeaponState((prev) => ({
      ...prev,
      selectedChartWeapon: weapon,
      selectedWeapons: [],
    }));
  }, []);

  return (
    <main className="flex flex-col gap-4 items-center w-full max-w-[1420px] px-5 lg:px-0 mx-auto py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <div className="flex sm:flex-row flex-col justify-center h-full w-full gap-5 sm:justify-between">
        {/*
            TODO: Create a character build page and move this there
            Replace this component with a field of Number inputs for each attack attribute
            With floating labels

            Above it should be a select that allows you to select the character build from 
            a list of saved builds from the character build page

            Above that should be two selects and a multi select for the body buff, aura buff, and other buffs
            Character type should be updated to accomodate for this extra data
        */}
        <CharacterStats
          {...{
            character,
            setCharacterAttribute,
            isTwoHanding: character.isTwoHanding,
            setIsTwoHanding,
          }}
        />
        {weaponState.weaponInfo && (
          <WeaponInfo
            character={character}
            isWeaponInfoOpen={weaponState.isWeaponInfoOpen && !isDamageOnEnemy}
            setIsWeaponInfoOpen={(isOpen: boolean) => {
              setWeaponState((prev) => ({ ...prev, isWeaponInfoOpen: isOpen }));
            }}
            weapon={weaponState.weaponInfo}
            setWeaponInfo={(weapon: Weapon) => {
              setWeaponState((prev) => ({ ...prev, weaponInfo: weapon }));
            }}
            affinityOptions={weaponsData.weapons.filter(
              (weapon) => weapon.name === weaponState.weaponInfo?.name
            )}
          />
        )}
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
      {weaponState.selectedChartWeapon && (
        <WeaponChart
          character={character}
          removeSelectedChartWeapon={() =>
            setWeaponState((prev) => ({ ...prev, selectedChartWeapon: null }))
          }
          selectedChartWeapon={weaponState.selectedChartWeapon}
          enemy={isDamageOnEnemy ? selectedEnemy : null}
        />
      )}
      {weaponState.selectedWeapons.length > 0 && (
        <SelectedWeaponsChart
          clearSelectedWeapons={() =>
            setWeaponState((prev) => ({ ...prev, selectedWeapons: [] }))
          }
          updateWeaponInfo={updateWeaponInfo}
          data={getWeaponsLevelsData(character, weaponState.selectedWeapons, {
            selectedEnemy,
            isDamageOnEnemy,
          })}
          removeSelectedWeapon={removeSelectedWeaponByName}
        />
      )}
      {selectedEnemy && (
        <EnemyInfo
          enemy={selectedEnemy}
          isOpen={isEnemyInfoOpen}
          setIsOpen={setIsEnemyInfoOpen}
          attackRating={
            weaponState.weaponInfo
              ? getWeaponAttackRating(weaponState.weaponInfo)
              : undefined
          }
          setWeaponInfo={(weapon: Weapon) => {
            setWeaponState((prev) => ({ ...prev, weaponInfo: weapon }));
          }}
          affinityOptions={weaponsData.weapons.filter(
            (weapon) => weapon.name === weaponState.weaponInfo?.name
          )}
        />
      )}

      <WeaponsTable
        updateWeaponInfo={updateWeaponInfo}
        selectedWeapons={weaponState.selectedWeapons}
        character={useDebouncedValue(character)}
        weaponAttackRatings={weaponsData.weapons.map((weapon) =>
          getWeaponAttackRating(weapon)
        )}
        setNewGame={setNewGame}
        setSelectedWeapons={updateSelectedWeapons}
        setSelectedChartWeapon={updateSelectedChartWeapon}
        isDamageOnEnemy={isDamageOnEnemy && !!selectedEnemy}
      />
    </main>
  );
}
