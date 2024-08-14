import { DamageType, StatusEffect } from "./weapon-data";

export interface Poise {
  base: number;
  multiplier: number;
  effective: number;
  regenDelay: number;
}

export const allStatusEffects = [
  StatusEffect.Poison,
  StatusEffect.Bleed,
  StatusEffect.Scarlet_Rot,
  StatusEffect.Frost,
  StatusEffect.Sleep,
  StatusEffect.Madness,
  StatusEffect.Death_Blight,
];

export enum NewGame {
  NG = "NG",
  NGPlus = "NG+",
  NGPlus2 = "NG+2",
  NGPlus3 = "NG+3",
  NGPlus4 = "NG+4",
  NGPlus5 = "NG+5",
  NGPlus6 = "NG+6",
  NGPlus7 = "NG+7",
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
