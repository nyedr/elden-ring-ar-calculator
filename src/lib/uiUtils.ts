import specialWeaponIcon from "/specialWeapon.webp";
import standardAffinityIcon from "/standardAffinity.webp";
import heavyAffinityIcon from "/heavyAffinity.webp";
import keenAffinityIcon from "/keenAffinity.webp";
import qualityAffinityIcon from "/qualityAffinity.webp";
import magicAffinityIcon from "/magicAffinity.webp";
import coldAffinityIcon from "/coldAffinity.webp";
import fireAffinityIcon from "/fireAffinity.webp";
import lightningAffinityIcon from "/lightningAffinity.webp";
import sacredAffinityIcon from "/sacredAffinity.webp";
import poisonAffinityIcon from "/poisonAffinity.webp";
import bloodAffinityIcon from "/bloodAffinity.webp";
import occultAffinityIcon from "/occultAffinity.webp";
import errBestialAffinityIcon from "/errBestialAffinity.webp";
import errBlessedAffinityIcon from "/errBlessedAffinity.webp";
import errBoltAffinityIcon from "/errBoltAffinity.webp";
import errCursedAffinityIcon from "/errCursedAffinity.webp";
import errFatedAffinityIcon from "/errFatedAffinity.webp";
import errFellAffinityIcon from "/errFellAffinity.webp";
import errFrenziedAffinityIcon from "/errFrenziedAffinity.webp";
import errGravitationalAffinityIcon from "/errGravitationalAffinity.webp";
import errMagicAffinityIcon from "/errMagicAffinity.webp";
import errMagmaAffinityIcon from "/errMagmaAffinity.webp";
import errNightAffinityIcon from "/errNightAffinity.webp";
import errOccultAffinityIcon from "/errOccultAffinity.webp";
import errRottenAffinityIcon from "/errRottenAffinity.webp";
import errSacredAffinityIcon from "/errSacredAffinity.webp";
import errSoporificAffinityIcon from "/errSoporificAffinity.webp";
import scarletRotStatusIcon from "/scarletRotStatus.webp";
import madnessStatusIcon from "/madnessStatus.webp";
import sleepStatusIcon from "/sleepStatus.webp";
import frostStatusIcon from "/frostStatus.webp";
import poisonStatusIcon from "/poisonStatus.webp";
import bleedStatusIcon from "/bleedStatus.webp";
import deathBlightStatusIcon from "/deathBlightStatus.webp";
import { AttributeKey } from "./data/weapon-data";

export interface AffinityOption {
  text: string;
  icon?: string;
}

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

// export const affinityOptions = new Map<number, AffinityOption>([
//   [0, { text: "Standard", icon: standardAffinityIcon }],
//   [1, { text: "Heavy", icon: heavyAffinityIcon }],
//   [2, { text: "Keen", icon: keenAffinityIcon }],
//   [3, { text: "Quality", icon: qualityAffinityIcon }],
//   [8, { text: "Magic", icon: magicAffinityIcon }],
//   [4, { text: "Fire", icon: fireAffinityIcon }],
//   [5, { text: "Flame Art", icon: fireAffinityIcon }],
//   [6, { text: "Lightning", icon: lightningAffinityIcon }],
//   [7, { text: "Sacred", icon: sacredAffinityIcon }],
//   [9, { text: "Cold", icon: coldAffinityIcon }],
//   [10, { text: "Poison", icon: poisonAffinityIcon }],
//   [11, { text: "Blood", icon: bloodAffinityIcon }],
//   [12, { text: "Occult", icon: occultAffinityIcon }],
//   [-1, { text: "Unique", icon: specialWeaponIcon }], // Special fake affinity ID for uninfusable weapon s
// ]);

// /**
//  * Affinity names from the Elden Ring Reforged Mod
//  *
//  * @see https://err.fandom.com/wiki/Affinities
//  */
// export const reforgedAffinityOptions = new Map<number, AffinityOption>([
//   [0, { text: "Standard", icon: standardAffinityIcon }],
//   [1, { text: "Heavy", icon: heavyAffinityIcon }],
//   [2, { text: "Keen", icon: keenAffinityIcon }],
//   [3, { text: "Quality", icon: qualityAffinityIcon }],
//   [8, { text: "Magic", icon: errMagicAffinityIcon }],
//   [16, { text: "Magma", icon: errMagmaAffinityIcon }],
//   [5, { text: "Fell", icon: errFellAffinityIcon }],
//   [13, { text: "Bolt", icon: errBoltAffinityIcon }],
//   [7, { text: "Sacred", icon: errSacredAffinityIcon }],
//   [19, { text: "Night", icon: errNightAffinityIcon }],
//   [4, { text: "Fire", icon: fireAffinityIcon }],
//   [6, { text: "Lightning", icon: lightningAffinityIcon }],
//   [21, { text: "Blessed", icon: errBlessedAffinityIcon }],
//   [10, { text: "Poison", icon: poisonAffinityIcon }],
//   [11, { text: "Blood", icon: bloodAffinityIcon }],
//   [12, { text: "Occult", icon: errOccultAffinityIcon }],
//   [22, { text: "Bestial", icon: errBestialAffinityIcon }],
//   [20, { text: "Gravitational", icon: errGravitationalAffinityIcon }],
//   [17, { text: "Rotten", icon: errRottenAffinityIcon }],
//   [18, { text: "Cursed", icon: errCursedAffinityIcon }],
//   [9, { text: "Cold", icon: coldAffinityIcon }],
//   [14, { text: "Soporific", icon: errSoporificAffinityIcon }],
//   [15, { text: "Frenzied", icon: errFrenziedAffinityIcon }],
//   [23, { text: "Fated", icon: errFatedAffinityIcon }],
//   [-1, { text: "Unique", icon: specialWeaponIcon }], // Special fake affinity ID for uninfusable weapons
// ]);

