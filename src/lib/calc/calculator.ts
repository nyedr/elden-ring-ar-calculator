import {
  allDamageTypes,
  allStatusTypes,
  AttackPowerType,
  getDamageTypeKey,
} from "../data/attackPowerTypes";
import { allAttributes, Attribute, Attributes } from "../data/attributes";
import { Enemy, EnemyType } from "../data/enemy-data";
import {
  EnemyDamageMultiplier,
  isDamageValuesKey,
  MotionValues,
  Weapon,
  WeaponMove,
} from "../data/weapon";

import { WeaponType } from "../data/weaponTypes";

interface WeaponAttackOptions {
  weapon: Weapon;
  attributes: Attributes;
  twoHanding?: boolean;
  upgradeLevel: number;
  disableTwoHandingAttackPowerBonus?: boolean;
  ineffectiveAttributePenalty?: number;
}

export interface AttackPower {
  total: number;
  scaled: number;
  weapon: number;
}

export interface WeaponAttackResult {
  upgradeLevel: number;
  attackPower: Partial<Record<AttackPowerType, AttackPower>>;
  spellScaling: Partial<Record<AttackPowerType, number>>;
  ineffectiveAttributes: Attribute[];
  ineffectiveAttackPowerTypes: AttackPowerType[];
  weapon: Weapon;
  enemyDamages?: Partial<Record<AttackPowerType, number>>;
}

/**
 * Adjust a set of character attributes to take into account the 50% Strength bonus when two
 * handing a weapon
 */
export function adjustAttributesForTwoHanding({
  twoHanding = false,
  weapon,
  attributes,
}: {
  twoHanding?: boolean;
  weapon: Weapon;
  attributes: Attributes;
}): Attributes {
  let twoHandingBonus = twoHanding;

  // Paired weapons do not get the two handing bonus
  if (weapon.paired) {
    twoHandingBonus = false;
  }

  // Bows and ballistae can only be two handed
  if (
    weapon.weaponType === WeaponType.LIGHT_BOW ||
    weapon.weaponType === WeaponType.BOW ||
    weapon.weaponType === WeaponType.GREATBOW ||
    weapon.weaponType === WeaponType.BALLISTA
  ) {
    twoHandingBonus = true;
  }

  if (twoHandingBonus) {
    return {
      ...attributes,
      str: Math.floor(attributes.str * 1.5),
    };
  }

  return attributes;
}

/**
 * Determine the damage for a weapon with the given player stats
 */
export const getWeaponAttack = ({
  weapon,
  attributes,
  twoHanding,
  upgradeLevel,
  disableTwoHandingAttackPowerBonus,
  ineffectiveAttributePenalty = 0.4,
}: WeaponAttackOptions): WeaponAttackResult => {
  const adjustedAttributes = adjustAttributesForTwoHanding({
    twoHanding,
    weapon,
    attributes,
  });

  const ineffectiveAttributes = (
    Object.entries(weapon.requirements) as [Attribute, number][]
  )
    .filter(
      ([attribute, requirement]) => adjustedAttributes[attribute] < requirement
    )
    .map(([attribute]) => attribute);

  const ineffectiveAttackPowerTypes: AttackPowerType[] = [];

  const attackPower: Partial<Record<AttackPowerType, AttackPower>> = {};
  const spellScaling: Partial<Record<AttackPowerType, number>> = {};

  for (const attackPowerType of [...allDamageTypes, ...allStatusTypes]) {
    const isDamageType = allDamageTypes.includes(attackPowerType);

    // Todo: Ballista weapons have a different attack power calculation, so this is throwing an error
    // To replicate: Use a ballista weapon, ex: Rabbath's Cannon. Only throws error sometimes.

    const baseAttackPower = weapon.attack[upgradeLevel][attackPowerType] ?? 0;
    if (baseAttackPower || weapon.sorceryTool || weapon.incantationTool) {
      // This weapon's AttackElementCorrectParam determines what attributes each damage type scales
      // with
      const scalingAttributes =
        weapon.attackElementCorrect[attackPowerType] ?? {};

      let totalScaling = 1;

      if (
        ineffectiveAttributes.some((attribute) => scalingAttributes[attribute])
      ) {
        // If the requirements for this damage type are not met, a penalty is subtracted instead
        // of a scaling bonus being added
        totalScaling = 1 - ineffectiveAttributePenalty;
        ineffectiveAttackPowerTypes.push(attackPowerType);
      } else {
        // Otherwise, the scaling multiplier is equal to the sum of the corrected attribute values
        // multiplied by the scaling for that attribute
        const effectiveAttributes =
          !disableTwoHandingAttackPowerBonus && isDamageType
            ? adjustedAttributes
            : attributes;
        for (const attribute of allAttributes) {
          const attributeCorrect = scalingAttributes[attribute];
          if (attributeCorrect) {
            let scaling: number;
            if (attributeCorrect === true) {
              scaling = weapon.attributeScaling[upgradeLevel][attribute] ?? 0;
            } else {
              scaling =
                (attributeCorrect *
                  (weapon.attributeScaling[upgradeLevel][attribute] ?? 0)) /
                (weapon.attributeScaling[0][attribute] ?? 0);
            }

            if (scaling) {
              totalScaling +=
                weapon.calcCorrectGraphs[attackPowerType][
                  effectiveAttributes[attribute]
                ] * scaling;
            }
          }
        }
      }

      // The final scaling multiplier modifies the attack power for this damage type as a
      // percentage boost, e.g. 0.5 adds +50% of the base attack power
      if (baseAttackPower) {
        attackPower[attackPowerType] = {
          total: baseAttackPower * totalScaling,
          scaled: baseAttackPower * totalScaling - baseAttackPower,
          weapon: baseAttackPower,
        };
      }

      if (isDamageType && (weapon.sorceryTool || weapon.incantationTool)) {
        spellScaling[attackPowerType] = 100 * totalScaling;
      }
    }
  }

  return {
    upgradeLevel,
    attackPower,
    spellScaling,
    ineffectiveAttributes,
    ineffectiveAttackPowerTypes,
    weapon,
  };
};

