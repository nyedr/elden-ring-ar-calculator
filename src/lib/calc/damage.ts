import { Attributes, Character } from "@/hooks/useCharacter";
import { AttackRating } from "../data/attackRating";
import { Weapon } from "../data/weapon";
import {
  AttributeKey,
  DamageAttribute,
  damageAttributeKeys,
  DamageType,
  allSimplifiedDamageTypes,
  StatusEffect,
  allStatusEffects,
  ScaledPassive,
  scaledPassives,
} from "../data/weapon-data";
import { calcPassiveScalingPercentage, calcScalingPercentage } from "./scaling";
import { Enemy } from "../data/enemy-data";

export function meetsWeaponRequirement(
  weapon: Weapon,
  attribute: keyof DamageAttribute,
  attributes: Attributes
) {
  return attributes[attribute] >= weapon.requirements[attribute];
}

export function adjustAttributesForTwoHanding({
  twoHandingBonus = false,
  attributes,
}: {
  twoHandingBonus: boolean;
  attributes: Attributes;
}): Attributes {
  if (twoHandingBonus) {
    return {
      ...attributes,
      Str: Math.floor(attributes.Str * 1.5),
    };
  }

  return attributes;
}

export function calculateScaledStatusEffect(
  attributes: Attributes,
  weapon: Weapon,
  level: number,
  statusEffect: StatusEffect
) {
  let passiveValue = weapon.levels[level][statusEffect];
  let arcaneScaling = weapon.levels[level]["Arc"];
  let arcaneValue = attributes["Arc"];

  if (
    scaledPassives.includes(statusEffect as ScaledPassive) &&
    arcaneScaling > 0
  ) {
    let passiveScalingPercentage = calcPassiveScalingPercentage(arcaneValue);
    return (
      passiveScalingPercentage * passiveValue * arcaneScaling + passiveValue
    );
  } else {
    return passiveValue;
  }
}

export const damageTypeScalesWithAttribute = (
  weapon: Weapon,
  damageType: DamageType,
  attribute: AttributeKey
) => {
  return weapon.scaling[damageType][attribute] === 1;
};

export const isDamageTypeAffectedByUnmetRequirements = (
  attackRating: AttackRating,
  damageType: DamageType
) => {
  // TODO: Fix red on two handing
  // Create an array of all the attributes that are not met
  const unmetRequirements: AttributeKey[] = Object.entries(
    attackRating.requirementsMet
  )
    .filter(([, v]) => !v)
    .map(([k]) => k as AttributeKey);

  // Check if the damage type scales with any of the unmet requirements
  for (const unmetRequirement of unmetRequirements) {
    if (
      damageTypeScalesWithAttribute(
        attackRating.weapon,
        damageType,
        unmetRequirement
      )
    ) {
      return true;
    }
  }

  return false;
};

// weaponDamage is the damage of a certain type that the weapon puts out at that level
export function calculateScaledDamageForType(
  attributes: Attributes,
  weapon: Weapon,
  level: number,
  damageType: DamageType,
  weaponDamage: number
) {
  let scaledDamage = 0;
  if (weaponDamage > 0) {
    damageAttributeKeys.forEach((attribute) => {
      if (damageTypeScalesWithAttribute(weapon, damageType, attribute)) {
        if (meetsWeaponRequirement(weapon, attribute, attributes)) {
          let scalingValue = weapon.levels[level][attribute];
          let scalingCurve = weapon.scaling[damageType].curve;
          let scalingPercentage = calcScalingPercentage(
            scalingCurve,
            attributes[attribute]
          );

          scaledDamage += scalingPercentage * scalingValue * weaponDamage;
        } else {
          scaledDamage = weaponDamage * -0.4;
        }
      }
    });
  }
  return scaledDamage;
}

export function calculateSpellScaling(
  attributes: Attributes,
  weapon: Weapon,
  level: number
) {
  if (
    weapon.weaponType === "Glintstone Staff" ||
    weapon.weaponType === "Sacred Seal"
  ) {
    let magicScaling = calculateScaledDamageForType(
      attributes,
      weapon,
      level,
      DamageType.Magic,
      1
    );
    return 100 + magicScaling * 100;
  } else {
    return 0;
  }
}

