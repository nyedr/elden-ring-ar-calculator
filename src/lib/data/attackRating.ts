import { Weapon } from "./weapon";
import { DamageType, damageTypes, PassiveType } from "./weapon-data";

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
  passiveTypes: Record<PassiveType, number>;
  spellScaling: number;

  constructor(weapon: Weapon, level: number) {
    this.weapon = weapon;
    this.level = level;
    this.totalAR = 0;
    this.spellScaling = 0;
    this.damages = {} as Record<DamageType, Damage>;

    // TODO: Check if this is correct
    damageTypes.forEach((damageType) => {
      this.damages[damageType] = {
        weapon: 0,
        scaled: 0,
        total: 0,
      };
    });
    this.passiveTypes = {} as Record<PassiveType, number>;
  }

  formatPassive(passiveType: PassiveType) {
    let passiveTypeLabel = passiveType === "Scarlet Rot" ? "Rot" : passiveType;
    return `${passiveTypeLabel} (${Math.floor(
      this.passiveTypes[passiveType]
    )})`;
  }

  formatPassives() {
    return Object.keys(this.passiveTypes)
      .map((passiveType) => {
        return this.formatPassive(passiveType as PassiveType);
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
