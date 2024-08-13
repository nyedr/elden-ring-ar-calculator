import { scalingRating } from "../calc/scaling";
import {
  DamageType,
  Scaling,
  WeaponLevel,
  StatusEffect,
  AttributeKey,
} from "./weapon-data";

export interface WeaponProps {
  name: string;
  weaponName: string;
  affinity: string;
  weaponType: string;
  maxUpgradeLevel: number;
  physicalDamageType: string;
  canCastSpells?: boolean;
  scaling?: Record<DamageType, Scaling>;
  levels?: WeaponLevel[];
  statusEffects?: StatusEffect[];
  weight: number;
  requirements: { [K in AttributeKey]: number };
  poiseAttack: number;
  twoHandBonus: boolean;
}

export class Weapon {
  name: string;
  weaponName: string;
  affinity: string;
  weaponType: string;
  maxUpgradeLevel: number;
  physicalDamageType: string;
  canCastSpells: boolean;
  scaling: Record<DamageType, Scaling>;
  levels: WeaponLevel[];
  statusEffects: StatusEffect[];
  weight: number;
  requirements: { [K in AttributeKey]: number };
  poiseAttack: number;
  twoHandBonus: boolean;

  constructor(props: WeaponProps) {
    this.name = props.name;
    this.weaponName = props.weaponName;
    this.affinity = props.affinity;
    this.weaponType = props.weaponType;
    this.maxUpgradeLevel = props.maxUpgradeLevel;
    this.physicalDamageType = props.physicalDamageType;
    this.poiseAttack = props.poiseAttack;
    this.canCastSpells =
      props.weaponType === "Glintstone Staff" ||
      props.weaponType === "Sacred Seal";
    this.scaling = props.scaling ?? ({} as Record<DamageType, Scaling>);
    this.levels = props.levels ?? [];
    this.statusEffects = props.statusEffects ?? [];
    this.weight = props.weight;
    this.requirements = props.requirements;
    this.twoHandBonus = props.twoHandBonus;
  }

  formatScaling(
    attribute: AttributeKey,
    level: number,
    showValue = true
  ): string {
    let scaling = this.levels[level][attribute];
    if (scaling === 0) {
      return "";
    } else {
      let displayValue = Math.floor(scaling * 100);
      let ratingLetter = scalingRating(scaling);
      return showValue ? `${ratingLetter} (${displayValue})` : ratingLetter;
    }
  }

  formatRequirement(attribute: AttributeKey): string {
    let requirement = this.requirements[attribute];
    return requirement > 0 ? String(requirement) : "";
  }
}
