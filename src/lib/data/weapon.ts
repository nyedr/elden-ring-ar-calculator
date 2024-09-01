import { AttackPowerType } from "./attackPowerTypes";
import { Attribute } from "./attributes";
import { WeaponType } from "./weaponTypes";

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

export const isDamageValuesKey = (
  key: string
): key is (typeof damageValuesKeys)[number] => {
  return damageValuesKeys.includes(key as any);
};

export type DamageValues = {
  [key in (typeof damageValuesKeys)[number]]: number | null;
};

export type DamageTypes = {
  [key in (typeof damageValuesKeys)[number]]: string;
};

export type MotionValues = DamageTypes;

export interface EnemyDamageMultiplier {
  void: number;
  undead: number;
  ancientDraconic: number;
  draconic: number;
}

export type WeaponMove = (typeof damageValuesKeys)[number];

export type AttackElementCorrect = Partial<
  Record<AttackPowerType, Partial<Record<Attribute, number | true>>>
>;

export interface Weapon {
  /**
   * The full unique name of the weapon, e.g. "Heavy Nightrider Glaive"
   */
  name: string;

  /**
   * The base weapon name without an affinity specified, e.g. "Nightrider Glaive"
   */
  weaponName: string;

  /**
   * A wiki link for the weapon
   */
  url: string | null;

  /**
   * The affinity of the weapon for filtering, see uiUtils.tsx for a full list of vanilla affinities
   */
  affinityId: number;

  /**
   * The category of the weapon for filtering
   */
  weaponType: WeaponType;

  /**
   * Player attribute requirements to use the weapon effectively (without an attack rating penalty)
   */
  requirements: Partial<Record<Attribute, number>>;

  /**
   * Scaling amount for each player attribute at each upgrade level
   */
  attributeScaling: Partial<Record<Attribute, number>>[];

  /**
   * Base attack power for each damage type, status effect, and spell scaling at each upgrade level
   */
  attack: Partial<Record<AttackPowerType, number>>[];

  /**
   * Map indicating which damage types scale with which player attributes
   */
  attackElementCorrect: AttackElementCorrect;

  /**
   * Map indicating which scaling curve is used for each damage type, status effect, or spell scaling
   */
  calcCorrectGraphs: Record<AttackPowerType, number[]>;

  /**
   * True if the weapon doesn't get a strength bonus when two-handing
   */
  paired?: boolean;

  /**
   * True if this weapon can cast glintstone sorceries
   */
  sorceryTool?: boolean;

  /**
   * True if this weapon can cast incantations
   */
  incantationTool?: boolean;

  /**
   * Thresholds and labels for each scaling grade (S, A, B, etc.) for this weapon. This isn't
   * hardcoded for all weapons because it can be changed by mods.
   */
  scalingTiers?: [number, string][];

  /**
   * If true, this weapon is from the Shadow of the Erdtree expansion
   */
  dlc: boolean;

  /**
   * The base poise damage of the weapon, usually dicatated by the weapon type
   */
  basePoiseDamage: number;

  /**
   * Each specific attack you do has a hidden motion value associated with it,
   * which is a number that determines how strong that particular attack is
   */
  motionValues: MotionValues;

  /**
   * The amount of poise damage dealt by each attack
   */
  poiseDamage: DamageValues;

  /**
   * The physical damage type of each attack
   * Ex: "Slash", "Strike"
   */
  physicalAttackAttributes: DamageTypes;

  /**
   * Damage multiplies for enemy types
   */
  enemyDamageMultipliers: EnemyDamageMultiplier;

  /**
   * The inherent poise of the weapon, only used during hyper armor frames; some hyper armor events will use a fraction of this value
   * Multiply by 1000 to match poise as it is displayed for the in-game menu
   */
  hyperArmorPoise: number;
}
