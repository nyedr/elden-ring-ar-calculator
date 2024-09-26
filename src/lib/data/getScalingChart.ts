import { AttackPowerType } from "./attackPowerTypes";
import { AffinityId } from "./weapon";

export const weaponStatGraph: Record<AffinityId, Record<number, number>> = {
  [AffinityId.STANDARD]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.HEAVY]: {
    [AttackPowerType.PHYSICAL]: 1,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.KEEN]: {
    [AttackPowerType.PHYSICAL]: 2,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.QUALITY]: {
    [AttackPowerType.PHYSICAL]: 8,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.FIRE]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 4,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.FLAME_ART]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 4,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.LIGHTNING]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 4,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.SACRED]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 4,
  },
  [AffinityId.MAGIC]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 4,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.COLD]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.POISON]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.BLOOD]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  [AffinityId.OCCULT]: {
    [AttackPowerType.PHYSICAL]: 7,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
  // TODO: Confirm this is correct
  [AffinityId.UNIQUE]: {
    [AttackPowerType.PHYSICAL]: 0,
    [AttackPowerType.MAGIC]: 0,
    [AttackPowerType.FIRE]: 0,
    [AttackPowerType.LIGHTNING]: 0,
    [AttackPowerType.HOLY]: 0,
  },
};