export function calculateWeaponDamage(
  character: Character,
  weapon: Weapon,
  level: number
) {
  let attackRating = new AttackRating(weapon, level);

  const adjustedCharacterAttributes = adjustAttributesForTwoHanding({
    twoHandingBonus: weapon.twoHandBonus && character.isTwoHanding,
    attributes: character.attributes,
  });

  allSimplifiedDamageTypes.forEach((damageType) => {
    let weaponDamage = weapon.levels[level][damageType];
    let scaledDamage = calculateScaledDamageForType(
      adjustedCharacterAttributes,
      weapon,
      level,
      damageType,
      weaponDamage
    );
    let sum = weaponDamage + scaledDamage;

    attackRating.damages[damageType].weapon = weaponDamage;
    attackRating.damages[damageType].scaled = scaledDamage;
    attackRating.damages[damageType].total = sum;
    attackRating.setAR(attackRating.getAr + sum);
  });

  damageAttributeKeys.slice().forEach((attribute) => {
    let meetsRequirement = meetsWeaponRequirement(
      weapon,
      attribute,
      adjustedCharacterAttributes
    );
    attackRating.requirementsMet[attribute] = meetsRequirement;
  });

  allStatusEffects.forEach((statusEffect) => {
    attackRating.statusEffects[statusEffect] = calculateScaledStatusEffect(
      adjustedCharacterAttributes,
      weapon,
      level,
      statusEffect
    );
  });

  attackRating.spellScaling = calculateSpellScaling(
    adjustedCharacterAttributes,
    weapon,
    level
  );

  return attackRating;
}

export const calculateEnemyDamage = (
  totalDamageType1: number,
  totalDamageType2: number,
  negationType1: number,
  negationType2: number,
  flatDefense: number,
  motionValue = 100
) => {
  // Function to calculate defense multiplier]
  function defenseMultiplier(attackRatio: number) {
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
  }

  // Calculate defense multipliers
  const defenseMultiplierType1 = defenseMultiplier(
    (totalDamageType1 * motionValue) / (flatDefense * 100)
  );
  const defenseMultiplierType2 = defenseMultiplier(
    (totalDamageType2 * motionValue) / (flatDefense * 100)
  );

  // Calculate final damages
  const finalDamageType1 =
    (1 - negationType1 / 100) *
    defenseMultiplierType1 *
    totalDamageType1 *
    (motionValue / 100);
  const finalDamageType2 =
    (1 - negationType2 / 100) *
    defenseMultiplierType2 *
    totalDamageType2 *
    (motionValue / 100);

  // Overall final damage
  const overallFinalDamage = finalDamageType1 + finalDamageType2;

  return overallFinalDamage;
};

export const calculateEnemyDamage1 = (
  attackRating: AttackRating,
  enemy: Enemy,
  motionValue = 100
) => {
  const [[damageTypeOne, totalDamageOne], [damageTypeTwo, totalDamageTwo]]: [
    string,
    number
  ][] = Object.entries(attackRating.damages)
    .filter(([_, value]) => value.total !== 0)
    .map(([key, value]) => [key, value.total]);

  const flatEnemyDefense = enemy.defence[damageTypeOne as DamageType];

  const negationTypeOne = enemy.damageNegation[damageTypeOne as DamageType];
  const negationTypeTwo = enemy.damageNegation[damageTypeTwo as DamageType];

  // Function to calculate defense multiplier]
  function defenseMultiplier(attackRatio: number) {
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
  }

  // Calculate defense multipliers
  const defenseMultiplierType1 = defenseMultiplier(
    (totalDamageOne * motionValue) / (flatEnemyDefense * 100)
  );
  const defenseMultiplierType2 = defenseMultiplier(
    (totalDamageTwo * motionValue) / (flatEnemyDefense * 100)
  );

  // Calculate final damages
  const finalDamageType1 =
    (1 - negationTypeOne / 100) *
    defenseMultiplierType1 *
    totalDamageOne *
    (motionValue / 100);
  const finalDamageType2 =
    (1 - negationTypeTwo / 100) *
    defenseMultiplierType2 *
    totalDamageTwo *
    (motionValue / 100);

  // Overall final damage
  const overallFinalDamage = finalDamageType1 + finalDamageType2;

  return overallFinalDamage;
};
