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

export const allAttackDamageTypes = [
  "Azur's 1.1x",
  "Lusat's 1.1x",
  "Stonedigger",
  "Azur's 1.15x",
  "Lusat's 1.15x",
  "Glintblade",
  "Full Moon",
  "Carian Sword",
  "Night",
  "Lava",
  "Cold",
  "Crystalian",
  "Gravity",
  "Finger",
  "Thorn / Aberrant",
  "Death",
  "Spectral Light",
  "Aspects of the Crucible",
  "Golden Order Fundamentalist",
  "Golden Ring of Light",
  "Miquella's Light",
  "Dragon Cult",
  "Giants' Flame",
  "Messmer's Flame",
  "Godslayer",
  "Noble's Presence",
  "Bestial",
  "Bear Communion",
  "Frenzied Flame",
  "Dragon Communion",
  "Spiral",
  "Watchful / Vengeful Spirits",
  "Divine Bird Feathers",
  "Magma Attack",
  "Digger's Staff; 1.2x",
  "Carian Glintblade Staff; 1.15x",
  "Carian Regal Scepter; 1.1x",
  "Carian Glintstone Staff; 1.15x",
  "Staff of Loss; 1.3x",
  "Gelmir Glintstone Staff; 1.15x",
  "Crystal Staff; 1.1x",
  "Meteorite Staff; 1.3x",
  "Maternal Staff; 1.15x",
  "Staff of the Guilty; 1.2x",
  "Prince of Death's Staff; 1.1x",
  "Golden Order Seal; 1.1x",
  "Dryleaf Seal; 1.15x",
  "Gravel Stone Seal; 1.15x",
  "Giant's Seal; 1.2x",
  "Fire Knight's Seal; 1.15x",
  "Godslayer's Seal; 1.1x",
  "Clawmark Seal; 1.1x",
  "Frenzied Flame Seal; 1.2x",
  "Dragon Communion Seal; 1.15x",
  "Spiraltree Seal; 1.2x",
  "Charged Spell",
  "Breath Attack",
  "Roar Attack",
  "Storm Attack",
  "Weapon Skill",
  "Charged R2",
  "Charged Weapon Skill",
  "Final Light Attack in Chain",
  "Redmane Battle Skill",
  "Kicking / Stomping Skill",
  "Weapon-Throwing Attack",
  "Fire Knight Skill",
  "Dragon Cult Skill",
  "Blood Oath / Dynastic Skill",
  "Perfume Bottle",
  "Shriek of Milos",
  "Dancing Attack",
  "Bubble Skill",
  "2h Attack",

  // To be handled case by case
  "Jump Attack",
  "All damage",
  "Weapon Skill - Magic",
  "Guard Counter",
  "Guard Counter - Piercing",
  "Charged Attack",
  "Stamina Damage",
  "Stanced Attack",
  "Stance Damage",
  "Critical Damage",
  "Undead Damage",
] as const;

export type AttackType = (typeof allAttackDamageTypes)[number];
