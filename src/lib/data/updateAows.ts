const EXTRA_AOW_DATA_SPREADSHEET_ID =
  "1NVIQFIGTl-z0-gXEYVpCa1OnZwbBMTK8mm4P3tyO2hU";
const AOW_DATA_SPREADSHEET_ID = "1MIDoMVW6VhE-ucs-EE_Wq8sA2DbJVLv_p_RmwaHBIYs";

// AOW_DATA_SPREADSHEET_ID
const AshOfWarDataGID = "362983777";

// EXTRA_AOW_DATA_SPREADSHEET_ID
const ashOfWarCompabilityDataGID = "868965807";

interface RowAshOfWar {
  "Unique Skill Weapon": string;
  Name: string;
  "Phys MV": string;
  "Magic MV": string;
  "Fire MV": string;
  "Ltng MV": string;
  "Holy MV": string;
  "Status MV": string;
  "Weapon Buff MV": string;
  "Poise Dmg MV": string;

  // 253 = WeaponData: atkAttribute
  // 252 = WeaponData: atkAttribute2
  // Strike, Slash, Pierce, Standard
  PhysAtkAttribute: string;

  AtkPhys: number;
  AtkMag: number;
  AtkFire: number;
  AtkLtng: number;
  AtkHoly: number;
  AtkSuperArmor: number;

  // TRUE || FALSE strings
  isAddBaseAtk: string;

  // If the value is -1 that means there is no overwrite; this means the weapon's normal scaling is used
  overwriteAttackElementCorrectId: number | null;

  // TRUE || FALSE strings
  isDisableBothHandsAtkBonus: string;
}

interface ExtraAoWData {
  subCategory1: string | null;
  subCategory2: string | null;
  subCategory3: string | null;
  subCategory4: string | null;
}

interface AoWCompabilityData {}
