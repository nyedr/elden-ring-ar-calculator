import { AttackPowerType } from "../attackPowerTypes";
import { Buff } from "../buffs";

export const bodyBuffs: Buff[] = [
  {
    name: "Exalted Flesh",
    effectType: [AttackPowerType.PHYSICAL],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 1,
  },
  {
    name: "Bloodboil Aromatic",
    effectType: [AttackPowerType.PHYSICAL],
    multipliers: [{ stance: 1, damage: 1.3, stamina: 1 }],
    id: 2,
  },
  {
    name: "Flame, Grant Me Strength",
    effectType: [AttackPowerType.PHYSICAL, AttackPowerType.FIRE],
    multipliers: [
      { stance: 1, damage: 1.2, stamina: 1 },
      { stance: 1, damage: 1.2, stamina: 1 },
    ],
    id: 3,
  },
  {
    name: "Howl of Shabriri",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.25, stamina: 1 }],
    id: 4,
  },
  {
    name: "Sacred Bloody Flesh",
    effectType: [AttackPowerType.PHYSICAL],
    multipliers: [{ stance: 1, damage: 1.07, stamina: 1 }],
    id: 5,
  },
  {
    name: "Light",
    effectType: [AttackPowerType.HOLY],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 1243,
  },
];

export const auraBuffs = [
  {
    name: "Uplifting Aromatic",
    effectType: [AttackPowerType.PHYSICAL],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    id: 6,
  },
  {
    name: "Golden Great Arrow",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.115, stamina: 1 }],
    id: 7,
  },
  {
    name: "Golden Vow (Incant)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    id: 8,
  },

  /** ???
     * Last Rites
     * Armaments gain 25 base Holy Damage
      Deal +100% damage to undead icon 40px Undead and prevents Skeletons from reviving
      Armaments are buffed 10% for all damage types (5% in PVP)
     */
  {
    name: "Rallying Standard",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 9,
  },

  {
    name: "Golden Vow (Ash of War)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.115, stamina: 1 }],
    id: 10,
  },

  // Poise damage +20%
  {
    name: "Stormhawk Deenh",
    effectType: [AttackPowerType.PHYSICAL],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 11,
  },
];

export const weaponBuffs = [];

export const uniqueBuffs: Buff[] = [
  {
    name: "Contagious Fury",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 12,
  },
  {
    name: "Terra Magica",
    effectType: [AttackPowerType.MAGIC],
    multipliers: [{ stance: 1, damage: 1.35, stamina: 1 }],
    id: 13,
  },
  // Also 20% more poise damage
  {
    name: "Stealth Attack (Enemy Unaware)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 14,
  },
  // Raining and Standing in Water stack
  {
    name: "Raining",
    effectType: [AttackPowerType.FIRE, AttackPowerType.LIGHTNING],
    multipliers: [
      { stance: 1, damage: 0.9, stamina: 1 },
      { stance: 1, damage: 1.1, stamina: 1 },
    ],
    id: 15,
  },
  {
    name: "Standing in Water",
    effectType: [AttackPowerType.FIRE, AttackPowerType.LIGHTNING],
    multipliers: [
      { stance: 1, damage: 0.9, stamina: 1 },
      { stance: 1, damage: 1.1, stamina: 1 },
    ],
    id: 16,
  },
  {
    name: "Oil Pot",
    effectType: [AttackPowerType.FIRE],
    multipliers: [{ stance: 1, damage: 1.5, stamina: 1 }],
    id: 255,
    applicable: ({ weaponAttackResult }) => {
      return !!weaponAttackResult.attackPower[AttackPowerType.FIRE];
    },
    incompatible: [256],
  },
  {
    name: "Heavy Oil (Doesn't stack with Oil)",
    effectType: [AttackPowerType.FIRE],
    multipliers: [{ stance: 1, damage: 1.65, stamina: 1 }],
    id: 256,
    applicable: ({ weaponAttackResult }) => {
      return !!weaponAttackResult.attackPower[AttackPowerType.FIRE];
    },
    incompatible: [255],
  },
  // TODO: This should buff all damage by 10% even without the enemy being undead
  {
    name: "Sacred Order (Offhand)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 2, stamina: 1 }],
    id: 453,
    applicable: ({ enemy }) => enemy?.types.undead || false,
  },
  {
    id: 68,
    name: "Kindred of Rot's Exultation",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 69,
    name: "Lord of Blood's Exultation",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 70,
    name: "Aged One's Exultation",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 71,
    name: "St. Trina's Smile",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 85,
    name: "White Mask",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 75,
    name: "Mushroom Crown",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 74,
    name: "Black Dumpling",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 231,
    name: "Poisoned Hand",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.075, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 231,
    name: "Madding Hand",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.075, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 232,
    name: "Knowledge Above All",
    effectType: [AttackPowerType.MAGIC, AttackPowerType.HOLY],
    multipliers: [
      { stance: 1, damage: 1.1, stamina: 1 },
      { stance: 1, damage: 1.1, stamina: 1 },
    ],
    applicable: () => true,
  },
  {
    id: 233,
    name: "Frostbite",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 234,
    name: "Counter Damage",
    effectType: [AttackPowerType.PHYSICAL],
    multipliers: [{ stance: 1, damage: 1.3, stamina: 1 }],
    applicable: ({ damageType }) => {
      return damageType === "Pierce" || false;
    },
  },
  {
    id: 235,
    name: "Flower Dragonbolt",
    effectType: [AttackPowerType.LIGHTNING],
    multipliers: [{ stance: 1, damage: 1.17, stamina: 1 }],
    applicable: () => true,
  },
];

