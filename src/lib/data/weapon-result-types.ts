import {
  AttributeKey,
  DamageType,
  LeveledPassive,
  ScaledPassive,
} from "./weapon-data";

export interface WeaponData {
  Name: string;
  "Weapon Name": string;
  "Affinity (Dropdown)": string;
  Affinity: string;
  "Max Upgrade": string;
  "Required (Str)": string;
  "Required (Dex)": string;
  "Required (Int)": string;
  "Required (Fai)": string;
  "Required (Arc)": string;
  "Physical Damage Type": string;
  Weight: string;
  "Base Poise Attack": string;
  "Weapon Type": string;
}

export interface WeaponIdCorrectGraph {
  Name: string;
  Physical: string;
  Magic: string;
  Fire: string;
  Lightning: string;
  Holy: string;
  "AttackElementCorrect ID": string;
}

type Stat = "STR" | "DEX" | "INT" | "FAI" | "ARC";

export type DetailedWeaponScalingData = {
  "Row ID": string;
} & {
  [K in `${DamageType} Scaling: ${Stat}`]: number;
};

export type UpgradeLevel =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25";

export type WeaponScalingData = {
  Name: string;
} & {
  [K in `${AttributeKey} +${UpgradeLevel}`]: number;
};

export type DamageTypeAbbriviations =
  | "Phys"
  | "Mag"
  | "Fire"
  | "Ligh"
  | "Holy"
  | "Stam";

export type WeaponStats = {
  Name: string;
} & {
  [K in `${DamageTypeAbbriviations} +${UpgradeLevel}`]: number;
};

export type WeaponPassive = {
  Name: string;
  "Type 1": string;
  "Type 2": string;
  "Madness +0": string;
  "Scarlet Rot +0": string;
  "Sleep +0": string;
} & {
  [K in `${LeveledPassive | ScaledPassive} +${UpgradeLevel}`]: number;
};
