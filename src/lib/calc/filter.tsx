import { Weapon } from "../data/weapon";
import { Character } from "@/hooks/useCharacter";
import { calculateWeaponDamage } from "./damage";
import {
  DamageAttribute,
  damageAttributeKeys,
  DamageType,
  damageTypes,
  StatusEffect,
  statusEffects,
} from "../data/weapon-data";

export interface WeaponFilter {
  selectedWeaponTypes: string[];
  selectedStatusEffects: string[];
  selectedWeaponAffinities: string[];
  sortBy: SortByOption;
  toggleSortBy?: boolean;
}

export const sortByOptions = [
  ...statusEffects.slice(),
  ...damageAttributeKeys.slice(),
  "AR",
  "Spell Scaling",
  "weight",
  "weaponName",
] as const;

export type SortByOption = (typeof sortByOptions)[number];

export const filterWeapons = (
  weapons: Weapon[],
  weaponFilter: WeaponFilter
) => {
  const {
    selectedWeaponTypes,
    selectedStatusEffects,
    selectedWeaponAffinities,
  } = weaponFilter;

  return weapons.filter((weapon) => {
    const weaponType = weapon.weaponType;
    const statusEffects = weapon.statusEffects.map((effect) => effect);

    const isWeaponTypeSelected = selectedWeaponTypes.includes(weaponType);
    const isStatusEffectsSelected =
      selectedStatusEffects.includes("None") ||
      selectedStatusEffects.some((effect) =>
        statusEffects.includes(effect as StatusEffect)
      );

    const isWeaponAffinitySelected = selectedWeaponAffinities.includes(
      weapon.affinity
    );

    return (
      isWeaponTypeSelected &&
      isStatusEffectsSelected &&
      isWeaponAffinitySelected
    );
  });
};

export const sortWeapons = (
  weapons: Weapon[],
  character: Character,
  sortBy: SortByOption,
  toggleSortBy: boolean = false
) => {
  return weapons.sort((a, b) => {
    const aAttackRating = calculateWeaponDamage(
      character,
      a,
      a.maxUpgradeLevel
    );
    const bAttackRating = calculateWeaponDamage(
      character,
      b,
      b.maxUpgradeLevel
    );

    const compareValues = (aValue: number, bValue: number) => {
      if (toggleSortBy) {
        return aValue - bValue;
      }
      return bValue - aValue;
    };

    if (sortBy === "weaponName") {
      if (toggleSortBy) {
        const primarySort = a.name.localeCompare(b.name);
        return primarySort !== 0
          ? primarySort
          : compareValues(aAttackRating.getAr, bAttackRating.getAr);
      }

      const primarySort = b.name.localeCompare(a.name);
      return primarySort !== 0
        ? primarySort
        : compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    if (sortBy === "AR") {
      return compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    if (sortBy === "Spell Scaling") {
      const primarySort = compareValues(
        aAttackRating.spellScaling,
        bAttackRating.spellScaling
      );
      return primarySort !== 0
        ? primarySort
        : compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    if (sortBy === "weight") {
      const primarySort = compareValues(a.weight, b.weight);
      return primarySort !== 0
        ? primarySort
        : compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    if (statusEffects.includes(sortBy as StatusEffect)) {
      const primarySort = compareValues(
        a.levels[a.maxUpgradeLevel][sortBy],
        b.levels[b.maxUpgradeLevel][sortBy]
      );
      return primarySort !== 0
        ? primarySort
        : compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    if (damageTypes.includes(sortBy as DamageType)) {
      const primarySort = compareValues(
        aAttackRating.damages[sortBy as DamageType].total,
        bAttackRating.damages[sortBy as DamageType].total
      );
      return primarySort !== 0
        ? primarySort
        : compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    if (damageAttributeKeys.includes(sortBy as keyof DamageAttribute)) {
      const aScaling =
        a.levels[a.maxUpgradeLevel][sortBy as keyof DamageAttribute];
      const bScaling =
        b.levels[b.maxUpgradeLevel][sortBy as keyof DamageAttribute];
      const primarySort = compareValues(aScaling, bScaling);
      return primarySort !== 0
        ? primarySort
        : compareValues(aAttackRating.getAr, bAttackRating.getAr);
    }

    return 0;
  });
};
