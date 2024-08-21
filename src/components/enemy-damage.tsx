import { calculateEnemyDamage } from "@/lib/calc/damage";
import { AttackRating } from "@/lib/data/attackRating";
import { Enemy } from "@/lib/data/enemy-data";
import {
  numberWithCommas,
  getOptimalPoiseBrakeSequence,
  parseMove,
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
import { DamageValues } from "@/lib/data/weapon-data";
import { Badge } from "./ui/badge";

interface EnemyDamageProps {
  attackRating: AttackRating;
  enemy: Enemy;
}

export default function EnemyDamage({ attackRating, enemy }: EnemyDamageProps) {
  const weaponAttackOptions = Object.keys(attackRating.weapon.motionValues)
    .filter(
      (key) => !!attackRating.weapon.motionValues[key as keyof DamageValues]
    )
    .map((key) => ({ label: key.slice(3), value: key }));
  const oneHandedOptions = weaponAttackOptions.filter((option) =>
    option.value.startsWith("1h")
  );
  const twoHandedOptions = weaponAttackOptions.filter((option) =>
    option.value.startsWith("2h")
  );
  const [isTwoHanding, setIsTwoHanding] = useState(false);
  const [weaponAttack, setWeaponAttack] = useState<{
    oneHanded: string;
    twoHanded: string;
  }>({
    oneHanded: oneHandedOptions[0].value,
    twoHanded: twoHandedOptions[0].value,
  });

  const oneHandedPoiseBreak = useMemo(
    () =>
      oneHandedOptions.reduce((obj, key) => {
        obj[key.value] =
          attackRating.weapon.poiseDmg[key.value as keyof DamageValues];
        return obj;
      }, {} as Record<string, number | null>),
    [oneHandedOptions, attackRating.weapon.poiseDmg]
  );

  const twoHandedPoiseBreak = useMemo(
    () =>
      twoHandedOptions.reduce((obj, key) => {
        obj[key.value] =
          attackRating.weapon.poiseDmg[key.value as keyof DamageValues];
        return obj;
      }, {} as Record<string, number | null>),
    [twoHandedOptions, attackRating.weapon.poiseDmg]
  );

  const optimalPoiseBreakSequence = useMemo(
    () =>
      getOptimalPoiseBrakeSequence(
        isTwoHanding ? twoHandedPoiseBreak : oneHandedPoiseBreak,
        enemy.poise.effective
      ),
    [
      isTwoHanding,
      twoHandedPoiseBreak,
      oneHandedPoiseBreak,
      enemy.poise.effective,
    ]
  );

  const enemyDamage = useMemo(
    () =>
      calculateEnemyDamage(
        attackRating,
        enemy,
        attackRating.weapon.motionValues[
          (isTwoHanding
            ? weaponAttack.twoHanded
            : weaponAttack.oneHanded) as keyof DamageValues
        ] ?? 100
      ).enemyTotalAr,
    [attackRating, enemy, isTwoHanding, weaponAttack]
  );

  const handleSwitchChange = useCallback(() => {
    setIsTwoHanding((prev) => !prev);
  }, []);

  if (!enemyDamage) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full flex justify-between items-center gap-3">
        <Select
          value={isTwoHanding ? weaponAttack.twoHanded : weaponAttack.oneHanded}
          onValueChange={(value) =>
            setWeaponAttack({
              ...weaponAttack,
              [isTwoHanding ? "twoHanded" : "oneHanded"]: value,
            })
          }
        >
          <SelectTrigger className="max-w-fit">
            <SelectValue placeholder="Weapons Level" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              {(isTwoHanding ? twoHandedOptions : oneHandedOptions).map(
                (option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                )
              )}
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

      <div className="w-full overflow-hidden h-4 rounded-md mt-2 bg-secondary">
        <div
          className={`h-full bg-red-700`}
          style={{
            width: `${(enemyDamage / enemy.healthPoints) * 100}%`,
          }}
        />
      </div>
      <div className="w-full flex items-center justify-between">
        <span>Hits to kill: {Math.ceil(enemy.healthPoints / enemyDamage)}</span>
        <span>
          {Math.floor(enemyDamage)} / {numberWithCommas(enemy.healthPoints)}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full">
        <span className="whitespace-nowrap font-semibold">
          Efficient poise break:
        </span>
        <div className="flex items-center gap-2 flex-wrap w-full">
          {optimalPoiseBreakSequence.map((move, index) => (
            <Badge variant="secondary" key={move + index} className="text-xs">
              {parseMove(move)}
            </Badge>
          ))}
        </div>
      </div>
      {/* {JSON.stringify(
        {
          input: {
            moves: isTwoHanding ? twoHandedPoiseBreak : oneHandedPoiseBreak,
            poise: enemy.poise.effective,
          },
          result: getOptimalPoiseBrakeSequence(
            isTwoHanding ? twoHandedPoiseBreak : oneHandedPoiseBreak,
            enemy.poise.effective
          ),
          total: getOptimalPoiseBrakeSequence(
            isTwoHanding ? twoHandedPoiseBreak : oneHandedPoiseBreak,
            enemy.poise.effective
          )
            .map((k) => attackRating.weapon.poiseDmg[k as keyof DamageValues])
            .reduce(
              // @ts-ignore
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ),
        },
        null,
        2
      )} */}
    </div>
  );
}