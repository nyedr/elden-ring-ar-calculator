import { rangedWeaponTypes } from "../../uiUtils";
import { AttackPowerType } from "../attackPowerTypes";
import { Attribute } from "../attributes";
import { Buff } from "../buffs";
import { WeaponType } from "../weaponTypes";

// TODO: Add applicable conditions for talismans with applicable: ({ move }) => false

export const talismanBuffs: Buff[] = [
  {
    id: 30,
    name: "Dagger Talisman",
    effectType: ["Critical Damage"],
    multipliers: [{ stance: 1, damage: 1.17, stamina: 1 }],
    applicable: ({ move }) => {
      // Applies to critical hits
      return move === "riposte" || move === "backstab";
    },
  },
  {
    id: 31,
    name: "Curved Sword Talisman",
    effectType: ["Guard Counter"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("guard counter") || false;
    },
  },
  // Increases damage by 1.45x with the final light attack in a chain
  // {
  //   id: 32,
  //   name: "Twinblade Talisman",
  //   effectType: ["Final Hit in Chain"],
  //   multipliers: [{ stance: 1, damage: 1.45, stamina: 1 }],
  //   applicable: ({ weaponAttackResult }) => {
  //     // Assuming we have a property indicating the final light attack in a chain
  //     return weaponAttackResult.isFinalLightAttackInChain || false;
  //   },
  // },
  {
    id: 33,
    name: "Axe Talisman",
    effectType: ["Charged Attack"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("charged") || false;
    },
  },
  // {
  //   id: 34,
  //   name: "Hammer Talisman",
  //   effectType: ["Stamina Damage"],
  //   multipliers: [{ stance: 1, damage: 1.4, stamina: 1 }],
  // },
  // Counter hit damage, only applies to piercing damage
  // TODO: This should only apply to piercing damage; Applied, to test.
  {
    id: 35,
    name: "Spear Talisman",
    effectType: ["Guard Counter - Piercing"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    applicable: ({ move, damageType }) => {
      return (
        (move?.toLowerCase().includes("guard counter") &&
          damageType === "Pierce") ||
        false
      );
    },
  },
  // Horseback attack damage
  // {
  //   id: 36,
  //   name: "Lance Talisman",
  //   effectType: ["All damage"],
  //   multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
  // },
  {
    id: 37,
    name: "Claw Talisman",
    effectType: ["Jump Attack"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("jump") || false;
    },
  },
  // All weapon damage
  {
    id: 38,
    name: "Two-Handed Sword Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    applicable: ({ isTwoHanding, weaponAttackResult }) => {
      const weaponType = weaponAttackResult.weapon.weaponType;
      const isRangedWeapon = rangedWeaponTypes.includes(weaponType);
      return isTwoHanding && !isRangedWeapon;
    },
  },
  // with rolling / backstep attacks
  {
    id: 39,
    name: "Retaliatory Crossed-Tree",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.17, stamina: 1 }],
    applicable: ({ move }) => {
      const moveType = move?.toLowerCase() || "";
      return moveType.includes("rolling") || moveType.includes("backstep");
    },
  },
  // dashing attacks
  {
    id: 40,
    name: "Lacerating Crossed-Tree",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("dashing attack") || false;
    },
  },
  // arrow / bolt attacks
  {
    id: 41,
    name: "Arrow's Sting Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      const weaponType = weaponAttackResult.weapon.weaponType;
      return rangedWeaponTypes.includes(weaponType);
    },
  },
  // Arrow's Soaring Sting Talisman (ID 42)
  {
    id: 42,
    name: "Arrow's Soaring Sting Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.08, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      const weaponType = weaponAttackResult.weapon.weaponType;
      return rangedWeaponTypes.includes(weaponType);
    },
  },
  // Sharpshot Talisman (ID 43)
  {
    id: 43,
    name: "Sharpshot Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.12, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      const weaponType = weaponAttackResult.weapon.weaponType;
      return rangedWeaponTypes.includes(weaponType);
    },
  },
  // Graven-School Talisman (ID 44)
  {
    id: 44,
    name: "Graven-School Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.weapon.sorceryTool || false;
    },
  },
  // Graven-Mass Talisman (ID 45)
  {
    id: 45,
    name: "Graven-Mass Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.08, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.weapon.sorceryTool || false;
    },
  },
  // Faithful's Canvas Talisman (ID 46)
  {
    id: 46,
    name: "Faithful's Canvas Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.weapon.incantationTool || false;
    },
  },
  // Flock's Canvas Talisman (ID 47)
  {
    id: 47,
    name: "Flock's Canvas Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.08, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.weapon.incantationTool || false;
    },
  },
  {
    id: 48,
    name: "Roar Medallion",
    effectType: ["Roar Attack", "Shriek of Milos", "Breath Attack"],
    multipliers: [
      { stance: 1, damage: 1.15, stamina: 1 },
      { stance: 1, damage: 1.15, stamina: 1 },
      { stance: 1, damage: 1.1, stamina: 1 },
    ],
    applicable: ({ move }) => false,
  },
  // Pot damage
  // {
  //   id: 49,
  //   name: "Companion Jar",
  //   effectType: ["All damage"],
  //   multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
  // },
  // Perfumer's Talisman (ID 50)
  {
    id: 50,
    name: "Perfumer's Talisman",
    effectType: ["Perfume Bottle"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.weapon.weaponType === WeaponType.PERFUME_BOTTLE;
    },
  },
  // Warrior Jar Shard (ID 51)
  {
    id: 51,
    name: "Warrior Jar Shard",
    effectType: ["Weapon Skill"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: ({ move }) => {
      return move === "weapon skill";
    },
  },
  // Shard of Alexander (ID 52)
  {
    id: 52,
    name: "Shard of Alexander",
    effectType: ["Weapon Skill"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    applicable: ({ move }) => {
      return move === "weapon skill";
    },
  },
  {
    id: 53,
    name: "Godfrey Icon",
    effectType: ["Charged Spell", "Charged Weapon Skill"],
    multipliers: [
      { stance: 1, damage: 1.15, stamina: 1 },
      { stance: 1, damage: 1.15, stamina: 1 },
    ],
    applicable: ({ move }) => false,
  },
  {
    id: 54,
    name: "Rellana's Cameo",
    effectType: ["Stanced Attack"],
    multipliers: [{ stance: 1, damage: 1.45, stamina: 1 }],
    applicable: ({ move }) => false,
  },
  {
    id: 55,
    name: "Shattered Stone Talisman",
    effectType: ["Kicking / Stomping Skill"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: ({ move }) => false,
  },
  {
    id: 56,
    name: "Smithing Talisman",
    effectType: ["Weapon-Throwing Attack"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: ({ move }) => false,
  },
  {
    id: 57,
    name: "Enraged Divine Beast",
    effectType: ["Storm Attack"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: ({ move }) => false,
  },
  {
    id: 58,
    name: "Talisman of the Dread",
    effectType: ["Magma Attack"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    applicable: ({ move }) => false,
  },
  {
    id: 59,
    name: "Magic Scorpion Charm",
    effectType: [AttackPowerType.MAGIC],
    multipliers: [{ stance: 1, damage: 1.12, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.attackPower[AttackPowerType.MAGIC] != null;
    },
  },
  {
    id: 60,
    name: "Fire Scorpion Charm",
    effectType: [AttackPowerType.FIRE],
    multipliers: [{ stance: 1, damage: 1.12, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.attackPower[AttackPowerType.FIRE] != null;
    },
  },
  {
    id: 61,
    name: "Lightning Scorpion Charm",
    effectType: [AttackPowerType.LIGHTNING],
    multipliers: [{ stance: 1, damage: 1.12, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.attackPower[AttackPowerType.LIGHTNING] != null;
    },
  },
  {
    id: 62,
    name: "Sacred Scorpion Charm",
    effectType: [AttackPowerType.HOLY],
    multipliers: [{ stance: 1, damage: 1.12, stamina: 1 }],
    applicable: ({ weaponAttackResult }) => {
      return weaponAttackResult.attackPower[AttackPowerType.HOLY] != null;
    },
  },
  {
    id: 63,
    name: "Red-Feathered Branchsword",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 64,
    name: "Ritual Sword Talisman",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    applicable: () => true,
  },
  // Increases damage by 1.03x /1.05x /1.1x /1.1x with continuous attacks
  {
    id: 65,
    name: "Winged Sword Insignia",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.03, stamina: 1 }],
    applicable: () => true,
  },
  // Increases damage by 1.06x /1.08x /1.13x /1.13x with continuous attacks
  {
    id: 66,
    name: "Rotten Winged Sword Insignia",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.06, stamina: 1 }],
    applicable: () => true,
  },
  // Increases damage by 1.04x /1.06x /1.11x /1.11x with continuous attacks and increases dexterity by 5
  {
    id: 67,
    name: "Millicent's Prosthesis",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    applicable: () => true,
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
    id: 72,
    name: "Blade of Mercy",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
  {
    id: 73,
    name: "Dried Bouquet",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    applicable: () => true,
  },
];

export interface Armor extends Buff {
  slot: "Head" | "Body" | "Arms" | "Legs";
  statIncreace: Partial<Record<Attribute, number>>;
}

export const headPiecesWithDamagePassives: Armor[] = [
  {
    id: 74,
    slot: "Head",
    name: "Black Dumpling",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 75,
    slot: "Head",
    name: "Mushroom Crown",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 76,
    slot: "Head",
    name: "Circlet of Light",
    effectType: ["Miquella's Light"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
    applicable: () => false,
  },
  {
    id: 77,
    slot: "Head",
    name: "Spellblade's Pointed Hat",
    effectType: ["Weapon Skill - Magic"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: ({ move, weaponAttackResult }) => {
      return (
        move === "weapon skill" &&
        weaponAttackResult.attackPower[AttackPowerType.MAGIC] != null
      );
    },
  },
  {
    id: 78,
    slot: "Head",
    name: "Alberich's Pointed Hat",
    effectType: ["Thorn / Aberrant"],
    multipliers: [{ stance: 1, damage: 1.06, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 79,
    slot: "Head",
    name: "Azur's Glintstone Crown",
    effectType: ["Azur's 1.1x", "Azur's 1.15x"],
    multipliers: [
      { stance: 1, damage: 1.1, stamina: 1 },
      { stance: 1, damage: 1.15, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 80,
    slot: "Head",
    name: "Lusat's Glintstone Crown",
    effectType: ["Lusat's 1.1x", "Lusat's 1.15x"],
    multipliers: [
      { stance: 1, damage: 1.1, stamina: 1 },
      { stance: 1, damage: 1.15, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 81,
    slot: "Head",
    name: "Snow Witch Hat",
    effectType: ["Cold"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 82,
    slot: "Head",
    name: "Radiant Gold Mask",
    effectType: ["Golden Order Fundamentalist"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 83,
    slot: "Head",
    name: "Wise Man's Mask",
    effectType: ["Blood Oath / Dynastic Skill"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 84,
    slot: "Head",
    name: "Envoy Crown",
    effectType: ["Bubble Skill"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 85,
    slot: "Head",
    name: "White Mask",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 86,
    slot: "Head",
    name: "Gravebird Helm",
    effectType: ["Spectral Light"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 87,
    slot: "Head",
    name: "Dancer's Hood",
    effectType: ["Dancing Attack"],
    multipliers: [{ stance: 1, damage: 1.025, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 88,
    slot: "Head",
    name: "Pelt of Ralva",
    effectType: ["Bear Communion"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 89,
    slot: "Head",
    name: "Messmer's Helm",
    effectType: ["Messmer's Flame", "Fire Knight Skill"],
    multipliers: [
      { stance: 1, damage: 1.03, stamina: 1 },
      { stance: 1, damage: 1.08, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 90,
    slot: "Head",
    name: "Winged Serpent Helm",
    effectType: ["Fire Knight Skill"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 91,
    slot: "Head",
    name: "Death Knight Helm",
    effectType: ["Dragon Cult Skill", "Dragon Cult"],
    multipliers: [
      { stance: 1, damage: 1.02, stamina: 1 },
      { stance: 1, damage: 1.02, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 92,
    slot: "Head",
    name: "Divine Beast Helm",
    effectType: ["Storm Attack"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {
      str: 3,
      dex: 3,
    },
  },
  {
    id: 93,
    slot: "Head",
    name: "Divine Bird Helm",
    effectType: ["Divine Bird Feathers"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 94,
    slot: "Head",
    name: "Rakshasa Helm",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 95,
    slot: "Head",
    name: "Crucible Axe Helm",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 96,
    slot: "Head",
    name: "Crucible Tree Helm",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 97,
    slot: "Head",
    name: "Crucible Hammer-Helm",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 98,
    slot: "Head",
    name: "Omen Helm",
    effectType: ["Shriek of Milos"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 99,
    slot: "Head",
    name: "Divine Beast Head",
    effectType: ["Storm Attack"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {
      str: 4,
      dex: 4,
    },
  },
];

export const bodyPiecesWithDamagePassives: Armor[] = [
  {
    id: 100,
    slot: "Body",
    name: "Braided Cord Robe",
    effectType: ["Watchful / Vengeful Spirits"],
    multipliers: [{ stance: 1, damage: 1.15, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 101,
    slot: "Body",
    name: "Spellblade's Traveling Attire",
    effectType: ["Weapon Skill - Magic"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: ({ move, weaponAttackResult }) => {
      return (
        move === "weapon skill" &&
        weaponAttackResult.attackPower[AttackPowerType.MAGIC] != null
      );
    },
  },
  {
    id: 102,
    slot: "Body",
    name: "Alberich's Robe",
    effectType: ["Thorn / Aberrant"],
    multipliers: [{ stance: 1, damage: 1.06, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 103,
    slot: "Body",
    name: "Finger Robe",
    effectType: ["Finger"],
    multipliers: [{ stance: 1, damage: 1.08, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 104,
    slot: "Body",
    name: "Godskin Noble Robe",
    effectType: ["Noble's Presence"],
    multipliers: [{ stance: 1, damage: 1.2, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 105,
    slot: "Body",
    name: "Ansbach's Attire",
    effectType: ["Blood Oath / Dynastic Skill"],
    multipliers: [{ stance: 1, damage: 1.03, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 106,
    slot: "Body",
    name: "Raptor's Black Feathers",
    effectType: ["Jump Attack"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("jump") || false;
    },
  },
  {
    id: 107,
    slot: "Body",
    name: "Gravebird's Blackquill Armor",
    effectType: ["Jump Attack"],
    multipliers: [{ stance: 1, damage: 1.1, stamina: 1 }],
    statIncreace: {},
    applicable: ({ move }) => {
      return move?.toLowerCase().includes("jump") || false;
    },
  },
  {
    id: 108,
    slot: "Body",
    name: "Dancer's Dress",
    effectType: ["Dancing Attack"],
    multipliers: [{ stance: 1, damage: 1.025, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 109,
    slot: "Body",
    name: "Fire Knight Armor",
    effectType: ["Messmer's Flame"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 110,
    slot: "Body",
    name: "Death Knight Armor",
    effectType: ["Dragon Cult Skill", "Dragon Cult"],
    multipliers: [
      { stance: 1, damage: 1.02, stamina: 1 },
      { stance: 1, damage: 1.02, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 112,
    slot: "Body",
    name: "Rakshasa Armor",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 113,
    slot: "Body",
    name: "Crucible Axe Armor",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 114,
    slot: "Body",
    name: "Crucible Tree Armor",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 115,
    slot: "Body",
    name: "Omen Armor",
    effectType: ["Shriek of Milos"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
];

export const armsPiecesWithDamagePassives: Armor[] = [
  {
    id: 116,
    slot: "Arms",
    name: "Omen Gauntlets",
    effectType: ["Shriek of Milos"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 117,
    slot: "Arms",
    name: "Spellblade's Gloves",
    effectType: ["Weapon Skill - Magic"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: ({ move, weaponAttackResult }) => {
      return (
        move === "weapon skill" &&
        weaponAttackResult.attackPower[AttackPowerType.MAGIC] != null
      );
    },
  },
  {
    id: 118,
    slot: "Arms",
    name: "Alberich's Bracers",
    effectType: ["Thorn / Aberrant"],
    multipliers: [{ stance: 1, damage: 1.06, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 119,
    slot: "Arms",
    name: "Ansbach's Manchettes",
    effectType: ["Blood Oath / Dynastic Skill"],
    multipliers: [{ stance: 1, damage: 1.03, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 120,
    slot: "Arms",
    name: "Dancer's Bracer",
    effectType: ["Dancing Attack"],
    multipliers: [{ stance: 1, damage: 1.025, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 121,
    slot: "Arms",
    name: "Death Knight Gauntlets",
    effectType: ["Dragon Cult Skill", "Dragon Cult"],
    multipliers: [
      { stance: 1, damage: 1.02, stamina: 1 },
      { stance: 1, damage: 1.02, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 122,
    slot: "Arms",
    name: "Rakshasa Gauntlets",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 123,
    slot: "Arms",
    name: "Crucible Gauntlets",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
];

export const legsPiecesWithDamagePassives: Armor[] = [
  {
    id: 124,
    slot: "Legs",
    name: "Spellblade's Trousers",
    effectType: ["Weapon Skill - Magic"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: ({ move, weaponAttackResult }) => {
      return (
        move === "weapon skill" &&
        weaponAttackResult.attackPower[AttackPowerType.MAGIC] != null
      );
    },
  },
  {
    id: 125,
    slot: "Legs",
    name: "Ansbach's Boots",
    effectType: ["Blood Oath / Dynastic Skill"],
    multipliers: [{ stance: 1, damage: 1.03, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 126,
    slot: "Legs",
    name: "Dancer's Trousers",
    effectType: ["Dancing Attack"],
    multipliers: [{ stance: 1, damage: 1.025, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 127,
    slot: "Legs",
    name: "Death Knight Greaves",
    effectType: ["Dragon Cult Skill", "Dragon Cult"],
    multipliers: [
      { stance: 1, damage: 1.02, stamina: 1 },
      { stance: 1, damage: 1.02, stamina: 1 },
    ],
    statIncreace: {},
  },
  {
    id: 128,
    slot: "Legs",
    name: "Divine Bird Warrior Greaves",
    effectType: ["Kicking / Stomping Skill"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 129,
    slot: "Legs",
    name: "Rakshasa Greaves",
    effectType: ["All damage"],
    multipliers: [{ stance: 1, damage: 1.02, stamina: 1 }],
    statIncreace: {},
    applicable: () => true,
  },
  {
    id: 130,
    slot: "Legs",
    name: "Crucible Greaves",
    effectType: ["Aspects of the Crucible"],
    multipliers: [{ stance: 1, damage: 1.04, stamina: 1 }],
    statIncreace: {},
  },
  {
    id: 131,
    slot: "Legs",
    name: "Omen Greaves",
    effectType: ["Shriek of Milos"],
    multipliers: [{ stance: 1, damage: 1.05, stamina: 1 }],
    statIncreace: {},
  },
];