export const adjustEnemyDamageForWeaponMultipliers = (
  enemyDamageMultipliers: EnemyDamageMultiplier,
  enemy: Enemy,
  enemyDamages: Partial<Record<AttackPowerType, number>>
): Partial<Record<AttackPowerType, number>> => {
  const enemyTypes = Object.keys(enemy.types).filter(
    (type) => enemy.types[type as EnemyType]
  ) as EnemyType[];
  let adjustedEnemyDamages: Partial<Record<AttackPowerType, number>> = {
    ...enemyDamages,
  };

  for (const enemyType of enemyTypes) {
    const enemyDamageMultiplier = enemyDamageMultipliers[enemyType];

    if (enemyDamageMultiplier === 1) continue;

    for (const [damageType, damage] of Object.entries(adjustedEnemyDamages)) {
      const adjustedDamage = damage * enemyDamageMultiplier;
      adjustedEnemyDamages[+damageType as AttackPowerType] = adjustedDamage;
    }
  }

  return adjustedEnemyDamages;
};

// Function to calculate defense multiplier]
const calculateDefenseMultiplier = (attackRatio: number): number => {
  if (attackRatio < 0.125) {
    return 0.1;
  } else if (attackRatio < 1) {
    return 0.1 + Math.pow(attackRatio - 0.125, 2) / 2.552;
  } else if (attackRatio < 2.5) {
    return 0.7 - Math.pow(2.5 - attackRatio, 2) / 7.5;
  } else if (attackRatio < 8) {
    return 0.9 - Math.pow(8 - attackRatio, 2) / 151.25;
  } else {
    return 0.9;
  }
};

function calculateDamage(
  totalDamage: number,
  damageNegation: number,
  defenseMultiplier: number,
  motionValue: number
): number {
  const baseDamage = (totalDamage * motionValue) / 100;
  const effectiveDamage =
    baseDamage * (1 - damageNegation / 100) * defenseMultiplier;
  return isNaN(effectiveDamage) ? 0 : effectiveDamage;
}

const getEnemyDamageNegation = (enemy: Enemy, damageType: string) => {
  const damageTypeKey = (
    damageType === "Standard" ? "Physical" : damageType
  ) as keyof typeof enemy.damageNegation;

  return enemy.damageNegation[damageTypeKey];
};

export const getMoveMotionValue = (
  move: string,
  motionValues: MotionValues
): string => {
  return isDamageValuesKey(move)
    ? motionValues[move as keyof MotionValues]
    : motionValues["1h R1 1"];
};

export const calculateDamageAgainstEnemy = (
  attackRating: WeaponAttackResult,
  enemy: Enemy,
  weaponMove: WeaponMove = "1h R1 1"
): WeaponAttackResult => {
  const damages = Object.entries(attackRating.attackPower);
  const enemyDamages: Record<AttackPowerType, number> = {} as Record<
    AttackPowerType,
    number
  >;

  const motionValue = getMoveMotionValue(
    weaponMove,
    attackRating.weapon.motionValues
  );
  const flatEnemyDefense = enemy.defence.Physical;

  damages.forEach(([damageTypeKey, totalDamage]) => {
    const damageType = parseInt(damageTypeKey) as AttackPowerType;

    const physicalDamageType =
      damageType === AttackPowerType.PHYSICAL
        ? attackRating.weapon.physicalAttackAttributes[weaponMove]
        : getDamageTypeKey(damageType);

    const motionValues = motionValue.includes("+")
      ? motionValue.split(" + ").map(Number)
      : [parseInt(motionValue || "100")];

    const physicalDamageTypes = physicalDamageType.includes("+")
      ? physicalDamageType.split(" + ")
      : [physicalDamageType || "Standard"];

    const finalDamage = motionValues.reduce((accumulatedDamage, mv, index) => {
      const currentDamageType =
        physicalDamageTypes[index] || physicalDamageTypes[0];

      const attackRatio = (totalDamage.total * mv) / (flatEnemyDefense * 100);
      const defenseMultiplier = calculateDefenseMultiplier(attackRatio);

      const enemyDamageNegation = getEnemyDamageNegation(
        enemy,
        currentDamageType
      );

      return (
        accumulatedDamage +
        calculateDamage(
          totalDamage.total,
          enemyDamageNegation,
          defenseMultiplier,
          mv
        )
      );
    }, 0);

    enemyDamages[damageType] = finalDamage;
  });

  const enemyHasType = Object.values(enemy.types).filter(Boolean).length > 0;
  const weaponHasEnemyMultiplier = Object.values(
    attackRating.weapon.enemyDamageMultipliers
  ).some((mulitplier) => mulitplier !== 1);

  if (enemyHasType && weaponHasEnemyMultiplier) {
    const adjustedEnemyDamages = adjustEnemyDamageForWeaponMultipliers(
      attackRating.weapon.enemyDamageMultipliers,
      enemy,
      enemyDamages
    );
    return { ...attackRating, enemyDamages: adjustedEnemyDamages };
  }

  return { ...attackRating, enemyDamages };
};
