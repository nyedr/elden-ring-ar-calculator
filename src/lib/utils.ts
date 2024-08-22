import Papa from "papaparse";
import { maxSpecialUpgradeLevel } from "./uiUtils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Weapon } from "./data/weapon";
import { calculateEnemyDamage, calculateWeaponDamage } from "./calc/damage";
import { Character } from "@/hooks/useCharacter";
import { ChartData } from "@/components/ui/chart";
import { Enemy } from "@/lib/data/enemy-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCSV = <T>(csv: string) => {
  return Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  }) as Papa.ParseResult<T>;
};

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
) => {
  const maxWeaponLevels = selectedWeapons.map(
    (weapon) => weapon.maxUpgradeLevel
  );

  console.log(maxWeaponLevels);

  const { isConsistentLevels, levelsArr } = <LevelsArray>(
    createLevelsArray(maxWeaponLevels)
  );

  console.log(isConsistentLevels, levelsArr);

  const isEnemyDamage = enemyData.isDamageOnEnemy && enemyData.selectedEnemy;

  const selectedWeaponsData = selectedWeapons.map((weapon) => {
    if (isConsistentLevels) {
      return {
        label: `${weapon.weaponName}`,
        data: levelsArr.map((level) => {
          let damage = calculateWeaponDamage(
            character,
            weapon,
            level as number
          );

          if (isEnemyDamage) {
            damage = calculateEnemyDamage(damage, enemyData.selectedEnemy!);
          }

          const totalDamage = isEnemyDamage ? damage.enemyAR : damage.getAR;

          return {
            primary: level,
            secondary: damage.spellScaling || totalDamage,
          } as ChartData[0]["data"][0];
        }),
      };
    } else {
      return {
        label: `${weapon.weaponName}`,
        data: (levelsArr as [number, number, string][]).map(
          ([regularLevel, specialLevel, label]) => {
            const isSpecialLevel =
              weapon.maxUpgradeLevel === maxSpecialUpgradeLevel;
            let damage = calculateWeaponDamage(
              character,
              weapon,
              isSpecialLevel ? specialLevel : regularLevel
            );

            if (isEnemyDamage) {
              damage = calculateEnemyDamage(damage, enemyData.selectedEnemy!);
            }

            const totalDamage = isEnemyDamage ? damage.enemyAR : damage.getAR;

            console.log(
              weapon.maxUpgradeLevel,
              totalDamage,
              isSpecialLevel ? specialLevel : regularLevel
            );

            return {
              primary: label,
              secondary: damage.spellScaling || totalDamage,
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

// TODO!: Posise sequence is not optimal enough, refactor.

export const getOptimalPoiseBrakeSequence = (
  poiseDmg: Record<string, number | null>,
  poise: number
): string[] => {
  const moves = Object.entries(poiseDmg)
    .filter(([_, value]) => value !== null)
    .sort(([, a], [, b]) => (b as number) - (a as number));

  const dp: Record<number, [string[], number]> = {};
  for (let i = 0; i <= poise + 36; i++) {
    dp[i] = [[], Infinity];
  }
  dp[0] = [[], 0];

  const isValidSequence = (sequence: string[]): boolean => {
    const sequenceTracker: Record<string, number> = {};
    for (const move of sequence) {
      const match = move.match(/(1h|2h) (R\d+|Jumping|Running|Charged) (\d+)/);
      if (match) {
        const [, prefix, type, numStr] = match;
        const num = parseInt(numStr, 10);
        if (num > 1 && (sequenceTracker[`${prefix} ${type}`] || 0) < num - 1) {
          return false;
        }
        sequenceTracker[`${prefix} ${type}`] = num;
      }
    }
    return true;
  };

  for (const [move, damage] of moves) {
    for (
      let currentPoise = poise + 36;
      currentPoise >= damage!;
      currentPoise--
    ) {
      const [sequence, length] = dp[currentPoise - (damage as number)];
      if (length + 1 < dp[currentPoise][1]) {
        const newSequence = [...sequence, move];
        if (isValidSequence(newSequence)) {
          dp[currentPoise] = [newSequence, length + 1];
        }
      }
    }
  }

  let bestSequence: string[] = [];
  let bestPoise = Infinity;
  for (let p = poise; p <= poise + 36; p++) {
    if (dp[p][0].length > 0 && p < bestPoise) {
      bestSequence = dp[p][0];
      bestPoise = p;
    }
  }

  return bestSequence;
};

export const parseMove = (move: string): string => {
  const match = move.match(
    /(1h|2h) (R\d+|Charged R\d+|Running R\d+|Jumping R\d+)/
  );
  if (match) {
    return match[2];
  }
  return move;
};
