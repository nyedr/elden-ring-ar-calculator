// Passive effects that have a constant value regardless of weapon level or character attribute values
export const flatPassives = ["Scarlet Rot", "Madness", "Sleep"] as const;
export type FlatPassive = (typeof flatPassives)[number];

// Passive effects that change with weapon level but not character attribute values
export const leveledPassives = ["Frost"] as const;
export type LeveledPassive = (typeof leveledPassives)[number];

// Passive effects that change with weapon level and character attribute values (i.e. Arcane)
export const scaledPassives = ["Poison", "Blood"] as const;
export type ScaledPassive = (typeof scaledPassives)[number];

export enum DamageType {
  Magic = "Magic",
  Fire = "Fire",
  Lightning = "Lightning",
  Holy = "Holy",
  Physical = "Physical",
}

export const damageTypeToImageName = {
  [DamageType.Physical]: "standardAffinity",
  [DamageType.Magic]: "magicAffinity",
  [DamageType.Fire]: "fireAffinity",
  [DamageType.Lightning]: "lightningAffinity",
  [DamageType.Holy]: "sacredAffinity",
};

export const allDamageTypes = [
  DamageType.Physical,
  DamageType.Magic,
  DamageType.Fire,
  DamageType.Lightning,
  DamageType.Holy,
];

export const allSimplifiedDamageTypes = [
  DamageType.Physical,
  DamageType.Magic,
  DamageType.Fire,
  DamageType.Lightning,
  DamageType.Holy,
];

export enum StatusEffect {
  Poison = "Poison",
  Bleed = "Bleed",
  Scarlet_Rot = "Scarlet Rot",
  Frost = "Frost",
  Sleep = "Sleep",
  Madness = "Madness",
}

export const statusEffectToImageName = {
  [StatusEffect.Scarlet_Rot]: "scarletRotStatus",
  [StatusEffect.Madness]: "madnessStatus",
  [StatusEffect.Sleep]: "sleepStatus",
  [StatusEffect.Frost]: "frostStatus",
  [StatusEffect.Poison]: "poisonStatus",
  [StatusEffect.Bleed]: "bleedStatus",
} as const;

export const allStatusEffects = [
  StatusEffect.Poison,
  StatusEffect.Bleed,
  StatusEffect.Scarlet_Rot,
  StatusEffect.Frost,
  StatusEffect.Sleep,
  StatusEffect.Madness,
];

export interface Poise {
  base: number;
  multiplier: number;
  effective: number;
  regenDelay: number;
}

export interface Enemy {
  id: number;
  name: string;
  location: string;
  healthPoints: number;
  dlcClearHealthPoints: number | null;
  defence: {
    [key in DamageType]: number;
  };
  damageNegation: {
    [key in DamageType]: number;
  };
  poise: Poise;
  resistances: {
    [key in StatusEffect]: number | "Immune";
  };
}

export interface EnemyData {
  Location: string;
  Name: string;
  ID: string;
  "": string; // Unused field
  Health: string;
  dlcClear: string;
  _1: string; // Unused field
  Phys: string;
  Strike: string;
  Slash: string;
  Pierce: string;
  Magic: string;
  Fire: string;
  Ltng: string;
  Holy: string;
  _2: string; // Unused field
  Phys_1: string;
  Strike_1: string;
  Slash_1: string;
  Pierce_1: string;
  Magic_1: string;
  Fire_1: string;
  Ltng_1: string;
  Holy_1: string;
  _3: string; // Unused field
  Poison: string;
  "Scarlet Rot": string;
  Bleed: string;
  Frost: string;
  Sleep: string;
  Madness: string;
  Deathblight: string;
  _4: string; // Unused field
  Bleed_1: string;
  Frost_1: string;
  Sleep_1: string;
  Madness_1: string;
  "HP Burn Effect": string;
  _5: string; // Unused field
  Base: string;
  "Incoming Mult": string;
  Effective: string;
  "Regen Delay": string;
  _6: string; // Unused field
  "Part 1": string;
  "Part 2": string;
  "Part 3": string;
  "Part 4": string;
  "Part 5": string;
  "Part 6": string;
  "Part 7": string;
  "Part 8": string;
  "Weak Parts": string;
}

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
  [key in (typeof allDamageTypes)[number]]: number;
} & {
  [key in (typeof allStatusEffects)[number]]: number;
} & {
  [key in (typeof damageAttributeKeys)[number]]: number;
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
