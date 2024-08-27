import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Weapon } from "@/lib/data/weapon";
import {
  adjustAttributesForTwoHanding,
  calculateWeaponDamage,
} from "@/lib/calc/damage";
import { Character } from "@/hooks/useCharacter";
import { Button } from "./ui/button";
import WeaponDamageTable from "./weapon-info-damage-table";
import WeaponScalingTable from "./weapon-info-scaling-table";
import { useEffect, useState } from "react";
import { Slider } from "./ui/slider";
import WeaponExtraTable from "./weapon-info-extra-table";

export interface WeaponInfoProps {
  weapon: Weapon;
  character: Character;
  isWeaponInfoOpen: boolean;
  setIsWeaponInfoOpen: (isOpen: boolean) => void;
  affinityOptions: Weapon[];
  setWeaponInfo: (weapon: Weapon) => void;
}

export default function WeaponInfo({
  weapon,
  character,
  setIsWeaponInfoOpen,
  isWeaponInfoOpen,
  affinityOptions,
  setWeaponInfo,
}: WeaponInfoProps) {
  const [weaponLevel, setWeaponLevel] = useState(weapon.maxUpgradeLevel);
  useEffect(() => {
    setWeaponLevel(weapon.maxUpgradeLevel);
  }, [weapon]);

  const weaponAttackRating = calculateWeaponDamage(
    character,
    weapon,
    weaponLevel > weapon.maxUpgradeLevel ? weapon.maxUpgradeLevel : weaponLevel
  );

  return (
    <Dialog open={isWeaponInfoOpen}>
      <DialogContent
        onXClick={() => setIsWeaponInfoOpen(false)}
        className="flex flex-col max-w-[850px] max-[800px]:px-[calc(10vw/2)] h-full sm:max-h-[90%] sm:overflow-y-auto overflow-y-scroll"
      >
        <DialogHeader className="sm:mt-0 mt-5">
          <DialogTitle className="text-2xl">{weapon.weaponName}</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col justify-center">
          <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Weapon Name</strong>
              <span>{weapon.name}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Weapon Type</strong>
              <span>{weapon.weaponType}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Weight</strong>
              <span>{weapon.weight}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Physical damage</strong>
              <span>{weapon.physicalDamageType}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Affinity</strong>

              <Select
                disabled={affinityOptions.length === 1}
                onValueChange={(value) => {
                  setWeaponInfo(
                    affinityOptions.find(
                      (weapon) =>
                        weapon.affinity === (value === "Default" ? "" : value)
                    ) ?? weapon
                  );
                }}
                defaultValue={weapon.affinity || "Default"}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Weapons Level" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectGroup>
                    {affinityOptions
                      .map((weapon) => weapon.affinity)
                      .map((affinity) => (
                        <SelectItem
                          key={affinity || "Default"}
                          value={affinity || "Default"}
                        >
                          {affinity || "Default"}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </DialogDescription>
          </div>
          <WeaponDamageTable attackRating={weaponAttackRating} />
          <WeaponExtraTable attackRating={weaponAttackRating} />
          <WeaponScalingTable
            characterAttributes={
              character.isTwoHanding
                ? adjustAttributesForTwoHanding({
                    attributes: character.attributes,
                    twoHandingBonus: true,
                  })
                : character.attributes
            }
            level={weaponLevel}
            weapon={weapon}
          />
          <div className="w-full flex items-center gap-3 my-6">
            <div className="flex items-center">
              <span className="bg-secondary p-2 px-3 rounded-s-md border-r-2 border-secondary text-center">
                Level
              </span>
              <span className="bg-secondary p-2 px-3 rounded-e-md border-l-2 border-secondary text-center min-w-24">
                {weaponLevel}
              </span>
            </div>
            <Slider
              value={[weaponLevel]}
              min={0}
              max={weapon.maxUpgradeLevel}
              onValueChange={([value]) => setWeaponLevel(value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={() => setIsWeaponInfoOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
