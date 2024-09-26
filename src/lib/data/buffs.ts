import { BuffSelection } from "@/components/buffs-dialog";
import { WeaponAttackResult } from "../calc/calculator";
import { AttackPowerType, AttackType } from "./attackPowerTypes";
import { Enemy } from "./enemy-data";
import { DamageTypes } from "./weapon";

export interface Multiplier {
  stance: number;
  damage: number;
  stamina: number;
}

interface BuffApplicableParams {
  weaponAttackResult: WeaponAttackResult;
  isTwoHanding: boolean;
  move?: string;
  damageType?: string;
  enemy?: Enemy;
}

/**
 * Represents a buff that can be applied to a weapon or character.
 */
export interface Buff {
  /** Unique identifier for the buff */
  id: number;
  /** Display name of the buff */
  name: string;
  /** The type(s) of effect this buff applies */
  effectType: AttackPowerType[] | AttackType[];
  /** The multipliers this buff provides */
  multipliers: Multiplier[];
  /**
   * Determines if the buff is applicable based on the provided parameters.
   * @param params - The parameters to check for applicability.
   * @returns `true` if the buff should be applied, `false` otherwise.
   */
  applicable?: (params: BuffApplicableParams) => boolean;

  incompatible?: number[];
}

export const filterApplicableBuffs = ({
  buffs,
  isTwoHanding,
  weaponAttackResult,
  enemy,
  move,
}: Omit<BuffApplicableParams, "damageType"> & {
  buffs: BuffSelection;
}): BuffSelection => {
  // Deep clone the buffs object to avoid mutations
  const filteredBuffs: BuffSelection = {
    activeBuffs: {
      auraBuff: buffs.activeBuffs.auraBuff,
      bodyBuff: buffs.activeBuffs.bodyBuff,
      uniqueBuffs: [...(buffs.activeBuffs.uniqueBuffs || [])],
    },
    passiveBuffs: { ...buffs.passiveBuffs },
    talismanBuffs: { ...buffs.talismanBuffs },
    tearsBuffs: { ...buffs.tearsBuffs },
    debuff: buffs.debuff,
  };

  const damageType = move
    ? weaponAttackResult.weapon.physicalAttackAttributes[
        move as keyof DamageTypes
      ]
    : undefined;

  const filterBuffs = (
    buffs: Record<string, Buff | Buff[] | null>
  ): Record<string, Buff | Buff[] | null> => {
    const filtered: Record<string, Buff | Buff[] | null> = {};
    for (const key in buffs) {
      const buff = buffs[key];
      if (Array.isArray(buff)) {
        // Handle arrays of buffs (e.g., uniqueBuffs)
        const filteredArray = buff.filter(
          (b) =>
            !b.applicable ||
            b.applicable({
              weaponAttackResult,
              isTwoHanding,
              move,
              enemy,
              damageType,
            })
        );
        filtered[key] = filteredArray.length > 0 ? filteredArray : null;
      } else if (
        buff &&
        buff.applicable &&
        !buff.applicable({
          weaponAttackResult,
          isTwoHanding,
          move,
          enemy,
          damageType,
        })
      ) {
        console.log("Buff not applicable", buff.name, move);
        filtered[key] = null;
      } else {
        filtered[key] = buff;
      }
    }
    return filtered;
  };

  // Filter passive buffs
  filteredBuffs.passiveBuffs = filterBuffs(
    filteredBuffs.passiveBuffs
  ) as BuffSelection["passiveBuffs"];

  // Filter active buffs
  filteredBuffs.activeBuffs = {
    ...filterBuffs({
      ...filteredBuffs.activeBuffs,
      uniqueBuffs: filteredBuffs.activeBuffs.uniqueBuffs,
    }),
    // Ensure uniqueBuffs is an array
    uniqueBuffs: filteredBuffs.activeBuffs.uniqueBuffs,
  } as BuffSelection["activeBuffs"];

  // Collect all other buff ids except for the unique buffs

  // Filter unique buffs separately if needed
  if (filteredBuffs.activeBuffs.uniqueBuffs) {
    filteredBuffs.activeBuffs.uniqueBuffs =
      filteredBuffs.activeBuffs.uniqueBuffs.filter(
        (buff) =>
          !buff.applicable ||
          buff.applicable({ weaponAttackResult, isTwoHanding, move })
      );
    if (filteredBuffs.activeBuffs.uniqueBuffs.length === 0) {
      filteredBuffs.activeBuffs.uniqueBuffs = [];
    }
  }

  // Filter talisman buffs
  filteredBuffs.talismanBuffs = filterBuffs(
    filteredBuffs.talismanBuffs
  ) as BuffSelection["talismanBuffs"];

  // Filter tears buffs
  filteredBuffs.tearsBuffs = filterBuffs(
    filteredBuffs.tearsBuffs
  ) as BuffSelection["tearsBuffs"];

  // Filter debuff
  if (
    filteredBuffs.debuff &&
    filteredBuffs.debuff.applicable &&
    !filteredBuffs.debuff.applicable({ weaponAttackResult, isTwoHanding, move })
  ) {
    filteredBuffs.debuff = null;
  }

  return filteredBuffs;
};

