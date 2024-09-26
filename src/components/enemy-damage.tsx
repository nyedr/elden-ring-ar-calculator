import { Enemy } from "@/lib/data/enemy-data";
import {
  numberWithCommas,
  getOptimalPoiseBrakeSequence,
  parseMove,
  getDamageValues,
  PoiseDamage,
  getPoiseValues,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState, useCallback } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

import { Badge } from "./ui/badge";
import {
  calculateDamageAgainstEnemy,
  WeaponAttackResult,
} from "@/lib/calc/calculator";
import { getTotalEnemyDamage } from "@/lib/uiUtils";
import { isDamageValuesKey, MotionValues } from "@/lib/data/weapon";
import { BuffSelection } from "./buffs-dialog";
import { applyBuffs } from "@/lib/data/buffs";

interface EnemyDamageProps {
  attackRating: WeaponAttackResult;
  enemy: Enemy;
  buffSelection: BuffSelection;
}

const HealthBar = ({
  enemyDamage,
  healthPoints,
}: {
  enemyDamage: WeaponAttackResult["enemyDamages"];
  healthPoints: number;
}) => {
  if (!enemyDamage) return null;

  return (
    <>
      <div className="w-full h-4 mt-2 overflow-hidden rounded-md bg-secondary">
        <div
          className={`h-full bg-red-700`}
          style={{
            width: `${
              (getTotalEnemyDamage(enemyDamage) / healthPoints) * 100
            }%`,
          }}
        ></div>
      </div>

      <div className="flex items-center justify-between w-full">
        <span>
          Hits to kill:{" "}
          {Math.ceil(healthPoints / getTotalEnemyDamage(enemyDamage))}
        </span>
        <span>
          {numberWithCommas(Math.floor(getTotalEnemyDamage(enemyDamage)))} /{" "}
          {numberWithCommas(healthPoints)}
        </span>
      </div>
    </>
  );
};

