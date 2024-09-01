"use client";

import useCharacter from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import { useEffect, useState, useCallback } from "react";
import { Weapon } from "@/lib/data/weapon";
import WeaponsTableControl from "@/components/weapons-table-control";
import WeaponsTable from "@/components/weapons-table";
import {
  defaultWeaponFilter,
  filterWeapons,
  WeaponFilter,
} from "@/lib/filters/weapons-filter";
import Header from "@/components/header";
import SelectedWeaponsChart from "@/components/selected-weapons-chart";
import {
  removeDuplicateNames,
  specialAndRegularLevelsDict,
  getWeaponsLevelsData,
} from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import WeaponChart from "@/components/weapon-chart";
import { WeaponInfoProps } from "@/components/weapon-info";
import { ComboboxItem } from "@/components/ui/combobox";
import useEnemies from "@/hooks/useEnemies";
import useWeapons from "@/hooks/useWeapons";
import {
  calculateDamageAgainstEnemy,
  getWeaponAttack,
} from "@/lib/calc/calculator";
import ExtraInfo from "@/components/extra-info";

export interface WeaponState {
  selectedWeapons: Weapon[];
  selectedChartWeapon: Weapon | null;
  weaponInfo: Weapon | null;
  selectedWeaponLevel: [number, number, string];
}

export default function Home() {
  const {
    character,
    setCharacterAttribute,
    setIsTwoHanding,
    getAttackAttributes,
  } = useCharacter();

  const weaponsData = useWeapons();

  const [weaponFilter, setWeaponFilter] =
    useState<WeaponFilter>(defaultWeaponFilter);

  const [weaponState, setWeaponState] = useState<WeaponState>({
    selectedWeapons: [],
    selectedChartWeapon: null,
    weaponInfo: null,
    selectedWeaponLevel:
      specialAndRegularLevelsDict[specialAndRegularLevelsDict.length - 1],
  });

  const [isExtraInfoOpen, setIsExtraInfoOpen] = useState(false);

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
      const attackRating = getWeaponAttack({
        weapon,
        attributes: getAttackAttributes(character.attributes),
        twoHanding: character.isTwoHanding,
        upgradeLevel: Math.min(
          weaponState.selectedWeaponLevel[0],
          weapon?.attack?.length - 1
        ),
      });

      if (selectedEnemy && isDamageOnEnemy) {
        return calculateDamageAgainstEnemy(attackRating, selectedEnemy);
      }

      return attackRating;
    },
    [
      character,
      selectedEnemy,
      isDamageOnEnemy,
      getAttackAttributes,
      weaponState.selectedWeaponLevel,
    ]
  );

  const updateWeaponInfo = useCallback(
    (name: string) => {
      const weapon = weaponsData.findWeapon(name);

      if (!weapon) return;

      if (isDamageOnEnemy && selectedEnemy) {
        setWeaponState((prev) => ({
          ...prev,
          weaponInfo: weapon,
        }));

        setIsExtraInfoOpen(true);
      }

      setWeaponState((prev) => ({
        ...prev,
        weaponInfo: weapon,
      }));

      setIsExtraInfoOpen(true);
    },
    [weaponsData, isDamageOnEnemy, selectedEnemy]
  );

  useEffect(() => {}, [character.attributes, selectedEnemy, isDamageOnEnemy]);

  const weaponSearchOptions: ComboboxItem[] = weaponsData.weapons.map(
    (weapon) => ({
      value: weapon.name,
      label: weapon.name,
    })
  );

  const removeSelectedWeaponByName = useCallback(
    (name: string) => {
      const updatedSelectedWeapons = weaponState.selectedWeapons.filter(
        (weapon) => weapon.name !== name
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
            TODO: Add two selects and a multi select for body buffs, aura buffs, and other buffs
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

        <ExtraInfo
          enemy={
            selectedEnemy && weaponState.weaponInfo
              ? {
                  enemy: selectedEnemy,
                  attackRating: getWeaponAttackRating(weaponState.weaponInfo),
                }
              : undefined
          }
          weapon={
            weaponState.weaponInfo
              ? ({
                  weapon: weaponState.weaponInfo,
                  character,
                } as Omit<WeaponInfoProps, "isOpen" | "setIsOpen">)
              : undefined
          }
          setWeaponInfo={(weapon: Weapon) => {
            setWeaponState((prev) => ({ ...prev, weaponInfo: weapon }));
          }}
          setIsOpen={setIsExtraInfoOpen}
          isOpen={isExtraInfoOpen}
          weaponAffinityOptions={weaponsData.weapons.filter(
            (weapon) => weapon.weaponName === weaponState.weaponInfo?.weaponName
          )}
          isDamageOnEnemy={isDamageOnEnemy}
        />

        <WeaponsTableControl
          {...{
            findWeapon: weaponsData.findWeapon,
            weaponSearchOptions,
            setSelectedWeapons: updateSelectedWeapons,
            setSelectedChartWeapon: updateSelectedChartWeapon,
            setWeaponFilter,
            weaponFilter,
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

      {/* <pre className="w-full p-3 rounded-md bg-secondary">
        <code>
          {JSON.stringify(
            weaponsData.weapons[3]
              ? {
                  enemyDamage: calculateDamageAgainstEnemy(
                    getWeaponAttackRating(weaponsData.weapons[2]),
                    enemiesData[3]
                  ),
                  enemy: enemiesData[3],
                  attackRating: {
                    ...getWeaponAttackRating(weaponsData.weapons[3]),
                    weapon: {
                      ...weaponsData.weapons[3],
                      calcCorrectGraphs: null,
                    },
                  },
                  weapon: {
                    ...weaponsData.weapons[3],
                    calcCorrectGraphs: null,
                  },
                }
              : null,
            null,
            2
          )}
        </code>
      </pre> */}

      <WeaponsTable
        updateWeaponInfo={updateWeaponInfo}
        selectedWeapons={weaponState.selectedWeapons}
        character={useDebouncedValue(character)}
        weaponAttackRatings={filterWeapons(
          weaponsData.weapons.map(getWeaponAttackRating),
          weaponFilter
        )}
        isLoading={weaponsData.isLoading && weaponsData.weapons.length === 0}
        setNewGame={setNewGame}
        setSelectedWeapons={updateSelectedWeapons}
        setSelectedChartWeapon={updateSelectedChartWeapon}
        isDamageOnEnemy={isDamageOnEnemy && !!selectedEnemy}
      />
    </main>
  );
}
