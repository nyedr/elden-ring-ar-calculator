import { SortByOption, WeaponFilter } from "@/app/page";
import { Weapon } from "../data/weapon";
import { Character } from "@/hooks/useCharacter";
import { calculateWeaponDamage } from "./damage";
import {
  DamageType,
  damageTypes,
  StatusEffect,
  statusEffects,
} from "../data/weapon-data";

export const fitlerWeapons = (
  weapons: Weapon[],
  weaponFilter: WeaponFilter
) => {
  const filteredWeapons = weapons.filter((weapon) => {
    const weaponType = weapon.weaponType;
    const damageTypes = weapon.levels[weapon.maxUpgradeLevel];
    const statusEffects = weapon.statusEffects.map((effect) => effect);

    const isWeaponTypeSelected =
      weaponFilter.selectedWeaponTypes.includes(weaponType);
    const isDamageTypeSelected = weaponFilter.selectedDamageTypes.some(
      (damageType) => damageTypes[damageType as DamageType] > 0
    );
    const isStatusEffectsSelected =
      weaponFilter.selectedStatusEffects.includes("None") ||
      weaponFilter.selectedStatusEffects.some((effect) =>
        statusEffects.includes(effect as StatusEffect)
      );

    return (
      isWeaponTypeSelected && isDamageTypeSelected && isStatusEffectsSelected
    );
  });

  return filteredWeapons;
};

export const sortWeapons = (
  weapons: Weapon[],
  character: Character,
  sortBy: SortByOption
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

    if (sortBy === "AR") {
      return bAttackRating.getAr - aAttackRating.getAr;
    }

    if (sortBy === "Spell Scaling") {
      const primarySort =
        bAttackRating.spellScaling - aAttackRating.spellScaling;
      if (primarySort !== 0) return primarySort;
      return bAttackRating.getAr - aAttackRating.getAr;
    }

    if (statusEffects.includes(sortBy as StatusEffect)) {
      const primarySort =
        b.levels[b.maxUpgradeLevel][sortBy] -
        a.levels[a.maxUpgradeLevel][sortBy];
      if (primarySort !== 0) return primarySort;
      return bAttackRating.getAr - aAttackRating.getAr;
    }

    if (damageTypes.includes(sortBy as DamageType)) {
      const primarySort =
        bAttackRating.damages[sortBy as DamageType].total -
        aAttackRating.damages[sortBy as DamageType].total;
      if (primarySort !== 0) return primarySort;
      return bAttackRating.getAr - aAttackRating.getAr;
    }

    return 0;
  });
};
