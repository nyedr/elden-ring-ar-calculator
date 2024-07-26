import { SortByOption, WeaponFilter } from "@/app/page";
import { Weapon } from "../data/weapon";
import { Character } from "@/hooks/useCharacter";
import { calculateWeaponDamage } from "./damage";
import {
  DamageType,
  damageTypes,
  PassiveType,
  passiveTypes,
} from "../data/weapon-data";

export const fitlerWeapons = (
  weapons: Weapon[],
  weaponFilter: WeaponFilter
) => {
  const filteredWeapons = weapons.filter((weapon) => {
    const weaponType = weapon.weaponType;
    const damageTypes = weapon.levels[weapon.maxUpgradeLevel];
    const passiveEffects = weapon.passiveEffects.map((effect) => effect);

    const isWeaponTypeSelected =
      weaponFilter.selectedWeaponTypes.includes(weaponType);
    const isDamageTypeSelected = weaponFilter.selectedDamageTypes.some(
      (damageType) => damageTypes[damageType as DamageType] > 0
    );
    const isPassiveEffectSelected =
      weaponFilter.selectedPassiveEffects.includes("None") ||
      weaponFilter.selectedPassiveEffects.some((effect) =>
        passiveEffects.includes(effect as PassiveType)
      );

    return (
      isWeaponTypeSelected && isDamageTypeSelected && isPassiveEffectSelected
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

    if (sortBy === "Spell scaling") {
      const primarySort =
        bAttackRating.spellScaling - aAttackRating.spellScaling;
      if (primarySort !== 0) return primarySort;
      return bAttackRating.getAr - aAttackRating.getAr;
    }

    if (passiveTypes.includes(sortBy as PassiveType)) {
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
