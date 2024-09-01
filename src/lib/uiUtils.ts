import specialWeaponIcon from "@/public/specialWeapon.webp";
import standardAffinityIcon from "@/public/standardAffinity.webp";
import heavyAffinityIcon from "@/public/heavyAffinity.webp";
import keenAffinityIcon from "@/public/keenAffinity.webp";
import qualityAffinityIcon from "@/public/qualityAffinity.webp";
import magicAffinityIcon from "@/public/magicAffinity.webp";
import coldAffinityIcon from "@/public/coldAffinity.webp";
import fireAffinityIcon from "@/public/fireAffinity.webp";
import lightningAffinityIcon from "@/public/lightningAffinity.webp";
import sacredAffinityIcon from "@/public/sacredAffinity.webp";
import poisonAffinityIcon from "@/public/poisonAffinity.webp";
import bloodAffinityIcon from "@/public/bloodAffinity.webp";
import occultAffinityIcon from "@/public/occultAffinity.webp";
import scarletRotStatusIcon from "@/public/scarletRotStatus.webp";
import madnessStatusIcon from "@/public/madnessStatus.webp";
import sleepStatusIcon from "@/public/sleepStatus.webp";
import frostStatusIcon from "@/public/frostStatus.webp";
import poisonStatusIcon from "@/public/poisonStatus.webp";
import bleedStatusIcon from "@/public/bleedStatus.webp";
import deathBlightStatusIcon from "@/public/deathBlightStatus.webp";
import { WeaponType } from "./data/weaponTypes";
import { allDamageTypes, AttackPowerType } from "./data/attackPowerTypes";
import { StaticImageData } from "next/image";
import { AttackPower } from "./calc/calculator";
import { Weapon } from "./data/weapon";
import { Attribute } from "./data/attributes";

export interface AffinityOption {
  text: string;
  icon: StaticImageData;
}

export const affinityOptions = new Map<number, AffinityOption>([
  [0, { text: "Standard", icon: standardAffinityIcon }],
  [1, { text: "Heavy", icon: heavyAffinityIcon }],
  [2, { text: "Keen", icon: keenAffinityIcon }],
  [3, { text: "Quality", icon: qualityAffinityIcon }],
  [8, { text: "Magic", icon: magicAffinityIcon }],
  [4, { text: "Fire", icon: fireAffinityIcon }],
  [5, { text: "Flame Art", icon: fireAffinityIcon }],
  [6, { text: "Lightning", icon: lightningAffinityIcon }],
  [7, { text: "Sacred", icon: sacredAffinityIcon }],
  [9, { text: "Cold", icon: coldAffinityIcon }],
  [10, { text: "Poison", icon: poisonAffinityIcon }],
  [11, { text: "Blood", icon: bloodAffinityIcon }],
  [12, { text: "Occult", icon: occultAffinityIcon }],
  [-1, { text: "Unique", icon: specialWeaponIcon }], // Special fake affinity ID for uninfusable weapons
]);

export const rangedWeaponTypes = [
  WeaponType.LIGHT_BOW,
  WeaponType.BOW,
  WeaponType.GREATBOW,
  WeaponType.CROSSBOW,
  WeaponType.BALLISTA,
];

export const shieldTypes = [
  WeaponType.SMALL_SHIELD,
  WeaponType.MEDIUM_SHIELD,
  WeaponType.GREATSHIELD,
  WeaponType.THRUSTING_SHIELD,
];

export const meleeWeaponTypes = [
  WeaponType.AXE,
  WeaponType.BACKHAND_BLADE,
  WeaponType.BEAST_CLAW,
  WeaponType.CLAW,
  WeaponType.COLOSSAL_SWORD,
  WeaponType.COLOSSAL_WEAPON,
  WeaponType.CURVED_GREATSWORD,
  WeaponType.CURVED_SWORD,
  WeaponType.DAGGER,
  WeaponType.FIST,
  WeaponType.FLAIL,
  WeaponType.GREAT_HAMMER,
  WeaponType.GREAT_KATANA,
  WeaponType.GREAT_SPEAR,
  WeaponType.GREATAXE,
  WeaponType.GREATSWORD,
  WeaponType.HALBERD,
  WeaponType.HAMMER,
  WeaponType.HAND_TO_HAND,
  WeaponType.HEAVY_THRUSTING_SWORD,
  WeaponType.KATANA,
  WeaponType.LIGHT_GREATSWORD,
  WeaponType.PERFUME_BOTTLE,
  WeaponType.REAPER,
  WeaponType.SPEAR,
  WeaponType.STRAIGHT_SWORD,
  WeaponType.THROWING_BLADE,
  WeaponType.THRUSTING_SWORD,
  WeaponType.TORCH,
  WeaponType.TWINBLADE,
  WeaponType.WHIP,
];

