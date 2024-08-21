import { Weapon } from "../data/weapon";
import { calculateEnemyDamage, calculateWeaponDamage } from "./damage";
import {
  DamageAttribute,
  damageAttributeKeys,
  DamageType,
  allSimplifiedDamageTypes,
  StatusEffect,
  allStatusEffects,
} from "../data/weapon-data";
import { Character } from "@/hooks/useCharacter";
import { Enemy } from "../data/enemy-data";

export interface WeaponFilter {
  selectedWeaponTypes: string[];
  selectedStatusEffects: string[];
  selectedWeaponAffinities: string[];
  sortBy: SortByOption;
  toggleSortBy?: boolean;
}

export const sortByOptions = [
  ...allStatusEffects.slice(),
  ...damageAttributeKeys.slice(),
  "AR",
  "Spell Scaling",
  "weight",
  "weaponName",
] as const;

export type SortByOption = (typeof sortByOptions)[number];

const isWeaponTypeSelected = (weapon: Weapon, selectedWeaponTypes: string[]) =>
  selectedWeaponTypes.includes(weapon.weaponType);

const isStatusEffectsSelected = (
  weapon: Weapon,
  selectedStatusEffects: string[]
) =>
  selectedStatusEffects.some((effect) =>
    weapon.statusEffects.includes(effect as StatusEffect)
  ) ||
  (weapon.statusEffects.length === 0 && selectedStatusEffects.includes("None"));

const isWeaponAffinitySelected = (
  weapon: Weapon,
  selectedWeaponAffinities: string[]
) =>
  (weapon.affinity === "-" && selectedWeaponAffinities.includes("Unique")) ||
  selectedWeaponAffinities.includes(weapon.affinity);

export const filterWeapons = (
  weapons: Weapon[],
  weaponFilter: WeaponFilter
) => {
  const {
    selectedWeaponTypes,
    selectedStatusEffects,
    selectedWeaponAffinities,
  } = weaponFilter;

  return weapons.filter(
    (weapon) =>
      isWeaponTypeSelected(weapon, selectedWeaponTypes) &&
      isStatusEffectsSelected(weapon, selectedStatusEffects) &&
      isWeaponAffinitySelected(weapon, selectedWeaponAffinities)
  );
};

const compareValues = (aValue: number, bValue: number, toggleSortBy: boolean) =>
  toggleSortBy ? aValue - bValue : bValue - aValue;

const getAttackRating = (
  weapon: Weapon,
  character: Character,
  enemyInfo?: { isDamageOnEnemy: boolean; selectedEnemy: Enemy | null }
) => {
  const attackRating = calculateWeaponDamage(
    character,
    weapon,
    weapon.maxUpgradeLevel
  );
  if (enemyInfo?.isDamageOnEnemy && enemyInfo.selectedEnemy) {
    return (
      calculateEnemyDamage(attackRating, enemyInfo.selectedEnemy)
        .enemyTotalAr ?? 0
    );
  }
  return attackRating.getAr;
};

export const sortWeapons = (
  weapons: Weapon[],
  character: Character,
  sortBy: SortByOption,
  toggleSortBy: boolean = false,
  enemyInfo?: { isDamageOnEnemy: boolean; selectedEnemy: Enemy | null }
) => {
  return weapons.sort((a, b) => {
    const aAttackRating = getAttackRating(a, character, enemyInfo);
    const bAttackRating = getAttackRating(b, character, enemyInfo);

    const arSort = compareValues(aAttackRating, bAttackRating, toggleSortBy);

    if (sortBy === "weaponName") {
      const primarySort = toggleSortBy
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
      return primarySort !== 0 ? primarySort : arSort;
    }

    if (sortBy === "AR") return arSort;

    if (sortBy === "Spell Scaling") {
      const primarySort = compareValues(
        calculateWeaponDamage(character, a, a.maxUpgradeLevel).spellScaling,
        calculateWeaponDamage(character, b, b.maxUpgradeLevel).spellScaling,
        toggleSortBy
      );
      return primarySort !== 0 ? primarySort : arSort;
    }

    if (sortBy === "weight") {
      const primarySort = compareValues(a.weight, b.weight, toggleSortBy);
      return primarySort !== 0 ? primarySort : arSort;
    }

    if (allStatusEffects.includes(sortBy as StatusEffect)) {
      const primarySort = compareValues(
        a.levels[a.maxUpgradeLevel][sortBy],
        b.levels[b.maxUpgradeLevel][sortBy],
        toggleSortBy
      );
      return primarySort !== 0 ? primarySort : arSort;
    }

    if (allSimplifiedDamageTypes.includes(sortBy as DamageType)) {
      const primarySort = compareValues(
        calculateWeaponDamage(character, a, a.maxUpgradeLevel).damages[
          sortBy as DamageType
        ].total,
        calculateWeaponDamage(character, b, b.maxUpgradeLevel).damages[
          sortBy as DamageType
        ].total,
        toggleSortBy
      );
      return primarySort !== 0 ? primarySort : arSort;
    }

    if (damageAttributeKeys.includes(sortBy as keyof DamageAttribute)) {
      const primarySort = compareValues(
        a.levels[a.maxUpgradeLevel][sortBy as keyof DamageAttribute],
        b.levels[b.maxUpgradeLevel][sortBy as keyof DamageAttribute],
        toggleSortBy
      );
      return primarySort !== 0 ? primarySort : arSort;
    }

    return 0;
  });
};
