import { AttackPowerType } from "./attackPowerTypes";

export interface AshOfWar {
  name: string;
  attackId: number;
  damageMotionValues: Record<AttackPowerType, number>;
  poiseDamageMV: number;

  /**
   * Base damage of the Ash of War for non-bullet attacks (uses weapon attack power).
   */
  baseDamage: number;

  /**
   * Base attack power for Bullet attacks, organized by attack type (physical, magic, etc.).
   */
  baseBulletDamage: Record<AttackPowerType, number>;

  /**
   * Multiplier applied for bullet attacks based on reinforcement level, ranging from 1 to 4.
   */
  bulletReinforcementMultiplier: number;

  /**
   * Poise Damage for Bullet attacks (multiply by 10 for PvP situations).
   */
  bulletPoiseDamage: number;

  /**
   * Status effect Motion Value, if applicable (e.g., poison, frost).
   */
  statusMV: number;

  /**
   * Weapon buff Motion Value, if this Ash of War applies a temporary buff.
   */
  weaponBuffMV: number;

  /**
   * Physical attack attribute for this Ash of War (e.g., Slash, Strike).
   */
  physAtkAttribute: string;

  /**
   * If true: the attack will always use 1h Attack Power regardless of whether or not the weapon is two-handed.
   */
  isDisableBothHandsAtkBonus: boolean;

  /**
   * If true: the attack uses both the weapon's attack power and the bullet's base attack power.
   */
  isAddBaseAtk: boolean;

  /**
   * If the value is -1 that means there is no overwrite; this means the weapon's normal scaling is used
   */
  overwriteAttackElementCorrectId: number;

  /**
   * An array of the ash of war's sub categories (e.g., Weapon Skill, Charged Weapon Skill, Dancing Attack).
   */
  subCartegories: string[];
}
