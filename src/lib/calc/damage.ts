import { Character } from "@/hooks/useCharacter";
import { AttackRating } from "../data/attackRating";
import { Weapon } from "../data/weapon";
import {
  DamageAttribute,
  damageAttributeKeys,
  DamageType,
  damageTypes,
  PassiveType,
  passiveTypes,
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

export function calculateScaledPassiveEffect(
  character: Character,
  weapon: Weapon,
  level: number,
  passiveType: PassiveType
) {
  let passiveValue = weapon.levels[level][passiveType];
  let arcaneScaling = weapon.levels[level]["Arc"];
  let arcaneValue = character.attributes["Arc"];

  if (
    scaledPassives.includes(passiveType as ScaledPassive) &&
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
      if (weapon.damageTypeScalesWithAttribute(damageType, attribute)) {
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

  passiveTypes.forEach((passiveType) => {
    attackRating.passiveTypes[passiveType] = calculateScaledPassiveEffect(
      character,
      weapon,
      level,
      passiveType
    );
  });

  attackRating.spellScaling = calculateSpellScaling(character, weapon, level);

  return attackRating;
}
