import Papa from "papaparse";
import { maxSpecialUpgradeLevel } from "./uiUtils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Weapon } from "./data/weapon";
import { calculateWeaponDamage } from "./calc/damage";
import { Character } from "@/hooks/useCharacter";
import { ChartData } from "@/components/ui/chart";

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

// Create a type where if isConsisentLevels is true, the levelsArr is an array of numbers
// Otherwise, it is an array of [regularLevel, specialLevel, label] tuples
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
  isCharacterTwoHanding: boolean = false
) => {
  const maxWeaponLevels = selectedWeapons.map(
    (weapon) => weapon.maxUpgradeLevel
  );

  const { isConsistentLevels, levelsArr } = <LevelsArray>(
    createLevelsArray(maxWeaponLevels)
  );

  const selectedWeaponsData = selectedWeapons.map((weapon) => ({
    label: `${weapon.weaponName}`,
    data: isConsistentLevels
      ? levelsArr.map((level) => {
          const damage = calculateWeaponDamage(
            character,
            weapon,
            level as number,
            isCharacterTwoHanding
          ).getAr;
          return {
            primary: level,
            secondary: damage,
          } as ChartData[0]["data"][0];
        })
      : (levelsArr as [number, number, string][]).map(
          ([regularLevel, specialLevel, label]) => {
            const isSpecialLevel =
              weapon.maxUpgradeLevel === maxSpecialUpgradeLevel;
            const damage = calculateWeaponDamage(
              character,
              weapon,
              isSpecialLevel ? specialLevel : regularLevel,
              isCharacterTwoHanding
            ).getAr;
            return {
              primary: label,
              secondary: damage,
            } as ChartData[0]["data"][0];
          }
        ),
  }));

  return selectedWeaponsData as ChartData;
};
