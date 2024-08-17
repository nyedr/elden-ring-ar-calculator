import { Weapon } from "./weapon";
import {
  DamageAttribute,
  DamageType,
  allSimplifiedDamageTypes,
  StatusEffect,
} from "./weapon-data";

export interface Damage {
  weapon: number;
  scaled: number;
  total: number;
}

export class AttackRating {
  weapon: Weapon;
  level: number;
  protected totalAR: number;
  damages: { [K in DamageType]: Damage };
  statusEffects: {
    [K in StatusEffect]: number;
  };
  spellScaling: number;
  requirementsMet: {
    -readonly [K in keyof DamageAttribute]: boolean;
  };
  enemyAR: Partial<{ [K in DamageType]: number }> | undefined;
  enemyTotalAr: number | undefined;

  constructor(weapon: Weapon, level: number) {
    this.weapon = weapon;
    this.level = level;
    this.totalAR = 0;
    this.spellScaling = 0;
    this.damages = {} as Record<DamageType, Damage>;
    this.enemyAR = undefined;
    this.enemyTotalAr = undefined;

    allSimplifiedDamageTypes.forEach((damageType) => {
      this.damages[damageType] = {
        weapon: 0,
        scaled: 0,
        total: 0,
      };
    });
    this.statusEffects = {} as Record<StatusEffect, number>;
    this.requirementsMet = {
      Str: false,
      Dex: false,
      Int: false,
      Fai: false,
      Arc: false,
    };
  }

  formatPassive(statusEffect: StatusEffect) {
    let statusEffectLabel =
      statusEffect === "Scarlet Rot" ? "Rot" : statusEffect;
    return `${statusEffectLabel} (${Math.floor(
      this.statusEffects[statusEffect]
    )})`;
  }

  formatPassives() {
    return Object.keys(this.statusEffects)
      .filter(
        (statusEffect) => this.statusEffects[statusEffect as StatusEffect] > 0
      )
      .map((statusEffect) => {
        return this.formatPassive(statusEffect as StatusEffect);
      })
      .join(", ");
  }

  setAR(value: number) {
    this.totalAR = value;
  }

  get getAr() {
    return this.totalAR;
  }
}
