import weaponCSVData from "@/lib/data/csv/weapons/index";

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
  DamageType,
  allSimplifiedDamageTypes,
  FlatPassive,
  flatPassives,
  allStatusEffects,
  Scaling,
} from "@/lib/data/weapon-data";
import { Weapon } from "./weapon";

// TODO: Get motion values and add them to the weapon data
// TODO: Get poise values and add them to the weapon data

const getWeapons = () => {
  const { weapons: weaponsData, weaponsCount: weaponsCountData } =
    setWeaponsData();

  const weapons: Weapon[] = weaponsData ?? ([] as Weapon[]);

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
        twoHandBonus: weaponData["2H Str Bonus"] === "Yes",
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

      for (let l = 0; l <= weapon.maxUpgradeLevel; l++) {
        weapon.levels[l] = {
          ...weapon.levels[l],
          [DamageType.Physical]: parseFloat(
            weaponAttack[`Phys +${l}` as keyof WeaponStats] as string
          ),
          [DamageType.Magic]: parseFloat(
            weaponAttack[`Mag +${l}` as keyof WeaponStats] as string
          ),
          [DamageType.Fire]: parseFloat(
            weaponAttack[`Fire +${l}` as keyof WeaponStats] as string
          ),
          [DamageType.Lightning]: parseFloat(
            weaponAttack[`Ligh +${l}` as keyof WeaponStats] as string
          ),
          [DamageType.Holy]: parseFloat(
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
    allStatusEffects.forEach((statusEffect) => {
      if (
        statusEffect === "Scarlet Rot" &&
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

        weapon.levels[level][statusEffect] = rot;
      } else if (flatPassives.includes(statusEffect as FlatPassive)) {
        weapon.levels[level][statusEffect] = parseInt(
          weaponPassive[`${statusEffect} +0` as keyof WeaponPassive] as string
        );
      } else {
        weapon.levels[level][statusEffect] = parseInt(
          weaponPassive[
            `${statusEffect} +${level}` as keyof WeaponPassive
          ] as string
        );
      }
    });

    return weapon;
  }

  function setPassiveEffects(weapon: Weapon) {
    weapon.statusEffects = allStatusEffects.filter((statusEffect) => {
      return weapon.levels[0][statusEffect] > 0;
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

      allSimplifiedDamageTypes.forEach((element) => {
        if (
          element === DamageType.Pierce ||
          element === DamageType.Slash ||
          element === DamageType.Strike
        )
          return;

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

  const weaponsMap = new Map(
    weapons.map((weapon) => [weapon.weaponName, weapon])
  );

  const findWeapon = (weaponName: string) => {
    return weaponsMap.get(weaponName);
  };

  const findAllWeapons = (weaponNames: string[]) => {
    return weaponNames.map((weaponName) => weaponsMap.get(weaponName));
  };

  return {
    weapons,
    weaponsCount: weapons.length,
    findWeapon,
    findAllWeapons,
  };
};

export default getWeapons;
