import { WeaponAttackResult } from "../calc/calculator";
import {
  allStatusTypes,
  AttackPowerType,
  isStatusType,
} from "../data/attackPowerTypes";
import { Weapon } from "../data/weapon";
import { WeaponType } from "../data/weaponTypes";
import { AffinityOption, affinityOptions, allWeaponTypes } from "../uiUtils";
import { mapToObject } from "../utils";

export interface WeaponFilter {
  selectedWeaponTypes: Set<WeaponType>;
  selectedStatusEffects: Set<AttackPowerType | "None">;
  selectedWeaponAffinities: Map<number, AffinityOption>;
}

const defaultWeaponTypesSelected = new Set(allWeaponTypes);
const defaultStatusEffectsSelected = new Set<AttackPowerType | "None">([
  ...allStatusTypes.slice(0, allStatusTypes.length - 1),
  "None",
]);
const defaultWeaponAffinitiesSelected = new Map<number, AffinityOption>(
  Object.entries(mapToObject(affinityOptions)).map(([id, option]) => [
    +id,
    option,
  ])
);

export const defaultWeaponFilter: WeaponFilter = {
  selectedWeaponTypes: defaultWeaponTypesSelected,
  selectedStatusEffects: defaultStatusEffectsSelected,
  selectedWeaponAffinities: defaultWeaponAffinitiesSelected,
};

const isWeaponTypeSelected = (
  weapon: Weapon,
  selectedWeaponTypes: Set<WeaponType>
) => selectedWeaponTypes.has(weapon.weaponType);

const isStatusEffectsSelected = (
  attackRating: WeaponAttackResult,
  selectedStatusEffects: Set<AttackPowerType | "None">
): boolean => {
  const statusEffectKeys = Object.keys(attackRating.attackPower)
    .filter((key) => isStatusType(+key))
    .map((key) => String(key)) as unknown as AttackPowerType[];

  const hasStatusEffect = statusEffectKeys.length > 0;

  // Case 1: "None" is the only selected effect
  if (selectedStatusEffects.has("None") && selectedStatusEffects.size === 1) {
    return !hasStatusEffect;
  }

  const hasSelectedStatusEffect = statusEffectKeys.some((key) =>
    selectedStatusEffects.has(+key)
  );

  // Case 2: "None" and other effects are selected
  if (selectedStatusEffects.has("None") && selectedStatusEffects.size > 1) {
    return !hasStatusEffect || hasSelectedStatusEffect;
  }

  // console.log(
  //   "statusEffectKeys",
  //   statusEffectKeys,
  //   hasSelectedStatusEffect,
  //   selectedStatusEffects
  // );

  // Case 3: No "None" is selected, only specific effects
  return hasSelectedStatusEffect;
};

const isWeaponAffinitySelected = (
  weapon: Weapon,
  selectedWeaponAffinities: Map<number, AffinityOption>
) => selectedWeaponAffinities.has(weapon.affinityId);

export const filterWeapons = (
  attackRatings: WeaponAttackResult[],
  weaponFilter: WeaponFilter
) => {
  const {
    selectedWeaponTypes,
    selectedStatusEffects,
    selectedWeaponAffinities,
  } = weaponFilter;

  console.log("weaponFilter", weaponFilter);

  return attackRatings.filter(
    (attackRating) =>
      isWeaponTypeSelected(attackRating.weapon, selectedWeaponTypes) &&
      isStatusEffectsSelected(attackRating, selectedStatusEffects) &&
      isWeaponAffinitySelected(attackRating.weapon, selectedWeaponAffinities)
  );
};