// /**
//  * Affinity names from The Convergence mod
//  */
// export const convergenceAffinityOptions = new Map<number, AffinityOption>([
//   [0, { text: "Standard" }],
//   [1, { text: "Heavy" }],
//   [2, { text: "Keen" }],
//   [3, { text: "Quality" }],
//   [4, { text: "Glint" }],
//   [5, { text: "Dragonkin" }],
//   [6, { text: "Gravity" }],
//   [7, { text: "Flame" }],
//   [8, { text: "Golden" }],
//   [9, { text: "Draconic" }],
//   [10, { text: "Bestial" }],
//   [11, { text: "Night" }],
//   [12, { text: "Lava" }],
//   [13, { text: "Frenzy" }],
//   [14, { text: "Death" }],
//   [15, { text: "Godslayer" }],
//   [16, { text: "Frost" }],
//   [17, { text: "Aberrant" }],
//   [18, { text: "Bloodflame" }],
//   [19, { text: "Rotten" }],
//   [20, { text: "Storm" }],
//   [21, { text: "Mystic" }],
//   [-1, { text: "Unique" }], // Special fake affinity ID for uninfusable weapons
// ]);

// export const catalystTypes = [WeaponType.GLINTSTONE_STAFF, WeaponType.SACRED_SEAL];

// export const shieldTypes = [
//   WeaponType.SMALL_SHIELD,
//   WeaponType.MEDIUM_SHIELD,
//   WeaponType.GREATSHIELD,
//   WeaponType.THRUSTING_SHIELD,
// ];

// export const meleeWeaponTypes = [
//   WeaponType.AXE,
//   WeaponType.BACKHAND_BLADE,
//   WeaponType.BEAST_CLAW,
//   WeaponType.CLAW,
//   WeaponType.COLOSSAL_SWORD,
//   WeaponType.COLOSSAL_WEAPON,
//   WeaponType.CURVED_GREATSWORD,
//   WeaponType.CURVED_SWORD,
//   WeaponType.DAGGER,
//   WeaponType.FIST,
//   WeaponType.FLAIL,
//   WeaponType.GREAT_HAMMER,
//   WeaponType.GREAT_KATANA,
//   WeaponType.GREAT_SPEAR,
//   WeaponType.GREATAXE,
//   WeaponType.GREATSWORD,
//   WeaponType.HALBERD,
//   WeaponType.HAMMER,
//   WeaponType.HAND_TO_HAND,
//   WeaponType.HEAVY_THRUSTING_SWORD,
//   WeaponType.KATANA,
//   WeaponType.LIGHT_GREATSWORD,
//   WeaponType.PERFUME_BOTTLE,
//   WeaponType.REAPER,
//   WeaponType.SPEAR,
//   WeaponType.STRAIGHT_SWORD,
//   WeaponType.THROWING_BLADE,
//   WeaponType.THRUSTING_SWORD,
//   WeaponType.TORCH,
//   WeaponType.TWINBLADE,
//   WeaponType.WHIP,
// ];

// export const dlcWeaponTypes = [
//   WeaponType.HAND_TO_HAND,
//   WeaponType.PERFUME_BOTTLE,
//   WeaponType.THRUSTING_SHIELD,
//   WeaponType.THROWING_BLADE,
//   WeaponType.BACKHAND_BLADE,
//   WeaponType.LIGHT_GREATSWORD,
//   WeaponType.GREAT_KATANA,
//   WeaponType.BEAST_CLAW,
// ];

// export const hiddenWeaponTypes = [WeaponType.DUAL_CATALYST];

// export const allWeaponTypes = [
//   ...meleeWeaponTypes,
//   ...rangedWeaponTypes,
//   ...catalystTypes,
//   ...shieldTypes,
//   ...hiddenWeaponTypes,
// ];