export const dlcWeaponTypes = [
  WeaponType.HAND_TO_HAND,
  WeaponType.PERFUME_BOTTLE,
  WeaponType.THRUSTING_SHIELD,
  WeaponType.THROWING_BLADE,
  WeaponType.BACKHAND_BLADE,
  WeaponType.LIGHT_GREATSWORD,
  WeaponType.GREAT_KATANA,
  WeaponType.BEAST_CLAW,
];

export const catalystTypes = [
  WeaponType.GLINTSTONE_STAFF,
  WeaponType.SACRED_SEAL,
  WeaponType.DUAL_CATALYST,
];

export const allWeaponTypes = [
  ...meleeWeaponTypes,
  ...rangedWeaponTypes,
  ...shieldTypes,
  ...dlcWeaponTypes,
  ...catalystTypes,
];

export const weaponTypeLabels = new Map([
  [WeaponType.DAGGER, "Dagger"],
  [WeaponType.STRAIGHT_SWORD, "Straight Sword"],
  [WeaponType.GREATSWORD, "Greatsword"],
  [WeaponType.COLOSSAL_SWORD, "Colossal Sword"],
  [WeaponType.CURVED_SWORD, "Curved Sword"],
  [WeaponType.CURVED_GREATSWORD, "Curved Greatsword"],
  [WeaponType.KATANA, "Katana"],
  [WeaponType.TWINBLADE, "Twinblade"],
  [WeaponType.THRUSTING_SWORD, "Thrusting Sword"],
  [WeaponType.HEAVY_THRUSTING_SWORD, "Heavy Thrusting Sword"],
  [WeaponType.AXE, "Axe"],
  [WeaponType.GREATAXE, "Greataxe"],
  [WeaponType.HAMMER, "Hammer"],
  [WeaponType.GREAT_HAMMER, "Great Hammer"],
  [WeaponType.FLAIL, "Flail"],
  [WeaponType.SPEAR, "Spear"],
  [WeaponType.GREAT_SPEAR, "Great Spear"],
  [WeaponType.HALBERD, "Halberd"],
  [WeaponType.REAPER, "Reaper"],
  [WeaponType.FIST, "Fist"],
  [WeaponType.CLAW, "Claw"],
  [WeaponType.WHIP, "Whip"],
  [WeaponType.COLOSSAL_WEAPON, "Colossal Weapon"],
  [WeaponType.LIGHT_BOW, "Light Bow"],
  [WeaponType.BOW, "Bow"],
  [WeaponType.GREATBOW, "Greatbow"],
  [WeaponType.CROSSBOW, "Crossbow"],
  [WeaponType.BALLISTA, "Ballista"],
  [WeaponType.GLINTSTONE_STAFF, "Glintstone Staff"],
  [WeaponType.DUAL_CATALYST, "Dual Catalyst"],
  [WeaponType.SACRED_SEAL, "Sacred Seal"],
  [WeaponType.SMALL_SHIELD, "Small Shield"],
  [WeaponType.MEDIUM_SHIELD, "Medium Shield"],
  [WeaponType.GREATSHIELD, "Greatshield"],
  [WeaponType.TORCH, "Torch"],
  [WeaponType.HAND_TO_HAND, "Hand-to-Hand"],
  [WeaponType.PERFUME_BOTTLE, "Perfume Bottle"],
  [WeaponType.THRUSTING_SHIELD, "Thrusting Shield"],
  [WeaponType.THROWING_BLADE, "Throwing Blade"],
  [WeaponType.BACKHAND_BLADE, "Backhand Blade"],
  [WeaponType.LIGHT_GREATSWORD, "Light Greatsword"],
  [WeaponType.GREAT_KATANA, "Great Katana"],
  [WeaponType.BEAST_CLAW, "Beast Claw"],
]);