const applyBuffMultiplier = (
  weaponAttackResult: WeaponAttackResult,
  multipliers: Multiplier,
  effectType: AttackPowerType | "All damage",
  isEnemyDamage: boolean = false
) => {
  const attackPower =
    weaponAttackResult[isEnemyDamage ? "enemyDamages" : "attackPower"];

  if (attackPower == null) return;

  if (multipliers.stance !== 1) {
    Object.keys(weaponAttackResult.weapon.poiseDamage).forEach((key) => {
      weaponAttackResult.weapon.poiseDamage[
        key as keyof typeof weaponAttackResult.weapon.poiseDamage
      ]! *= multipliers.stance;
    });
  }

  if (effectType === "All damage") {
    for (const damageType of Object.keys(
      attackPower
    ) as unknown as AttackPowerType[]) {
      if (!attackPower[damageType]) continue;

      if (typeof attackPower[damageType] === "number") {
        attackPower[damageType] *= multipliers.damage;
      } else {
        attackPower[damageType].scaled *= multipliers.damage;
        attackPower[damageType].total *= multipliers.damage;
        attackPower[damageType].weapon *= multipliers.damage;
      }
    }
  } else {
    if (!attackPower[effectType]) return;

    if (typeof attackPower[effectType] === "number") {
      attackPower[effectType] *= multipliers.damage;
    } else {
      attackPower[effectType].scaled *= multipliers.damage;
      attackPower[effectType].weapon *= multipliers.damage;
      attackPower[effectType].total *= multipliers.damage;
    }
  }

  return attackPower;
};

export const applyBuffs = (
  buffsSelection: BuffSelection,
  weaponAttackResult: WeaponAttackResult,
  isDamageOnEnemy: boolean = false,
  move?: string
) => {
  const { activeBuffs, debuff, tearsBuffs, passiveBuffs, talismanBuffs } =
    buffsSelection;
  const attackResultCopy = structuredClone(weaponAttackResult);
  const attackPower =
    attackResultCopy[isDamageOnEnemy ? "enemyDamages" : "attackPower"];

  if (attackPower == null) return attackResultCopy;

  const allBuffs = [
    activeBuffs.auraBuff,
    activeBuffs.bodyBuff,
    ...activeBuffs.uniqueBuffs,
    tearsBuffs.tearOne,
    tearsBuffs.tearTwo,
    debuff,
    talismanBuffs.talismanOne,
    talismanBuffs.talismanTwo,
    talismanBuffs.talismanThree,
    talismanBuffs.talismanFour,
    passiveBuffs.armsPiece,
    passiveBuffs.legsPiece,
    passiveBuffs.headPiece,
    passiveBuffs.armsPiece,
  ].filter((buff) => buff !== null);

  for (const buff of allBuffs) {
    const { multipliers, effectType } = buff;
    const effectTypes = Array.isArray(effectType) ? effectType : [effectType];
    const multipliersArray = Array.isArray(multipliers)
      ? multipliers
      : [multipliers];

    effectTypes.forEach((type, index) => {
      const multiplier = multipliersArray[index];

      switch (type) {
        case AttackPowerType.PHYSICAL:
        case AttackPowerType.MAGIC:
        case AttackPowerType.FIRE:
        case AttackPowerType.LIGHTNING:
        case AttackPowerType.HOLY:
          if (attackPower[type]) {
            applyBuffMultiplier(
              attackResultCopy,
              multiplier,
              type,
              isDamageOnEnemy
            );
          }
          break;
        case "Weapon Skill - Magic":
          if (attackPower[AttackPowerType.MAGIC]) {
            applyBuffMultiplier(
              attackResultCopy,
              multiplier,
              AttackPowerType.MAGIC,
              isDamageOnEnemy
            );
          }
          break;
        default:
          applyBuffMultiplier(
            attackResultCopy,
            multiplier,
            "All damage",
            isDamageOnEnemy
          );
          break;
      }
    });
  }

  return attackResultCopy;
};
