export const enum AttackPowerType {
  PHYSICAL = 0,
  MAGIC = 1,
  FIRE = 2,
  LIGHTNING = 3,
  HOLY = 4,

  POISON = 5,
  SCARLET_ROT = 6,
  BLEED = 7,
  FROST = 8,
  SLEEP = 9,
  MADNESS = 10,
  DEATH_BLIGHT = 11,
}

export const allDamageTypes = [
  AttackPowerType.PHYSICAL,
  AttackPowerType.MAGIC,
  AttackPowerType.FIRE,
  AttackPowerType.LIGHTNING,
  AttackPowerType.HOLY,
];

export const allStatusTypes = [
  AttackPowerType.POISON,
  AttackPowerType.SCARLET_ROT,
  AttackPowerType.BLEED,
  AttackPowerType.FROST,
  AttackPowerType.SLEEP,
  AttackPowerType.MADNESS,
  AttackPowerType.DEATH_BLIGHT,
];

export const allAttackPowerTypes = [...allDamageTypes, ...allStatusTypes];

export const getDamageTypeKey = (damageType: AttackPowerType) => {
  switch (damageType) {
    case AttackPowerType.PHYSICAL:
      return "Physical";
    case AttackPowerType.MAGIC:
      return "Magic";
    case AttackPowerType.FIRE:
      return "Fire";
    case AttackPowerType.LIGHTNING:
      return "Lightning";
    case AttackPowerType.HOLY:
      return "Holy";
    case AttackPowerType.POISON:
      return "Poison";
    case AttackPowerType.SCARLET_ROT:
      return "Scarlet Rot";
    case AttackPowerType.BLEED:
      return "Bleed";
    case AttackPowerType.FROST:
      return "Frost";
    case AttackPowerType.SLEEP:
      return "Sleep";
    case AttackPowerType.MADNESS:
      return "Madness";
    case AttackPowerType.DEATH_BLIGHT:
      return "Death Blight";
  }
};

export const isDamageType = (type: any): type is AttackPowerType =>
  allDamageTypes.includes(type as AttackPowerType);

export const isStatusType = (type: any): type is AttackPowerType =>
  allStatusTypes.includes(type as AttackPowerType);
