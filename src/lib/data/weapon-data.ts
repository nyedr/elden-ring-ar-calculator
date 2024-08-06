export const elementalDamageTypes = [
  "Magic",
  "Fire",
  "Lightning",
  "Holy",
] as const;
export type ElementalDamageType = (typeof elementalDamageTypes)[number];

export const damageTypes = ["Physical", ...elementalDamageTypes] as const;
export type DamageType = (typeof damageTypes)[number];
export const damageTypeToImageName = {
  Physical: "standardAffinity",
  Magic: "magicAffinity",
  Fire: "fireAffinity",
  Lightning: "lightningAffinity",
  Holy: "sacredAffinity",
};

// Passive effects that have a constant value regardless of weapon level or character attribute values
export const flatPassives = ["Scarlet Rot", "Madness", "Sleep"] as const;
export type FlatPassive = (typeof flatPassives)[number];

// Passive effects that change with weapon level but not character attribute values
export const leveledPassives = ["Frost"] as const;
export type LeveledPassive = (typeof leveledPassives)[number];

// Passive effects that change with weapon level and character attribute values (i.e. Arcane)
export const scaledPassives = ["Poison", "Blood"] as const;
export type ScaledPassive = (typeof scaledPassives)[number];

export const statusEffects = [
  ...flatPassives,
  ...leveledPassives,
  ...scaledPassives,
] as const;
export type StatusEffect = (typeof statusEffects)[number];
export const statusEffectToImageName = {
  "Scarlet Rot": "scarletRotStatus",
  Madness: "madnessStatus",
  Sleep: "sleepStatus",
  Frost: "frostStatus",
  Poison: "poisonStatus",
  Blood: "bleedStatus",
} as const;

export const damageAttribute = {
  Str: "Strength",
  Dex: "Dexterity",
  Int: "Intelligence",
  Fai: "Faith",
  Arc: "Arcane",
} as const;

export const weaponAffinities = [
  "Standard",
  "Heavy",
  "keen",
  "Quality",
  "Magic",
  "Frost",
  "Fire",
  "Flame Art",
  "Lightning",
  "Sacred",
  "Poison",
  "Blood",
  "Occult",
  "Unique",
] as const;
export type WeaponAffinity = (typeof weaponAffinities)[number];

export const damageAttributeKeys = ["Str", "Dex", "Int", "Fai", "Arc"] as const;

export type DamageAttribute = {
  [K in keyof typeof damageAttribute]: number;
};

export type AttributeKey = keyof DamageAttribute;

export interface Scaling extends DamageAttribute {
  curve: number;
}

export interface WeaponLevel {
  Physical: number;
  Magic: number;
  Fire: number;
  Lightning: number;
  Holy: number;
  Str: number;
  Dex: number;
  Int: number;
  Fai: number;
  Arc: number;
  "Scarlet Rot": number;
  Madness: number;
  Sleep: number;
  Frost: number;
  Poison: number;
  Blood: number;
}

export const weaponTypes = [
  // ----------------------------------------------- Sword
  { name: "Straight Sword", class: "sword" },
  { name: "Greatsword", class: "sword" },
  { name: "Curved Sword", class: "sword" },
  { name: "Curved Greatsword", class: "sword" },
  { name: "Thrusting Sword", class: "sword" },
  { name: "Heavy Thrusting Sword", class: "sword" },
  // ----------------------------------------------- Colossal
  { name: "Colossal Sword", class: "colossal" },
  { name: "Colossal Weapon", class: "colossal" },
  // ----------------------------------------------- Axe
  { name: "Axe", class: "axe" },
  { name: "Greataxe", class: "axe" },
  // ----------------------------------------------- Hammer
  { name: "Hammer", class: "hammer" },
  { name: "Warhammer", class: "hammer" },
  // ----------------------------------------------- Spear
  { name: "Spear", class: "spear" },
  { name: "Great Spear", class: "spear" },
  { name: "Halberd", class: "spear" },
  // ----------------------------------------------- Specialist
  { name: "Katana", class: "specialist" },
  { name: "Twinblade", class: "specialist" },
  { name: "Reaper", class: "specialist" },
  { name: "Flail", class: "specialist" },
  // ----------------------------------------------- Small
  { name: "Dagger", class: "small" },
  { name: "Fist", class: "small" },
  { name: "Claw", class: "small" },
  { name: "Whip", class: "small" },
  // ----------------------------------------------- Utility
  { name: "Torch", class: "utility" },
  // ----------------------------------------------- Caster
  { name: "Glintstone Staff", class: "caster" },
  { name: "Sacred Seal", class: "caster" },
  // ----------------------------------------------- Bow
  { name: "Bow", class: "bow" },
  { name: "Light Bow", class: "bow" },
  { name: "Greatbow", class: "bow" },
  { name: "Crossbow", class: "bow" },
  { name: "Ballista", class: "bow" },
  // ----------------------------------------------- Shield
  { name: "Small Shield", class: "shield" },
  { name: "Medium Shield", class: "shield" },
  { name: "Greatshield", class: "shield" },
];
