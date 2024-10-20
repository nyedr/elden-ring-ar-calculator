import Papa from "papaparse";
import {
  getSpellScaling,
  getTotalDamageAttackPower,
  getTotalEnemyDamage,
  maxSpecialUpgradeLevel,
} from "./uiUtils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DamageValues, MotionValues, Weapon } from "./data/weapon";
import { Character, getAttackAttributes } from "@/hooks/useCharacter";
import { ChartData, ChartItem } from "@/components/ui/chart";
import { Enemy } from "@/lib/data/enemy-data";
import {
  getWeaponAttack,
  calculateDamageAgainstEnemy,
} from "./calc/calculator";
import { BuffSelection } from "@/components/buffs-dialog";
import { Buff } from "./data/buffs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCSV = <T>(csv: string) => {
  return Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  }) as Papa.ParseResult<T>;
};

export async function fetchAndParseCSV(
  api_url: string,
  withoutHeaders: boolean = false
): Promise<any[]> {
  try {
    const response = await fetch(api_url);
    const csvData = await response.text();

    const lines = csvData.split("\n");
    const dataWithoutHeaders = lines.slice(1).join("\n");

    const results = Papa.parse(withoutHeaders ? dataWithoutHeaders : csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (results.errors.length > 0) {
      console.error("Errors parsing the CSV file:", results.errors, results);
    }

    return results.data;
  } catch (error) {
    console.error("Error fetching the CSV file:", error);
    return [];
  }
}

export const mapToObject = <K extends string | number, V>(
  map: Map<K, V>
): Record<K, V> => {
  const obj: Record<K, V> = {} as Record<K, V>;

  map.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
};

export const mapToEntries = <K extends string | number, V>(
  map: Map<K, V>
): [K, V][] => {
  const entries: [K, V][] = [];

  map.forEach((value, key) => {
    entries.push([key, value]);
  });

  return entries;
};

export function getEnumKeyByEnumValue<
  TEnumKey extends string,
  TEnumVal extends string | number
>(myEnum: { [key in TEnumKey]: TEnumVal }, enumValue: TEnumVal): string {
  const keys = (Object.keys(myEnum) as TEnumKey[]).filter(
    (x) => myEnum[x] === enumValue
  );
  return keys.length > 0 ? keys[0] : "";
}

export const specialAndRegularLevelsDict = [
  [0, 0, "+0 / +0"],
  [1, 0, "+1 / +0"],
  [2, 1, "+2 / +1"],
  [3, 1, "+3 / +1"],
  [4, 1, "+4 / +1"],
  [5, 2, "+5 / +2"],
  [6, 2, "+6 / +2"],
  [7, 3, "+7 / +3"],
  [8, 3, "+8 / +3"],
  [9, 3, "+9 / +3"],
  [10, 4, "+10 / +4"],
  [11, 4, "+11 / +4"],
  [12, 5, "+12 / +5"],
  [13, 5, "+13 / +5"],
  [14, 5, "+14 / +5"],
  [15, 6, "+15 / +6"],
  [16, 6, "+16 / +6"],
  [17, 7, "+17 / +7"],
  [18, 7, "+18 / +7"],
  [19, 8, "+19 / +7"],
  [20, 8, "+20 / +8"],
  [21, 9, "+21 / +8"],
  [22, 9, "+22 / +9"],
  [23, 9, "+23 / +9"],
  [24, 10, "+24 / +9"],
  [25, 10, "+25 / +10"],
] as [number, number, string][];

export const createArrayFromNumber = (num: number) =>
  Array.from({ length: num }, (_, i) => i);

type LevelsArray =
  | { isConsistentLevels: true; levelsArr: number[] }
  | { isConsistentLevels: false; levelsArr: [number, number, string][] };

const createLevelsArray = (maxWeaponLevels: number[]): LevelsArray => {
  const isAllWeponsSpecial =
    maxWeaponLevels.filter((level) => level === maxSpecialUpgradeLevel)
      .length === maxWeaponLevels.length;
  const isAllWeaponsRegular =
    maxWeaponLevels.filter((level) => level === maxSpecialUpgradeLevel)
      .length === 0;

  if (isAllWeponsSpecial || isAllWeaponsRegular)
    return {
      isConsistentLevels: true,
      levelsArr: createArrayFromNumber(maxWeaponLevels[0] + 1),
    };

  return { isConsistentLevels: false, levelsArr: specialAndRegularLevelsDict };
};

export const getWeaponsLevelsData = (
  character: Character,
  selectedWeapons: Weapon[],
  enemyData: {
    selectedEnemy: Enemy | null;
    isDamageOnEnemy: boolean;
  }
): ChartItem[] => {
  const maxWeaponLevels = selectedWeapons.map(
    (weapon) => weapon.attack.length - 1
  );

  const { isConsistentLevels, levelsArr } = <LevelsArray>(
    createLevelsArray(maxWeaponLevels)
  );

  const isEnemyDamage =
    enemyData.isDamageOnEnemy && enemyData.selectedEnemy !== null;

  const selectedWeaponsData = selectedWeapons.map((weapon) => {
    if (isConsistentLevels) {
      return {
        label: `${weapon.name}`,
        data: levelsArr.map((level) => {
          let damage = getWeaponAttack({
            weapon,
            attributes: getAttackAttributes(character.attributes),
            twoHanding: character.isTwoHanding,
            upgradeLevel: Math.min(level, weapon.attack.length - 1),
          });

          if (isEnemyDamage && enemyData.selectedEnemy) {
            damage = calculateDamageAgainstEnemy(
              damage,
              enemyData.selectedEnemy
            );
          }

          const totalDamage =
            isEnemyDamage && damage.enemyDamages !== undefined
              ? getTotalEnemyDamage(damage.enemyDamages) ?? 0
              : getTotalDamageAttackPower(damage.attackPower);

          return {
            primary: level,
            secondary: Math.floor(
              weapon.incantationTool || weapon.sorceryTool
                ? getSpellScaling(weapon, damage.spellScaling)
                : totalDamage
            ),
          } as ChartData[0]["data"][0];
        }),
      };
    } else {
      return {
        label: `${weapon.name}`,
        data: (levelsArr as [number, number, string][]).map(
          ([regularLevel, specialLevel, label]) => {
            const isSpecialLevel =
              weapon.attack.length - 1 === maxSpecialUpgradeLevel;

            let damage = getWeaponAttack({
              weapon,
              attributes: getAttackAttributes(character.attributes),
              twoHanding: character.isTwoHanding,
              upgradeLevel: isSpecialLevel ? specialLevel : regularLevel,
            });

            if (isEnemyDamage) {
              damage = calculateDamageAgainstEnemy(
                damage,
                enemyData.selectedEnemy!
              );
            }

            const totalDamage =
              isEnemyDamage && damage.enemyDamages !== undefined
                ? getTotalEnemyDamage(damage.enemyDamages) ?? 0
                : getTotalDamageAttackPower(damage.attackPower);

            return {
              primary: label,
              secondary: Math.floor(
                weapon.incantationTool || weapon.sorceryTool
                  ? getSpellScaling(weapon, damage.spellScaling)
                  : totalDamage
              ),
            } as ChartData[0]["data"][0];
          }
        ),
      };
    }
  });

  return selectedWeaponsData as ChartData;
};

export const numberWithCommas = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const removeDuplicateNames = (arr: any[]) => {
  const seenNames = new Set();

  return arr.filter((item) => {
    if (seenNames.has(item.name)) {
      return false;
    } else {
      seenNames.add(item.name);
      return true;
    }
  });
};

export const parseValue = (poiseDamage: string | null) => {
  if (!poiseDamage) {
    return null;
  }

  if (poiseDamage.includes("+")) {
    return poiseDamage
      .split(" + ")
      .reduce((acc, val) => acc + parseInt(val), 0);
  }

  return parseInt(poiseDamage);
};

export function getOptimalPoiseBrakeSequence(
  poiseDamage: { [move: string]: number | null },
  targetPoise: number
): string[] {
  const entries: [string, number][] = Object.entries(poiseDamage).filter(
    ([move, damage]) => damage !== null
  ) as [string, number][]; // Convert the object to an array of [move, damage] pairs

  let closestSum: number | null = null;
  let bestCombination: string[] = [];

  // Recursive helper function
  function findClosest(currentMoves: string[], currentSum: number) {
    // If current sum meets or exceeds the targetPoise
    if (currentSum >= targetPoise) {
      // Check if this is the best combination found so far
      if (
        closestSum === null ||
        currentMoves.length < bestCombination.length ||
        (currentMoves.length === bestCombination.length &&
          currentSum < closestSum)
      ) {
        closestSum = currentSum;
        bestCombination = [...currentMoves];
      }
      return;
    }

    // Recurse through the entries (reusing moves)
    for (let [move, damage] of entries) {
      findClosest([...currentMoves, move], currentSum + damage);
    }
  }

  // Start recursion with empty combination and sum of 0
  findClosest([], 0);

  return bestCombination;
}

export const parseMove = (move: string): string => {
  const match = move.match(
    /(1h|2h) (R\d+|Charged R\d+|Running R\d+|Jumping R\d+|Guard Counter)|Riposte/
  );

  if (match) {
    if (match[0].includes("Guard Counter")) {
      return "Guard Counter";
    }
    if (match[0] === "Riposte") {
      return "Riposte";
    }
    return match[2];
  }

  return move;
};

export interface PoiseDamage {
  "1h R1 1": number | null;
  "1h R2 1": number | null;
  "1h Charged R2 1": number | null;
  "1h Running R1": number | null;
  "1h Running R2": number | null;
  "1h Jumping R1": number | null;
  "1h Jumping R2": number | null;
  "2h R1 1": number | null;
  "2h R2 1": number | null;
  "2h Charged R2 1": number | null;
  "2h Running R1": number | null;
  "2h Running R2": number | null;
  "2h Jumping R1": number | null;
  "2h Jumping R2": number | null;
  Backstab: number | null;
  Riposte: number | null;
  "Riposte (Large PvE)": number | null;
  "1h Guard Counter": number | null;
  "2h Guard Counter": number | null;
}

export const getPoiseValues = (
  damageValues: DamageValues | MotionValues | PoiseDamage,
  multiplier: number = 1
): PoiseDamage => {
  return {
    "1h R1 1": (parseValue(String(damageValues["1h R1 1"])) ?? 0) * multiplier,
    "1h R2 1": (parseValue(String(damageValues["1h R2 1"])) ?? 0) * multiplier,
    "1h Charged R2 1":
      (parseValue(String(damageValues["1h Charged R2 1"])) ?? 0) * multiplier,
    "1h Running R1":
      (parseValue(String(damageValues["1h Running R1"])) ?? 0) * multiplier,
    "1h Running R2":
      (parseValue(String(damageValues["1h Running R2"])) ?? 0) * multiplier,
    "1h Jumping R1":
      (parseValue(String(damageValues["1h Jumping R1"])) ?? 0) * multiplier,
    "1h Jumping R2":
      (parseValue(String(damageValues["1h Jumping R2"])) ?? 0) * multiplier,
    "2h R1 1": (parseValue(String(damageValues["2h R1 1"])) ?? 0) * multiplier,
    "2h R2 1": (parseValue(String(damageValues["2h R2 1"])) ?? 0) * multiplier,
    "2h Charged R2 1":
      (parseValue(String(damageValues["2h Charged R2 1"])) ?? 0) * multiplier,
    "2h Running R1":
      (parseValue(String(damageValues["2h Running R1"])) ?? 0) * multiplier,
    "2h Running R2":
      (parseValue(String(damageValues["2h Running R2"])) ?? 0) * multiplier,
    "2h Jumping R1":
      (parseValue(String(damageValues["2h Jumping R1"])) ?? 0) * multiplier,
    "2h Jumping R2":
      (parseValue(String(damageValues["2h Jumping R2"])) ?? 0) * multiplier,
    Backstab: (parseValue(String(damageValues["Backstab"])) ?? 0) * multiplier,
    Riposte: (parseValue(String(damageValues["Riposte"])) ?? 0) * multiplier,
    "Riposte (Large PvE)":
      (parseValue(String(damageValues["Riposte (Large PvE)"])) ?? 0) *
      multiplier,
    "1h Guard Counter":
      (parseValue(String(damageValues["1h Guard Counter"])) ?? 0) * multiplier,
    "2h Guard Counter":
      (parseValue(String(damageValues["2h Guard Counter"])) ?? 0) * multiplier,
  };
};

export const getDamageValues = (damageValues: DamageValues | MotionValues) => {
  return {
    "1h R1 1": damageValues["1h R1 1"],
    "1h R2 1": damageValues["1h R2 1"],
    "1h Charged R2 1": damageValues["1h Charged R2 1"],
    "1h Running R1": damageValues["1h Running R1"],
    "1h Running R2": damageValues["1h Running R2"],
    "1h Jumping R1": damageValues["1h Jumping R1"],
    "1h Jumping R2": damageValues["1h Jumping R2"],
    "2h R1 1": damageValues["2h R1 1"],
    "2h R2 1": damageValues["2h R2 1"],
    "2h Charged R2 1": damageValues["2h Charged R2 1"],
    "2h Running R1": damageValues["2h Running R1"],
    "2h Running R2": damageValues["2h Running R2"],
    "2h Jumping R1": damageValues["2h Jumping R1"],
    "2h Jumping R2": damageValues["2h Jumping R2"],
    Backstab: damageValues["Backstab"],
    Riposte: damageValues["Riposte"],
    "Riposte (Large PvE)": damageValues["Riposte (Large PvE)"],
    "1h Guard Counter": damageValues["1h Guard Counter"],
    "2h Guard Counter": damageValues["2h Guard Counter"],
  };
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
