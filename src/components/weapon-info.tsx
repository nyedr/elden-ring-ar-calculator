import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { affinityOptions, weaponTypeLabels } from "@/lib/uiUtils";

import { MotionValues, Weapon } from "@/lib/data/weapon";

import { Character, getAttackAttributes } from "@/hooks/useCharacter";
import WeaponDamageTable from "./weapon-info-damage-table";
import WeaponScalingTable from "./weapon-info-scaling-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Slider } from "./ui/slider";
import WeaponExtraTable from "./weapon-info-extra-table";
import {
  adjustAttributesForTwoHanding,
  AttackPower,
  getWeaponAttack,
  WeaponAttackResult,
} from "@/lib/calc/calculator";
import { getDamageValues, parseMove, parseValue } from "@/lib/utils";
import { BuffSelection } from "./buffs-dialog";
import { applyBuffs, filterApplicableBuffs } from "@/lib/data/buffs";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { AttackPowerType } from "@/lib/data/attackPowerTypes";
import { InfoItem } from "./enemy-info";

export interface WeaponInfoProps {
  weapon: Weapon;
  character: Character;
  weaponAffinityOptions: Weapon[];
  setWeaponInfo: (weapon: Weapon) => void;
  buffSelection: BuffSelection;
}

export default function WeaponInfo({
  weapon,
  character,
  weaponAffinityOptions,
  setWeaponInfo,
  buffSelection,
}: WeaponInfoProps) {
  const weaponAttackOptions = useMemo(() => {
    const damageVals = getDamageValues(weapon.motionValues);
    return Object.keys(damageVals)
      .filter((key) => !!weapon.motionValues[key as keyof MotionValues])
      .map((key) => ({ label: key.slice(3), value: key }));
  }, [weapon.motionValues]);

  const weaponOptions = useMemo(
    () => ({
      oneHanded: weaponAttackOptions.filter(
        (option) =>
          option.value.startsWith("1h") ||
          ["Backstab", "Riposte"].includes(option.value)
      ),
      twoHanded: weaponAttackOptions.filter(
        (option) =>
          option.value.startsWith("2h") ||
          ["Backstab", "Riposte"].includes(option.value)
      ),
    }),
    [weaponAttackOptions]
  );

  const [weaponLevel, setWeaponLevel] = useState(weapon.attack.length - 1);
  const [isTwoHanding, setIsTwoHanding] = useState(false);
  const [weaponAttack, setWeaponAttack] = useState({
    oneHanded: weaponOptions.oneHanded[0]?.value ?? "",
    twoHanded: weaponOptions.twoHanded[0]?.value ?? "",
  });

  const damageType = isTwoHanding
    ? weaponAttack.twoHanded
    : weaponAttack.oneHanded;

  useEffect(() => {
    setWeaponLevel(weapon.attack.length - 1);
  }, [weapon]);

  const attackRating = useMemo(() => {
    return getWeaponAttack({
      attributes: getAttackAttributes(character.attributes),
      upgradeLevel: weaponLevel,
      weapon: weapon,
      twoHanding: isTwoHanding,
    });
  }, [character.attributes, weaponLevel, weapon, isTwoHanding]);

  const validBuffs = useMemo(() => {
    return filterApplicableBuffs({
      buffs: buffSelection,
      isTwoHanding,
      weaponAttackResult: attackRating,
      move: damageType,
    });
  }, [buffSelection, attackRating, isTwoHanding, damageType]);

  const weaponAttackResult = useMemo(() => {
    return applyBuffs(validBuffs, attackRating, false, damageType);
  }, [validBuffs, attackRating, damageType]);

  const motionValue = useMemo(() => {
    return (
      parseValue(weapon.motionValues[damageType as keyof MotionValues]) ?? 100
    );
  }, [weapon.motionValues, damageType]);

  const weaponAttackRating = useMemo(() => {
    return Object.keys(weaponAttackResult.attackPower).reduce(
      (acc, key) => {
        const attackKey = key as unknown as AttackPowerType;
        const damage = weaponAttackResult.attackPower[attackKey];

        if (damage == null || motionValue == null) return acc;

        const multiplier = motionValue / 100;

        return {
          ...acc,
          attackPower: {
            ...acc.attackPower,
            [attackKey]: {
              scaled: damage.scaled * multiplier,
              total: damage.total * multiplier,
              weapon: damage.weapon * multiplier,
            } as AttackPower,
          },
        };
      },
      { ...weaponAttackResult, attackPower: {} } as WeaponAttackResult
    );
  }, [weaponAttackResult, motionValue]);

  const handleWeaponChange = useCallback(
    (value: string) => {
      setWeaponAttack((prev) => ({
        ...prev,
        [isTwoHanding ? "twoHanded" : "oneHanded"]: value,
      }));
    },
    [isTwoHanding]
  );

  const handleSwitchChange = useCallback(() => {
    setIsTwoHanding((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <span className="gap-1 mb-5 text-xl font-bold text-primary">
        {weapon.name}
      </span>
      <div className="flex flex-col justify-center w-full">
        <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
          <InfoItem
            label="Weapon Type"
            value={weaponTypeLabels.get(weapon.weaponType) ?? "Unknown"}
          />
          <InfoItem label="DLC" value={weapon.dlc ? "Yes" : "No"} />
          <InfoItem
            label="Physical damage"
            value={weapon.physicalAttackAttributes["1h R1 1"]}
          />
          <div className="flex items-center justify-between w-full text-sm text-primary">
            <span className="text-base font-medium leading-6">Affinity</span>

            <Select
              disabled={weaponAffinityOptions.length === 1}
              onValueChange={(value) => {
                setWeaponInfo(
                  weaponAffinityOptions.find(
                    (weapon) => weapon.affinityId === +value
                  ) ?? weapon
                );
              }}
              defaultValue={String(weapon.affinityId) || "Default"}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Weapons Level" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectGroup>
                  {weaponAffinityOptions
                    .map((weapon) => weapon.affinityId)
                    .map((affinity) => {
                      const affinityOption = affinityOptions.get(affinity);

                      if (!affinityOption) {
                        return null;
                      }

                      return (
                        <SelectItem
                          key={affinityOption.text}
                          value={String(affinity)}
                        >
                          {affinityOption.text}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <InfoItem
            label="Hyper Armor Poise"
            value={weapon.hyperArmorPoise}
            tooltip={`Inherent poise of the weapon, only used during hyper armor
                    frames; some hyper armor events will use a fraction of this
                    value.`}
          />
        </div>

        <div className="flex items-center justify-between w-full gap-3 mt-5">
          <Select
            value={damageType}
            onValueChange={(value) => handleWeaponChange(value)}
          >
            <SelectTrigger className="max-w-fit min-w-[100px]">
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

        <WeaponDamageTable attackRating={weaponAttackRating} />
        <WeaponExtraTable attackRating={weaponAttackRating} />
        <WeaponScalingTable
          attributes={
            character.isTwoHanding
              ? adjustAttributesForTwoHanding({
                  attributes: getAttackAttributes(character.attributes),
                  weapon: weapon,
                  twoHanding: character.isTwoHanding,
                })
              : getAttackAttributes(character.attributes)
          }
          level={weaponLevel}
          weapon={weapon}
        />

        <div className="flex items-center w-full gap-3 my-6">
          <div className="flex items-center">
            <span className="p-2 px-3 text-center border-r-2 bg-secondary rounded-s-md border-secondary">
              Level
            </span>
            <span className="p-2 px-3 text-center border-l-2 bg-secondary rounded-e-md border-secondary min-w-24">
              {weaponLevel}
            </span>
          </div>
          <Slider
            value={[weaponLevel]}
            min={0}
            max={weapon.attack.length - 1}
            onValueChange={([value]) => setWeaponLevel(value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
