import { fetchAndParseCSV } from "../utils";
import { DamageValues, damageValuesKeys, Weapon } from "./weapon";

const SPREADSHEET_ID = "1NVIQFIGTl-z0-gXEYVpCa1OnZwbBMTK8mm4P3tyO2hU";

const physicalAttackAttributeGID = 506566839;
const weaponPoiseDamageGID = 1512110930;
const extraWeaponDataGID = 809407445;
const weaponMotionValuesGID = 0;

export interface ExtraWeaponDataResult {
  // Weapon name; this is the join key
  Weapon: string;
  // Weapon's base poise damage
  saWeaponDamage: number;
  // Damage multiplier for "Void" enemies
  weakA_DamageRate: number;
  // Damage multiplier for "Those Who Live in Death" enemies
  weakB_DamageRate: number;
  // Damage multiplier for "Ancient Draconic" enemies
  weakC_DamageRate: number;
  // Damage multiplier for "Draconic" enemies
  weakD_DamageRate: number;
  /**
    Inherent poise of the weapon, only used during hyper armor frames; some hyper armor events will use a fraction of this value
    Multiply by 1000 to match poise as it is displayed for the in-game menu
   */
  toughnessCorrectRate: number;
}

interface WeaponValuesResult extends DamageValues {
  Weapon: string;
}

const getDamageValues = (data: Record<string, any>): DamageValues => {
  return [...damageValuesKeys].reduce((acc, damageKey) => {
    acc[damageKey as keyof DamageValues] = data[damageKey];
    return acc;
  }, {} as DamageValues);
};

export const updateWeaponData = async (
  weapons: Weapon[]
): Promise<Weapon[]> => {
  const gidsArray = [
    physicalAttackAttributeGID,
    weaponPoiseDamageGID,
    extraWeaponDataGID,
    weaponMotionValuesGID,
  ];

  const [
    physicalAttackAttributes,
    weaponPoiseDamages,
    extraWeaponData,
    weaponMotionValues,
  ] = await Promise.all(
    gidsArray.map(async (GID) => {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;
      return await fetchAndParseCSV(url, false);
    })
  );

  const weaponsDataMap = new Map<string, Record<string, any>>();

  for (const extraData of extraWeaponData as ExtraWeaponDataResult[]) {
    const weaponData = {
      poiseDamage: extraData.saWeaponDamage,
      enemyDamageMultipliers: {
        void: extraData.weakA_DamageRate,
        undead: extraData.weakB_DamageRate,
        ancientDraconic: extraData.weakC_DamageRate,
        draconic: extraData.weakD_DamageRate,
      },
      hyperArmorPoise: extraData.toughnessCorrectRate * 1000,
    };

    weaponsDataMap.set(extraData.Weapon, weaponData);
  }

  const damageValuesEntries = [
    [physicalAttackAttributes, "physicalAttackAttributes"],
    [weaponPoiseDamages, "poiseDamage"],
    [weaponMotionValues, "motionValues"],
  ] as const;

  for (const [data, key] of damageValuesEntries) {
    for (const result of data as WeaponValuesResult[]) {
      const weaponData = weaponsDataMap.get(result.Weapon);

      const motionValues = getDamageValues(result);

      weaponsDataMap.set(result.Weapon, {
        ...weaponData,
        [key]: motionValues,
      });
    }
  }

  return weapons.map((weapon) => {
    const extraData = weaponsDataMap.get(weapon.weaponName);
    if (!extraData) {
      return weapon;
    }

    return {
      ...weapon,
      ...extraData,
    };
  });
};
