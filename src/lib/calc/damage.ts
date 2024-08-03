import { Character } from "@/hooks/useCharacter";
import { AttackRating } from "../data/attackRating";
import { Weapon } from "../data/weapon";
import {
  AttributeKey,
  DamageAttribute,
  damageAttributeKeys,
  DamageType,
  damageTypes,
  StatusEffect,
  statusEffects,
  ScaledPassive,
  scaledPassives,
} from "../data/weapon-data";
import { calcPassiveScalingPercentage, calcScalingPercentage } from "./scaling";

export function meetsWeaponRequirement(
  weapon: Weapon,
  attribute: keyof DamageAttribute,
  character: Character
) {
  return character.attributes[attribute] >= weapon.requirements[attribute];
}

export function calculateScaledStatusEffect(
  character: Character,
  weapon: Weapon,
  level: number,
  statusEffect: StatusEffect
) {
  let passiveValue = weapon.levels[level][statusEffect];
  let arcaneScaling = weapon.levels[level]["Arc"];
  let arcaneValue = character.attributes["Arc"];

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

const damageTypeScalesWithAttribute = (
  weapon: Weapon,
  damageType: DamageType,
  attribute: AttributeKey
) => {
  return weapon.scaling[damageType][attribute] === 1;
};
// weaponDamage is the damage of a certain type that the weapon puts out at that level
export function calculateScaledDamageForType(
  character: Character,
  weapon: Weapon,
  level: number,
  damageType: DamageType,
  weaponDamage: number
) {
  let scaledDamage = 0;
  if (weaponDamage > 0) {
    damageAttributeKeys.forEach((attribute) => {
      if (damageTypeScalesWithAttribute(weapon, damageType, attribute)) {
        if (meetsWeaponRequirement(weapon, attribute, character)) {
          let scalingValue = weapon.levels[level][attribute];
          let scalingCurve = weapon.scaling[damageType].curve;
          let scalingPercentage = calcScalingPercentage(
            scalingCurve,
            character.attributes[attribute]
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
  character: Character,
  weapon: Weapon,
  level: number
) {
  if (
    weapon.weaponType === "Glintstone Staff" ||
    weapon.weaponType === "Sacred Seal"
  ) {
    let magicScaling = calculateScaledDamageForType(
      character,
      weapon,
      level,
      "Magic",
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

  damageTypes.forEach((damageType) => {
    let weaponDamage = weapon.levels[level][damageType];
    let scaledDamage = calculateScaledDamageForType(
      character,
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
    let meetsRequirement = meetsWeaponRequirement(weapon, attribute, character);
    attackRating.requirementsMet[attribute] = meetsRequirement;
  });

  statusEffects.forEach((statusEffect) => {
    attackRating.statusEffects[statusEffect] = calculateScaledStatusEffect(
      character,
      weapon,
      level,
      statusEffect
    );
  });

  attackRating.spellScaling = calculateSpellScaling(character, weapon, level);

  return attackRating;
}
