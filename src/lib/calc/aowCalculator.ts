import { AshOfWar } from "../data/ashOfWar";
import { allDamageTypes, AttackPowerType } from "../data/attackPowerTypes";
import { Attribute, Attributes } from "../data/attributes";
import { scalingMultiplierData } from "../data/scalingMultiplierData";
import { AffinityId } from "../data/weapon";
import { getTotalDamageAttackPower } from "../uiUtils";
import { WeaponAttackResult } from "./calculator";

export interface AshOfWarAttackResult {
  attack: Partial<Record<AttackPowerType, number>>;
  poiseDamage: number;
}

// TODO: Change from weaponAttackResult to to weapon and calculate the attack result inside the function to account
// for ashes of war that disallow the two handing bonus

/**
 * Calculates the damage for each attack power type based on the provided WeaponAttackResult and AshOfWar data.
 *
 * @param weaponAttackResult The result of a weapon attack containing attack power information.
 * @param ashOfWar The AshOfWar data used to calculate the damage motion values.
 * @returns An object mapping each AttackPowerType to its calculated damage value.
 */
export function calculateAshOfWarDamage(
  weaponAttackResult: WeaponAttackResult,
  ashOfWar: AshOfWar
): Partial<Record<AttackPowerType, number>> {
  return allDamageTypes.reduce((damageResult, attackPowerType) => {
    const attackPower =
      weaponAttackResult.attackPower[attackPowerType]?.total ?? 0;
    const motionValue = ashOfWar.damageMotionValues[attackPowerType] / 100;
    const damage = attackPower * motionValue;
    damageResult[attackPowerType] = damage;
    return damageResult;
  }, {} as Partial<Record<AttackPowerType, number>>);
}

/**
 * Calculates the enhanced hit damage for a weapon attack using an Ash of War.
 *
 * @param weaponAttackResult - The result of the weapon attack, including attack power and upgrade level.
 * @param ashOfWar - The Ash of War being used, containing base damage and motion values.
 * @param playerAttributes - The player's attributes, used to calculate stat multipliers.
 * @returns The calculated enhanced hit damage.
 */
export function calculateEnhancedHitDamage(
  weaponAttackResult: WeaponAttackResult,
  ashOfWar: AshOfWar,
  playerAttributes: Attributes
): Partial<Record<AttackPowerType, number>> {
  const { baseDamage: baseBuff, damageMotionValues } = ashOfWar; // Use baseBuff instead of baseDamage for the buff calculation

  // Get the total attack power from all damage types
  const attackRating = getTotalDamageAttackPower(
    weaponAttackResult.attackPower
  );
  const upgradeLevel = weaponAttackResult.upgradeLevel;
  const maxUpgradeLevel = weaponAttackResult.weapon.attack.length - 1;

  // Retrieve the scaling multiplier for the specific weapon and affinity
  const affinityScalingMultiplierData =
    scalingMultiplierData[upgradeLevel][weaponAttackResult.weapon.affinityId];

  // Identify the highest scaling attribute for the weapon at the current upgrade level
  const highestScalingAttribute = Object.entries(
    weaponAttackResult.weapon.attributeScaling[upgradeLevel]
  ).sort((a, b) => b[1] - a[1])[0][0] as Attribute;

  const affinityScalingMultiplier =
    affinityScalingMultiplierData[highestScalingAttribute];

  // Should the indexing be based on the highest scaling attribute?

  // Calculate the percentage upgrade level (current / max)
  const percentUpgraded = upgradeLevel / maxUpgradeLevel;

  return allDamageTypes.reduce((damageResult, attackPowerType) => {
    // TODO: Check if using the attackPowerType is correct
    const statMultiplier =
      weaponAttackResult.weapon.calcCorrectGraphs[attackPowerType][
        playerAttributes[highestScalingAttribute]
      ];

    // Calculate the stat bonus for the highest scaling attribute
    const statBonus = affinityScalingMultiplier * statMultiplier;

    // Calculate the buff strength: scales with upgrade level and stat bonuses
    const buffStrength = baseBuff * (1 + 3 * percentUpgraded) * (1 + statBonus);

    // Normalize the motion value for the physical attack (from 0 to 1)
    const motionValue = damageMotionValues[attackPowerType] / 100;

    // Final damage calculation: weapon's attack rating combined with the normalized motion value
    // Add the buff strength directly as it has a separate motion value of 100 (normalized to 1)
    const damage = attackRating * motionValue + buffStrength;

    return {
      ...damageResult,
      [attackPowerType]: damage,
    };
  }, {} as Partial<Record<AttackPowerType, number>>);
}

/**
 * Calculates the bullet hit damage for a given weapon attack result and Ash of War.
 *
 * @param weaponAttackResult - The result of the weapon attack, including upgrade level and weapon details.
 * @param ashOfWar - The Ash of War being used, which provides base bullet damage and damage motion values.
 * @returns A partial record of attack power types and their corresponding calculated bullet damage.
 */
export function calculateBulletHitDamage(
  weaponAttackResult: WeaponAttackResult,
  ashOfWar: AshOfWar,
  playerAttributes: Attributes
): Partial<Record<AttackPowerType, number>> {
  const upgradeLevel = weaponAttackResult.upgradeLevel;
  const maxUpgradeLevel = weaponAttackResult.weapon.attack.length - 1;

  const affinityScalingMultiplierData =
    scalingMultiplierData[upgradeLevel][weaponAttackResult.weapon.affinityId];

  // Identify the highest scaling attribute for the weapon at the current upgrade level
  const highestScalingAttribute = Object.entries(
    weaponAttackResult.weapon.attributeScaling[upgradeLevel]
  ).sort((a, b) => b[1] - a[1])[0][0] as Attribute;

  const affinityScalingMultiplier =
    affinityScalingMultiplierData[highestScalingAttribute];

  const { affinityId } = weaponAttackResult.weapon;

  return allDamageTypes.reduce((damageResult, attackPowerType) => {
    const statMultiplier =
      weaponAttackResult.weapon.calcCorrectGraphs[attackPowerType][
        playerAttributes[highestScalingAttribute]
      ];

    const baseDamage = ashOfWar.baseBulletDamage[attackPowerType];

    // TODO: Handle Unique weapon affinity
    /**
     *  Scaling at no upgrade for a particular stat. Depends on Bullet Art affinity:
     *  For Bullet Arts that only depend on a single stat = 0.25
     *  For Cold or Quality Bullet Arts, which depend on two stats = 0.15
     *  For Unique weapon arts = same as the scaling on the weapon
     */
    const baseScaling =
      affinityId === AffinityId.COLD || affinityId === AffinityId.QUALITY
        ? 0.15
        : 0.25;

    // Normalize the base bullet damage by dividing the motion value by 100
    const bulletMotionValue =
      ashOfWar.damageMotionValues[AttackPowerType.PHYSICAL] / 100;

    // Calculate the stat bonus based on base scaling, affinity scaling, and the player's stat investment
    const statBonus = baseScaling * affinityScalingMultiplier * statMultiplier;

    const percentUpgraded = upgradeLevel / maxUpgradeLevel;

    // Calculate the bullet damage, scaling with the weapon's upgrade level and stat bonuses
    const bulletDamage =
      baseDamage *
      (1 + 3 * percentUpgraded) *
      (1 + statBonus) *
      bulletMotionValue;

    return {
      ...damageResult,
      [attackPowerType]: bulletDamage,
    };
  }, {} as Partial<Record<AttackPowerType, number>>);
}
