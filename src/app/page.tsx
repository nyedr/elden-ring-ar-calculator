"use client";

import useCharacter, { getAttackAttributes } from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
import { SelectItem } from "@/components/ui/combobox";
import useEnemies from "@/hooks/useEnemies";
import useWeapons from "@/hooks/useWeapons";
import {
  calculateDamageAgainstEnemy,
  getWeaponAttack,
  WeaponAttackResult,
} from "@/lib/calc/calculator";
import ExtraInfo from "@/components/extra-info";
import { applyBuffs, filterApplicableBuffs } from "@/lib/data/buffs";
import { BuffSelection, defaultBuffSelection } from "@/components/buffs-dialog";

export interface WeaponState {
  selectedWeapons: Weapon[];
  selectedChartWeapon: Weapon | null;
  weaponInfo: Weapon | null;
  weaponMove: string | null;
}

// TODO!: Application is too laggy when changes are being made

export default function Home() {
  const { character, setCharacterAttribute, setIsTwoHanding } = useCharacter();

  const weaponsData = useWeapons();

  const [weaponFilter, setWeaponFilter] =
    useState<WeaponFilter>(defaultWeaponFilter);

  const [weaponState, setWeaponState] = useState<WeaponState>({
    selectedWeapons: [],
    selectedChartWeapon: null,
    weaponInfo: null,
    weaponMove: null,
  });
  const [selectedWeaponLevel, setSelectedWeaponLevel] = useState<
    [number, number, string]
  >(specialAndRegularLevelsDict[specialAndRegularLevelsDict.length - 1]);
  const [buffs, setBuffs] = useState<BuffSelection>(defaultBuffSelection);
  const [isExtraInfoOpen, setIsExtraInfoOpen] = useState(false);
  const weaponAttackRatingCache = useRef<Map<string, WeaponAttackResult>>(
    new Map()
  );

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
      const isWeaponUpgradeable =
        weapon.name !== "Unarmed" && weapon.name !== "Meteorite Staff";
      const maxUpgradeLevel = weapon.isSpecialWeapon
        ? selectedWeaponLevel[1]
        : selectedWeaponLevel[0];

      const attackRating = getWeaponAttack({
        weapon,
        attributes: getAttackAttributes(character.attributes),
        twoHanding: character.isTwoHanding,
        upgradeLevel: Math.min(isWeaponUpgradeable ? maxUpgradeLevel : 0),
      });

      const validBuffs = filterApplicableBuffs({
        buffs,
        isTwoHanding: character.isTwoHanding,
        weaponAttackResult: attackRating,
        enemy: selectedEnemy || undefined,
        move: weaponState.weaponMove || undefined,
      });

      if (selectedEnemy && isDamageOnEnemy) {
        const enemyDamage = calculateDamageAgainstEnemy(
          attackRating,
          selectedEnemy
        );

        return applyBuffs(validBuffs, enemyDamage, isDamageOnEnemy);
      }

      return applyBuffs(validBuffs, attackRating);
    },
    [
      character.attributes,
      character.isTwoHanding,
      selectedEnemy,
      isDamageOnEnemy,
      selectedWeaponLevel,
      buffs,
      weaponState.weaponMove,
    ]
  );

  const getCachedWeaponAttackRating = useCallback(
    (weapon: Weapon) => {
      const cacheKey = `${weapon.name}_${
        selectedEnemy?.id || "no_enemy"
      }_${isDamageOnEnemy}`;

      if (weaponAttackRatingCache.current.has(cacheKey)) {
        return weaponAttackRatingCache.current.get(cacheKey);
      } else {
        const rating = getWeaponAttackRating(weapon);
        weaponAttackRatingCache.current.set(cacheKey, rating);
        return rating;
      }
    },
    [getWeaponAttackRating, selectedEnemy?.id, isDamageOnEnemy]
  );

  useEffect(() => {
    weaponAttackRatingCache.current.clear();
  }, [character.attributes, buffs, selectedWeaponLevel]);

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

  const weaponSearchOptions: SelectItem[] = weaponsData.weapons.map(
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

  const allWeaponAttackRatings = useMemo(() => {
    return filterWeapons(
      weaponsData.weapons.reduce((acc, weapon) => {
        const attackRating = getCachedWeaponAttackRating(weapon);

        if (!attackRating) return acc;

        return [...acc, attackRating];
      }, [] as WeaponAttackResult[]),
      weaponFilter
    );
  }, [
    weaponsData.weapons,
    weaponFilter,
    getCachedWeaponAttackRating,
    character,
  ]);

  console.log(
    "%cRendering",
    "color: red; font-weight: bold; font-size: 1.5rem"
  );

  return (
    <main className="flex flex-col gap-4 items-center w-full max-w-[1420px] px-5 lg:px-0 mx-auto py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <div className="flex flex-col justify-center w-full h-full gap-5 sm:flex-row sm:justify-between">
        <CharacterStats
          character={character}
          setCharacterAttribute={setCharacterAttribute}
          setIsTwoHanding={setIsTwoHanding}
          setBuffs={setBuffs}
          buffs={buffs}
        />

        {isExtraInfoOpen && weaponState.weaponInfo && (
          <ExtraInfo
            enemy={selectedEnemy ?? undefined}
            buffSelection={buffs}
            weaponAttackRating={
              isDamageOnEnemy && selectedEnemy
                ? calculateDamageAgainstEnemy(
                    getCachedWeaponAttackRating(weaponState.weaponInfo)!,
                    selectedEnemy
                  )
                : (getCachedWeaponAttackRating(
                    weaponState.weaponInfo
                  ) as WeaponAttackResult)
            }
            character={character}
            setWeaponInfo={(weapon: Weapon) => {
              setWeaponState((prev) => ({ ...prev, weaponInfo: weapon }));
            }}
            setIsOpen={setIsExtraInfoOpen}
            isOpen={isExtraInfoOpen}
            weaponAffinityOptions={weaponsData.weapons.filter(
              (weapon) =>
                weapon.weaponName === weaponState.weaponInfo?.weaponName
            )}
            isDamageOnEnemy={isDamageOnEnemy}
          />
        )}

        <WeaponsTableControl
          {...{
            findWeapon: weaponsData.findWeapon,
            weaponSearchOptions,
            setSelectedWeapons: updateSelectedWeapons,
            setSelectedChartWeapon: updateSelectedChartWeapon,
            setWeaponFilter,
            weaponFilter,
            updateWeaponInfo,
            selectedWeaponLevel,
            setSelectedWeaponLevel,
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

      {/* <pre className="w-full p-4 rounded-md bg-secondary">
        <code>
          {JSON.stringify(weaponsData.findWeapon("Rabbath's Cannon"), null, 2)}
        </code>
      </pre> */}

      <WeaponsTable
        updateWeaponInfo={updateWeaponInfo}
        selectedWeapons={weaponState.selectedWeapons}
        character={useDebouncedValue(character)}
        weaponAttackRatings={allWeaponAttackRatings}
        isLoading={weaponsData.isLoading && weaponsData.weapons.length === 0}
        setNewGame={setNewGame}
        setSelectedWeapons={updateSelectedWeapons}
        setSelectedChartWeapon={updateSelectedChartWeapon}
        isDamageOnEnemy={isDamageOnEnemy && !!selectedEnemy}
      />
    </main>
  );
}
