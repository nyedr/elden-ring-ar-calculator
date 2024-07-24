import { useState } from "react";
import { Weapon } from "../lib/data/weapon";

import weaponCSVData from "@/lib/data/csv/index";

import { parseCSV } from "@/lib/utils";
import {
  DetailedWeaponScalingData,
  WeaponPassive,
  WeaponData,
  WeaponScalingData,
  WeaponStats,
  WeaponIdCorrectGraph,
} from "@/lib/data/weapon-result-types";
import {
  damageAttributeKeys,
  DamageType,
  damageTypes,
  FlatPassive,
  flatPassives,
  passiveTypes,
  Scaling,
} from "@/lib/data/weapon-data";

const useWeapons = () => {
  const { weapons: weaponsData, weaponsCount: weaponsCountData } =
    setWeaponsData();

  const [weapons, setWeapons] = useState<Weapon[]>(
    weaponsData ?? ([] as Weapon[])
  );
  const [weaponsCount, setWeaponsCount] = useState(weaponsCountData);

  function setWeaponsData() {
    let { weapons, weaponsCount } = setWeaponExtraData();
    weapons = setWeaponLevelsData(weapons, weaponsCount);
    weapons = setWeaponScalingData(weapons, weaponsCount);

    return { weapons, weaponsCount };
  }

  function setWeaponExtraData() {
    const { data: extraData } = parseCSV<WeaponData>(
      weaponCSVData.extraDataCSV
    );

    const weaponsCount = extraData.length;

    const weapons = [] as Weapon[];

    for (let i = 0; i < weaponsCount; i++) {
      const weaponData = extraData[i];

      let weapon = new Weapon({
        name: weaponData["Weapon Name"],
        weaponName: weaponData.Name,
        affinity: weaponData.Affinity,
        weaponType: weaponData["Weapon Type"],
        maxUpgradeLevel: +weaponData["Max Upgrade"],
        physicalDamageType: weaponData["Physical Damage Type"],
        poiseAttack: +weaponData["Base Poise Attack"],
        requirements: {
          Arc: +weaponData["Required (Arc)"],
          Dex: +weaponData["Required (Dex)"],
          Fai: +weaponData["Required (Fai)"],
          Int: +weaponData["Required (Int)"],
          Str: +weaponData["Required (Str)"],
        },
        weight: +weaponData.Weight,
      });

      weapons.push({ ...weapons[i], ...weapon } as Weapon);
    }

    return { weapons, weaponsCount };
  }

  function setWeaponLevelsData(weapons: Weapon[], weaponsCount: number) {
    const { data: atttackData } = parseCSV<WeaponStats>(
      weaponCSVData.attackCSV
    );
    const { data: scalingData } = parseCSV<WeaponScalingData>(
      weaponCSVData.scalingCSV
    );
    const { data: passiveData } = parseCSV<WeaponPassive>(
      weaponCSVData.passiveCSV
    );

    for (let i = 0; i < weaponsCount; i++) {
      const weaponAttack = atttackData[i];
      const WeaponScalingData = scalingData[i];
      const weaponPassive = passiveData[i];

      let weapon = weapons[i];

      // TODO: Check if this is necessary
      // weapon.levels = [weapon.maxUpgradeLevel + 1];

      for (let l = 0; l <= weapon.maxUpgradeLevel; l++) {
        weapon.levels[l] = {
          ...weapon.levels[l],
          Physical: parseFloat(
            weaponAttack[`Phys +${l}` as keyof WeaponStats] as string
          ),
          Magic: parseFloat(
            weaponAttack[`Mag +${l}` as keyof WeaponStats] as string
          ),
          Fire: parseFloat(
            weaponAttack[`Fire +${l}` as keyof WeaponStats] as string
          ),
          Lightning: parseFloat(
            weaponAttack[`Ligh +${l}` as keyof WeaponStats] as string
          ),
          Holy: parseFloat(
            weaponAttack[`Holy +${l}` as keyof WeaponStats] as string
          ),
        };

        weapon.levels[l] = {
          ...weapon.levels[l],
          Str: parseFloat(
            WeaponScalingData[`Str +${l}` as keyof WeaponScalingData] as string
          ),
          Dex: parseFloat(
            WeaponScalingData[`Dex +${l}` as keyof WeaponScalingData] as string
          ),
          Int: parseFloat(
            WeaponScalingData[`Int +${l}` as keyof WeaponScalingData] as string
          ),
          Fai: parseFloat(
            WeaponScalingData[`Fai +${l}` as keyof WeaponScalingData] as string
          ),
          Arc: parseFloat(
            WeaponScalingData[`Arc +${l}` as keyof WeaponScalingData] as string
          ),
        };

        weapon = adjustWeaponsLevelsPassiveValues(weapon, l, weaponPassive);
      }

      weapons[i] = setPassiveEffects(weapon);
    }

    return weapons;
  }

  function adjustWeaponsLevelsPassiveValues(
    weapon: Weapon,
    level: number,
    weaponPassive: WeaponPassive
  ) {
    passiveTypes.forEach((passiveType) => {
      if (
        passiveType === "Scarlet Rot" &&
        weapon.name === "Cold Antspur Rapier"
      ) {
        let rot = 0;
        switch (level) {
          case 0:
            rot = 50;
            break;
          case 1:
            rot = 55;
            break;
          case 2:
            rot = 60;
            break;
          case 3:
            rot = 65;
            break;
          case 4:
            rot = 70;
            break;
          case 5:
            rot = 75;
            break;
          default:
            rot = 0; // Rot increases upto level 5 then drops to 0 just for this weapon !?!?
        }

        weapon.levels[level][passiveType] = rot;
      } else if (flatPassives.includes(passiveType as FlatPassive)) {
        weapon.levels[level][passiveType] = parseInt(
          weaponPassive[`${passiveType} +0` as keyof WeaponPassive] as string
        );
      } else {
        weapon.levels[level][passiveType] = parseInt(
          weaponPassive[
            `${passiveType} +${level}` as keyof WeaponPassive
          ] as string
        );
      }
    });

    return weapon;
  }

  function setPassiveEffects(weapon: Weapon) {
    weapon.passiveEffects = passiveTypes.filter((passiveType) => {
      return weapon.levels[0][passiveType] > 0;
    });

    return weapon;
  }

  function setWeaponScalingData(weapons: Weapon[], weaponsCount: number) {
    const { data: elementScalingFlags } = parseCSV<DetailedWeaponScalingData>(
      weaponCSVData.attackElementCorrectParamCSV
    );
    const { data: elementScalingCurves } = parseCSV<WeaponIdCorrectGraph>(
      weaponCSVData.calcCorrectGraphIDCSV
    );

    for (let i = 0; i < weaponsCount; i++) {
      const weaponElementScalingCurves = elementScalingCurves[i];
      const weaponElementScalingPattern =
        weaponElementScalingCurves[`AttackElementCorrect ID`];
      // do name check
      const weaponElementScalingFlags = elementScalingFlags.find(
        (elementFlags) => {
          return elementFlags["Row ID"] === weaponElementScalingPattern;
        }
      );

      if (!weaponElementScalingFlags) {
        console.error(
          `Could not find scaling flags for weapon ${weapons[i].name}`
        );
        continue;
      }

      let weapon = weapons[i];

      weapon.scaling = {} as Record<DamageType, Scaling>;

      console.log(weaponElementScalingFlags);

      damageTypes.forEach((element) => {
        weapon.scaling[element] = {
          ...weapon.scaling[element],
          curve: parseInt(weaponElementScalingCurves[element]),
        };

        weapon.scaling[element] = {
          ...weapon.scaling[element],
          Str: parseInt(
            weaponElementScalingFlags[
              `${element} Scaling: STR` as keyof DetailedWeaponScalingData
            ] as string
          ),
          Dex: parseInt(
            weaponElementScalingFlags[
              `${element} Scaling: DEX` as keyof DetailedWeaponScalingData
            ] as string
          ),
          Int: parseInt(
            weaponElementScalingFlags[
              `${element} Scaling: INT` as keyof DetailedWeaponScalingData
            ] as string
          ),
          Fai: parseInt(
            weaponElementScalingFlags[
              `${element} Scaling: FAI` as keyof DetailedWeaponScalingData
            ] as string
          ),
          Arc: parseInt(
            weaponElementScalingFlags[
              `${element} Scaling: ARC` as keyof DetailedWeaponScalingData
            ] as string
          ),
        };
      });

      weapons[i] = weapon;
    }

    return weapons;
  }

  const weaponsMap = new Map(weapons.map((weapon) => [weapon.name, weapon]));

  const find = (weaponName: string) => {
    return weaponsMap.get(weaponName);
  };

  const findAll = (weaponNames: string[]) => {
    return weaponNames.map((weaponName) => weaponsMap.get(weaponName));
  };

  return {
    weapons,
    weaponsCount,
    setWeaponsCount,
    find,
    findAll,
    setWeapons,
  };
};

export default useWeapons;
