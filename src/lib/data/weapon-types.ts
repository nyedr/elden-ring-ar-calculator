export const elementalDamageTypes = [
  "Magic",
  "Fire",
  "Lightning",
  "Holy",
] as const;
export type ElementalDamageType = (typeof elementalDamageTypes)[number];

export const damageTypes = ["Physical", ...elementalDamageTypes] as const;
export type DamageType = (typeof damageTypes)[number];

// Passive effects that have a constant value regardless of weapon level or character attribute values
export const flatPassives = ["Scarlet Rot", "Madness", "Sleep"] as const;
export type FlatPassive = (typeof flatPassives)[number];
// Passive effects that change with weapon level but not character attribute values
export const leveledPassives = ["Frost"] as const;
export type LeveledPassive = (typeof leveledPassives)[number];
// Passive effects that change with weapon level and character attribute values (i.e. Arcane)
export const scaledPassives = ["Poison", "Blood"] as const;
export type ScaledPassive = (typeof scaledPassives)[number];

export const passiveTypes = [
  ...flatPassives,
  ...leveledPassives,
  ...scaledPassives,
] as const;
export type PassiveEffect = (typeof passiveTypes)[number];

export interface Scaling {
  curve: number;
  Str: number;
  Dex: number;
  Int: number;
  Fai: number;
  Arc: number;
}

export interface Level {
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

export interface Weapon {
  name: string;
  weaponName: string;
  affinity: string;
  weaponType: string;
  maxUpgrade: number;
  physicalDamageType: string;
  canCastSpells: boolean;
  scaling: Record<DamageType, Scaling>;
  levels: Level[];
  passiveEffects: PassiveEffect[];
}

let exampleWeapon = {
  name: "Fire Dagger",
  weaponName: "Dagger",
  affinity: "Fire",
  weaponType: "Dagger",
  maxUpgrade: 25,
  physicalDamageType: "Slash/Pierce",
  canCastSpells: false,
  scaling: {
    Physical: {
      curve: 0,
      Str: 1,
      Dex: 1,
      Int: 0,
      Fai: 0,
      Arc: 0,
    },
    Magic: {
      curve: 0,
      Str: 0,
      Dex: 0,
      Int: 1,
      Fai: 0,
      Arc: 0,
    },
    Fire: {
      curve: 0,
      Str: 0,
      Dex: 0,
      Int: 0,
      Fai: 1,
      Arc: 0,
    },
    Lightning: {
      curve: 0,
      Str: 0,
      Dex: 0,
      Int: 0,
      Fai: 0,
      Arc: 1,
    },
    Holy: {
      curve: 0,
      Str: 0,
      Dex: 0,
      Int: 0,
      Fai: 1,
      Arc: 1,
    },
  },
  levels: [
    {
      Physical: 56.8,
      Magic: 0,
      Fire: 56.8,
      Lightning: 0,
      Holy: 0,
      Str: 0.611,
      Dex: 0.05,
      Int: 0,
      Fai: 0,
      Arc: 0,
      "Scarlet Rot": 0,
      Madness: 0,
      Sleep: 0,
      Frost: 0,
      Poison: 0,
      Blood: 0,
    },
    {
      Physical: 120.7,
      Magic: 0,
      Fire: 120.7,
      Lightning: 0,
      Holy: 0,
      Str: 0.987,
      Dex: 0.12,
      Int: 0,
      Fai: 0,
      Arc: 0,
      "Scarlet Rot": 0,
      Madness: 0,
      Sleep: 0,
      Frost: 0,
      Poison: 0,
      Blood: 0,
    },
  ],
  passiveEffects: ["Blood", "Poison"],
} satisfies Weapon;
