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
}

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