export const damageTypeLabels = new Map([
  [AttackPowerType.PHYSICAL, "Physical Attack"],
  [AttackPowerType.MAGIC, "Magic Attack"],
  [AttackPowerType.FIRE, "Fire Attack"],
  [AttackPowerType.LIGHTNING, "Lightning Attack"],
  [AttackPowerType.HOLY, "Holy Attack"],
  [AttackPowerType.SCARLET_ROT, "Scarlet Rot Buildup"],
  [AttackPowerType.MADNESS, "Madness Buildup"],
  [AttackPowerType.SLEEP, "Sleep Buildup"],
  [AttackPowerType.FROST, "Frost Buildup"],
  [AttackPowerType.POISON, "Poison Buildup"],
  [AttackPowerType.BLEED, "Bleed Buildup"],
  [AttackPowerType.DEATH_BLIGHT, "Death Blight Buildup"],
]);

export const damageTypeIcons = new Map([
  [AttackPowerType.PHYSICAL, standardAffinityIcon],
  [AttackPowerType.MAGIC, magicAffinityIcon],
  [AttackPowerType.FIRE, fireAffinityIcon],
  [AttackPowerType.LIGHTNING, lightningAffinityIcon],
  [AttackPowerType.HOLY, sacredAffinityIcon],
  [AttackPowerType.SCARLET_ROT, scarletRotStatusIcon],
  [AttackPowerType.MADNESS, madnessStatusIcon],
  [AttackPowerType.SLEEP, sleepStatusIcon],
  [AttackPowerType.FROST, frostStatusIcon],
  [AttackPowerType.POISON, poisonStatusIcon],
  [AttackPowerType.BLEED, bleedStatusIcon],
  [AttackPowerType.DEATH_BLIGHT, deathBlightStatusIcon],
]);

export const getTotalDamageAttackPower = (
  attackPower: Partial<Record<AttackPowerType, AttackPower>>
) => {
  return allDamageTypes.reduce(
    (totalAttackPower, damageType) =>
      totalAttackPower + (attackPower[damageType]?.total ?? 0),
    0
  );
};

export const getSpellScaling = (
  weapon: Weapon,
  spellScaling: Partial<Record<AttackPowerType, number>>
) => {
  if (weapon.sorceryTool) {
    return spellScaling[AttackPowerType.MAGIC] ?? 0;
  } else if (weapon.incantationTool) {
    return spellScaling[AttackPowerType.HOLY] ?? 0;
  } else {
    return 0;
  }
};

export const getTotalEnemyDamage = (
  enemyDamge: Partial<Record<AttackPowerType, number>>
) => {
  return allDamageTypes.reduce(
    (totalEnemyDamage, damageType) =>
      totalEnemyDamage + (enemyDamge[damageType] ?? 0),
    0
  );
};

export const getAttributeScalingTier = (
  weapon: Weapon,
  attribute: Attribute,
  level?: number
): string | null => {
  const scalingTiers = weapon.scalingTiers;
  const weaponAttributeScaling =
    weapon.attributeScaling[level ?? weapon.attack.length - 1][attribute];

  if (!scalingTiers || !weaponAttributeScaling) return null;

  for (const [tierThreshold, tier] of scalingTiers) {
    if (weaponAttributeScaling >= tierThreshold) {
      return tier;
    }
  }

  return null;
};

export const randomColor = () => {
  const randomHue = Math.floor(Math.random() * 360);
  return hslToHex(randomHue);
};

export const hslToHex = (h: number, s: number = 70, l: number = 36): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // Convert to Hex and pad with zeroes if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const maxRegularUpgradeLevel = 25;
export const maxSpecialUpgradeLevel = 10;

/**
 * @param regularUpgradeLevel the upgrade level of a regular weapon
 * @returns the corresponding upgrade level for a somber weapon
 */
export function toSpecialUpgradeLevel(regularUpgradeLevel: number) {
  // For in between levels with no exact equivalent, round down. I think this is what you would
  // look for in practice, e.g. if you pick +24 you probably want +9 sombers because you're not
  // spending an Ancient Dragon (Somber) Smithing Stone, although it's not necessarily the same
  // matchmaking range.
  return Math.floor(
    (regularUpgradeLevel + 0.5) *
      (maxSpecialUpgradeLevel / maxRegularUpgradeLevel)
  );
}

/**
 * @param regularUpgradeLevel the upgrade level of a somber weapon
 * @returns the corresponding upgrade level for a regular weapon
 */
export function toRegularUpgradeLevel(specialUpgradeLevel: number) {
  return Math.floor(specialUpgradeLevel * 2.5);
}
