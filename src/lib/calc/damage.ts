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
    attackRating.setAR(attackRating.getAR + sum);
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
  attackRating: AttackRating,
  enemy: Enemy,
  motionValue = 100
): AttackRating => {
  const damages: [string, number][] = Object.entries(attackRating.damages)
    .filter(([_, value]) => value.total !== 0)
    .map(([key, value]) => [key, value.total]);

  const [damageTypeOne, totalDamageOne] = damages[0];
  const physicalDamageTypes = [
    DamageType.Physical,
    DamageType.Pierce,
    DamageType.Slash,
    DamageType.Strike,
  ];
  const isDamageTypeOnePhysical = physicalDamageTypes.some((damageType) =>
    damageTypeOne.includes(damageType)
  );
  const isWeaponTypePhysical = physicalDamageTypes.includes(
    attackRating.weapon.physicalDamageType as DamageType
  );
  const isTypePhysical = isDamageTypeOnePhysical && isWeaponTypePhysical;
  const flatEnemyDefense =
    enemy.defence[
      (isTypePhysical
        ? attackRating.weapon.physicalDamageType
        : damageTypeOne) as DamageType
    ];
  const negationTypeOne =
    enemy.damageNegation[
      (isTypePhysical
        ? attackRating.weapon.physicalDamageType
        : damageTypeOne) as DamageType
    ];

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

  const defenseMultiplierType1 = defenseMultiplier(
    (totalDamageOne * motionValue) / (flatEnemyDefense * 100)
  );

  const finalDamageType1 =
    (1 - negationTypeOne / 100) *
    defenseMultiplierType1 *
    totalDamageOne *
    (motionValue / 100);

  if (damages.length === 1) {
    return {
      ...attackRating,
      enemyDamages: {
        [damageTypeOne]: finalDamageType1,
      },
      enemyAR: finalDamageType1,
    } as AttackRating;
  }

  const [damageTypeTwo, totalDamageTwo] = damages[1];

  const negationTypeTwo = enemy.damageNegation[damageTypeTwo as DamageType];

  const defenseMultiplierType2 = defenseMultiplier(
    (totalDamageTwo * motionValue) / (flatEnemyDefense * 100)
  );

  const finalDamageType2 =
    (1 - negationTypeTwo / 100) *
    defenseMultiplierType2 *
    totalDamageTwo *
    (motionValue / 100);

  return {
    ...attackRating,
    enemyDamages: {
      [damageTypeOne]: finalDamageType1,
      [damageTypeTwo]: finalDamageType2,
    },
    enemyAR: finalDamageType1 + finalDamageType2,
  } as AttackRating;
};