export const tears: Buff[] = [
  {
    name: "Magic-Shrouding Cracked Tear",
    effectType: [AttackPowerType.MAGIC],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 17,
  },
  {
    name: "Flame-Shrouding Cracked Tear",
    effectType: [AttackPowerType.FIRE],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 18,
  },
  {
    name: "Lightning-Shrouding Cracked Tear",
    effectType: [AttackPowerType.LIGHTNING],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 19,
  },
  {
    name: "Holy-Shrouding Cracked Tear",
    effectType: [AttackPowerType.HOLY],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 20,
  },
  {
    name: "Thorny Cracked Tear (Hit 1)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.09, stamina: 1 }],
    id: 21,
  },
  {
    name: "Thorny Cracked Tear (Hit 2)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.13, stamina: 1 }],
    id: 21,
  },
  {
    name: "Thorny Cracked Tear (Hit 3)",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 21,
  },
  {
    name: "Bloodsucking Cracked Tear",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 22,
  },
  // TODO: Hardtears are being applied regardless of the move with enemy damages, test.
  {
    name: "Deflecting Hardtear (1 Deflect)",
    effectType: ["Guard Counter"],
    multipliers: [{ stance: 1.15, damage: 1.2, stamina: 1.2 }],
    id: 23,
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("guard") || false;
    },
  },
  {
    name: "Deflecting Hardtear (2 Deflect)",
    effectType: ["Guard Counter"],
    multipliers: [{ stance: 1.23, damage: 1.4, stamina: 1.4 }],
    id: 23,
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("guard") || false;
    },
  },
  {
    name: "Deflecting Hardtear (3 Deflect)",
    effectType: ["Guard Counter"],
    multipliers: [{ stance: 1.31, damage: 1.6, stamina: 1.6 }],
    id: 23,
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("guard") || false;
    },
  },
  {
    name: "Deflecting Hardtear (4 Deflect)",
    effectType: ["Guard Counter"],
    multipliers: [{ stance: 1.39, damage: 1.8, stamina: 1.8 }],
    id: 23,
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("guard") || false;
    },
  },
  {
    name: "Spiked Cracked Tear",
    effectType: ["Charged Attack"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    id: 111,
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("charged") || false;
    },
  },
  {
    name: "Stonebarb Cracked Tear",
    effectType: ["Stance Damage"],
    multipliers: [{ stance: 1.3, damage: 1, stamina: 1.3 }],
    id: 24,
  },
];

export const debuffs: Buff[] = [
  {
    name: "Shriek of Milos",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    id: 25,
  },
  {
    name: "Soul Stifler",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    id: 26,
  },
  {
    name: "Greyoll's Roar",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    id: 27,
  },
  {
    name: "Ranni's Dark Moon",
    effectType: [AttackPowerType.MAGIC],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    id: 28,
  },
  {
    name: "Rennala's Full Moon",
    effectType: [AttackPowerType.MAGIC],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    id: 29,
  },
];