export default function EnemyDamage({
  attackRating,
  enemy,
  buffSelection,
}: EnemyDamageProps) {
  // Generate weapon attack options and categorize them into one-handed and two-handed.
  const weaponAttackOptions = useMemo(() => {
    const damageVals = getDamageValues(attackRating.weapon.motionValues);
    return Object.keys(damageVals)
      .filter(
        (key) => !!attackRating.weapon.motionValues[key as keyof MotionValues]
      )
      .map((key) => ({ label: key.slice(3), value: key }));
  }, [attackRating.weapon.motionValues]);

  const isEnemyABoss = enemy.name.includes("Boss");
  const riposteType = isEnemyABoss ? "Riposte (Large PvE)" : "Riposte";

  const weaponOptions = useMemo(
    () => ({
      oneHanded: weaponAttackOptions.filter(
        (option) =>
          option.value.startsWith("1h") ||
          ["Backstab", riposteType].includes(option.value)
      ),
      twoHanded: weaponAttackOptions.filter(
        (option) =>
          option.value.startsWith("2h") ||
          ["Backstab", riposteType].includes(option.value)
      ),
    }),
    [weaponAttackOptions, riposteType]
  );

  // Initialize state for two-handing and selected weapon attack
  const [isTwoHanding, setIsTwoHanding] = useState(false);
  const [weaponAttack, setWeaponAttack] = useState({
    oneHanded: weaponOptions.oneHanded[0]?.value ?? "",
    twoHanded: weaponOptions.twoHanded[0]?.value ?? "",
  });

  const damageType = isTwoHanding
    ? weaponAttack.twoHanded
    : weaponAttack.oneHanded;

  const validatedDamageType = isDamageValuesKey(damageType)
    ? damageType
    : "1h R1 1";

  const weaponAttackResult = useMemo(() => {
    const damageCalculation = calculateDamageAgainstEnemy(
      attackRating,
      enemy,
      validatedDamageType
    );
    return applyBuffs(
      buffSelection,
      {
        ...damageCalculation,
        weapon: {
          ...damageCalculation.weapon,
          // @ts-ignore
          poiseDamage: getPoiseValues(damageCalculation.weapon.poiseDamage),
        },
      },
      true,
      damageType
    );
  }, [attackRating, enemy, validatedDamageType, buffSelection, damageType]);

  const oneHandedPoiseDamages = useMemo(() => {
    const result: Record<string, number | null> = {};
    weaponOptions.oneHanded.forEach((option) => {
      result[option.value] =
        weaponAttackResult.weapon.poiseDamage[
          option.value as keyof PoiseDamage
        ] ?? null;
    });
    return result;
  }, [weaponAttackResult.weapon.poiseDamage, weaponOptions.oneHanded]);

  const twoHandedPoiseDamages = useMemo(() => {
    const result: Record<string, number | null> = {};
    weaponOptions.twoHanded.forEach((option) => {
      result[option.value] =
        weaponAttackResult.weapon.poiseDamage[
          option.value as keyof PoiseDamage
        ] ?? null;
    });
    return result;
  }, [weaponAttackResult.weapon.poiseDamage, weaponOptions.twoHanded]);

  const optimalPoiseBreakSequence = useMemo(() => {
    const validOneHandedPoiseDamages = Object.fromEntries(
      Object.entries(oneHandedPoiseDamages).filter(
        ([key, value]) => +(value ?? 0) !== 0 && !key.includes("Guard")
      )
    );

    const validTwoHandedPoiseDamages = Object.fromEntries(
      Object.entries(twoHandedPoiseDamages).filter(
        ([key, value]) => +(value ?? 0) !== 0 && !key.includes("Guard")
      )
    );

    const sequence = getOptimalPoiseBrakeSequence(
      isTwoHanding ? validOneHandedPoiseDamages : validTwoHandedPoiseDamages,
      enemy.poise.effective
    );

    return sequence;
  }, [
    isTwoHanding,
    oneHandedPoiseDamages,
    twoHandedPoiseDamages,
    enemy.poise.effective,
  ]);

  const handleSwitchChange = useCallback(() => {
    setIsTwoHanding((prev) => !prev);
  }, []);

  const handleWeaponChange = useCallback(
    (value: string) => {
      setWeaponAttack((prev) => ({
        ...prev,
        [isTwoHanding ? "twoHanded" : "oneHanded"]: value,
      }));
    },
    [isTwoHanding]
  );

  if (!weaponAttackResult.enemyDamages) return null;

  if (
    weaponOptions.oneHanded.length === 0 ||
    weaponOptions.twoHanded.length === 0
  ) {
    // Handling edge cases for specific weapon types with no attack options
    return (
      <HealthBar
        enemyDamage={weaponAttackResult.enemyDamages}
        healthPoints={enemy.healthPoints}
      />
    );
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center justify-between w-full gap-3">
        <Select
          value={damageType}
          onValueChange={(value) => handleWeaponChange(value)}
        >
          <SelectTrigger className="max-w-fit">
            <SelectValue placeholder="Select Attack" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              {(isTwoHanding
                ? weaponOptions.twoHanded
                : weaponOptions.oneHanded
              ).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {parseMove(option.value)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Label className="whitespace-nowrap" htmlFor="isTwoHanding">
            Two Handing
          </Label>
          <Switch
            checked={isTwoHanding}
            onCheckedChange={handleSwitchChange}
            id="isTwoHanding"
          />
        </div>
      </div>

      <HealthBar
        enemyDamage={weaponAttackResult.enemyDamages}
        healthPoints={enemy.healthPoints}
      />

      <div className="flex flex-col w-full gap-2 sm:items-center sm:flex-row">
        <span className="font-semibold whitespace-nowrap">
          Efficient poise break:
        </span>
        <div className="flex flex-wrap items-center w-full gap-2">
          {optimalPoiseBreakSequence.map((move, index) => (
            <Badge variant="secondary" key={move + index} className="text-xs">
              {parseMove(move)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
