export enum DamageType {
  Magic = "Magic",
  Fire = "Fire",
  Lightning = "Lightning",
  Holy = "Holy",
  Physical = "Physical",
  Pierce = "Pierce",
  Slash = "Slash",
  Strike = "Strike",
}

export const damageTypeToImageName = {
  [DamageType.Physical]: "standardAffinity",
  [DamageType.Magic]: "magicAffinity",
  [DamageType.Fire]: "fireAffinity",
  [DamageType.Lightning]: "lightningAffinity",
  [DamageType.Holy]: "sacredAffinity",
};

export const allSimplifiedDamageTypes = [
  DamageType.Physical,
  DamageType.Magic,
  DamageType.Fire,
  DamageType.Lightning,
  DamageType.Holy,
];

export const allDamageTypes = [
  DamageType.Physical,
  DamageType.Magic,
  DamageType.Fire,
  DamageType.Lightning,
  DamageType.Holy,
  DamageType.Pierce,
  DamageType.Slash,
  DamageType.Strike,
];

export enum StatusEffect {
  Poison = "Poison",
  Bleed = "Bleed",
  Scarlet_Rot = "Scarlet Rot",
  Frost = "Frost",
  Sleep = "Sleep",
  Madness = "Madness",
  Death_Blight = "Death Blight",
}

// Passive effects that have a constant value regardless of weapon level or character attribute values
export const flatPassives = [
  StatusEffect.Scarlet_Rot,
  StatusEffect.Madness,
  StatusEffect.Sleep,
] as const;
export type FlatPassive = (typeof flatPassives)[number];

// Passive effects that change with weapon level but not character attribute values
export const leveledPassives = [StatusEffect.Frost] as const;
export type LeveledPassive = (typeof leveledPassives)[number];

// Passive effects that change with weapon level and character attribute values (i.e. Arcane)
export const scaledPassives = [
  StatusEffect.Poison,
  StatusEffect.Bleed,
] as const;
export type ScaledPassive = (typeof scaledPassives)[number];

export const statusEffectToImageName = {
  [StatusEffect.Scarlet_Rot]: "scarletRotStatus",
  [StatusEffect.Madness]: "madnessStatus",
  [StatusEffect.Sleep]: "sleepStatus",
  [StatusEffect.Frost]: "frostStatus",
  [StatusEffect.Poison]: "poisonStatus",
  [StatusEffect.Bleed]: "bleedStatus",
  [StatusEffect.Death_Blight]: "deathBlightStatus",
} as const;

export const allStatusEffects = [
  StatusEffect.Poison,
  StatusEffect.Bleed,
  StatusEffect.Scarlet_Rot,
  StatusEffect.Frost,
  StatusEffect.Sleep,
  StatusEffect.Madness,
];

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

export type WeaponLevel = {
  [key in (typeof allSimplifiedDamageTypes)[number]]: number;
} & {
  [key in (typeof allStatusEffects)[number]]: number;
} & {
  [key in (typeof damageAttributeKeys)[number]]: number;
};

export const damageValuesKeys = [
  "1h R1 1",
  "1h R1 2",
  "1h R1 3",
  "1h R1 4",
  "1h R1 5",
  "1h R1 6",
  "1h R2 1",
  "1h R2 2",
  "1h Charged R2 1",
  "1h Charged R2 2",
  "1h Running R1",
  "1h Running R2",
  "1h Jumping R1",
  "1h Jumping R2",
  "2h R1 1",
  "2h R1 2",
  "2h R1 3",
  "2h R1 4",
  "2h R1 5",
  "2h R1 6",
  "2h R2 1",
  "2h R2 2",
  "2h Charged R2 1",
  "2h Charged R2 2",
  "2h Running R1",
  "2h Running R2",
  "2h Jumping R1",
  "2h Jumping R2",
] as const;

export type DamageValues = {
  [key in (typeof damageValuesKeys)[number]]: number | null;
};

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