// export const weaponTypeLabels = new Map([
//   [WeaponType.DAGGER, "Dagger"],
//   [WeaponType.STRAIGHT_SWORD, "Straight Sword"],
//   [WeaponType.GREATSWORD, "Greatsword"],
//   [WeaponType.COLOSSAL_SWORD, "Colossal Sword"],
//   [WeaponType.CURVED_SWORD, "Curved Sword"],
//   [WeaponType.CURVED_GREATSWORD, "Curved Greatsword"],
//   [WeaponType.KATANA, "Katana"],
//   [WeaponType.TWINBLADE, "Twinblade"],
//   [WeaponType.THRUSTING_SWORD, "Thrusting Sword"],
//   [WeaponType.HEAVY_THRUSTING_SWORD, "Heavy Thrusting Sword"],
//   [WeaponType.AXE, "Axe"],
//   [WeaponType.GREATAXE, "Greataxe"],
//   [WeaponType.HAMMER, "Hammer"],
//   [WeaponType.GREAT_HAMMER, "Great Hammer"],
//   [WeaponType.FLAIL, "Flail"],
//   [WeaponType.SPEAR, "Spear"],
//   [WeaponType.GREAT_SPEAR, "Great Spear"],
//   [WeaponType.HALBERD, "Halberd"],
//   [WeaponType.REAPER, "Reaper"],
//   [WeaponType.FIST, "Fist"],
//   [WeaponType.CLAW, "Claw"],
//   [WeaponType.WHIP, "Whip"],
//   [WeaponType.COLOSSAL_WEAPON, "Colossal Weapon"],
//   [WeaponType.LIGHT_BOW, "Light Bow"],
//   [WeaponType.BOW, "Bow"],
//   [WeaponType.GREATBOW, "Greatbow"],
//   [WeaponType.CROSSBOW, "Crossbow"],
//   [WeaponType.BALLISTA, "Ballista"],
//   [WeaponType.GLINTSTONE_STAFF, "Glintstone Staff"],
//   [WeaponType.DUAL_CATALYST, "Dual Catalyst"],
//   [WeaponType.SACRED_SEAL, "Sacred Seal"],
//   [WeaponType.SMALL_SHIELD, "Small Shield"],
//   [WeaponType.MEDIUM_SHIELD, "Medium Shield"],
//   [WeaponType.GREATSHIELD, "Greatshield"],
//   [WeaponType.TORCH, "Torch"],
//   [WeaponType.HAND_TO_HAND, "Hand-to-Hand"],
//   [WeaponType.PERFUME_BOTTLE, "Perfume Bottle"],
//   [WeaponType.THRUSTING_SHIELD, "Thrusting Shield"],
//   [WeaponType.THROWING_BLADE, "Throwing Blade"],
//   [WeaponType.BACKHAND_BLADE, "Backhand Blade"],
//   [WeaponType.LIGHT_GREATSWORD, "Light Greatsword"],
//   [WeaponType.GREAT_KATANA, "Great Katana"],
//   [WeaponType.BEAST_CLAW, "Beast Claw"],
// ]);

// export const damageTypeLabels = new Map([
//   [AttackPowerType.PHYSICAL, "Physical Attack"],
//   [AttackPowerType.MAGIC, "Magic Attack"],
//   [AttackPowerType.FIRE, "Fire Attack"],
//   [AttackPowerType.LIGHTNING, "Lightning Attack"],
//   [AttackPowerType.HOLY, "Holy Attack"],
//   [AttackPowerType.SCARLET_ROT, "Scarlet Rot Buildup"],
//   [AttackPowerType.MADNESS, "Madness Buildup"],
//   [AttackPowerType.SLEEP, "Sleep Buildup"],
//   [AttackPowerType.FROST, "Frost Buildup"],
//   [AttackPowerType.POISON, "Poison Buildup"],
//   [AttackPowerType.BLEED, "Bleed Buildup"],
//   [AttackPowerType.DEATH_BLIGHT, "Death Blight Buildup"],
// ]);

// export const damageTypeIcons = new Map([
//   [AttackPowerType.PHYSICAL, standardAffinityIcon],
//   [AttackPowerType.MAGIC, magicAffinityIcon],
//   [AttackPowerType.FIRE, fireAffinityIcon],
//   [AttackPowerType.LIGHTNING, lightningAffinityIcon],
//   [AttackPowerType.HOLY, sacredAffinityIcon],
//   [AttackPowerType.SCARLET_ROT, scarletRotStatusIcon],
//   [AttackPowerType.MADNESS, madnessStatusIcon],
//   [AttackPowerType.SLEEP, sleepStatusIcon],
//   [AttackPowerType.FROST, frostStatusIcon],
//   [AttackPowerType.POISON, poisonStatusIcon],
//   [AttackPowerType.BLEED, bleedStatusIcon],
//   [AttackPowerType.DEATH_BLIGHT, deathBlightStatusIcon],
// ]);

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
