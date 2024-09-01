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
import { affinityOptions, weaponTypeLabels } from "@/lib/uiUtils";

import { Weapon } from "@/lib/data/weapon";

import { Character, getAttackAttributes } from "@/hooks/useCharacter";
import { Button, buttonVariants } from "./ui/button";
import WeaponDamageTable from "./weapon-info-damage-table";
import WeaponScalingTable from "./weapon-info-scaling-table";
import { useEffect, useState } from "react";
import { Slider } from "./ui/slider";
import WeaponExtraTable from "./weapon-info-extra-table";
import {
  adjustAttributesForTwoHanding,
  getWeaponAttack,
} from "@/lib/calc/calculator";
import Tooltip from "./ui/tooltip";
import { Icons } from "./icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface WeaponInfoProps {
  weapon: Weapon;
  character: Character;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  weaponAffinityOptions: Weapon[];
  setWeaponInfo: (weapon: Weapon) => void;
}

export default function WeaponInfo({
  weapon,
  character,
  isOpen,
  setIsOpen,
  weaponAffinityOptions,
  setWeaponInfo,
}: WeaponInfoProps) {
  const [weaponLevel, setWeaponLevel] = useState(weapon.attack.length - 1);
  useEffect(() => {
    setWeaponLevel(weapon.attack.length - 1);
  }, [weapon]);

  const weaponAttackRating = getWeaponAttack({
    attributes: getAttackAttributes(character.attributes),
    upgradeLevel: weaponLevel,
    weapon: weapon,
  });

  return (
    <Dialog open={isOpen}>
      <DialogContent
        onXClick={() => setIsOpen(false)}
        className="flex flex-col max-w-[850px] max-[800px]:px-[calc(10vw/2)] h-full sm:max-h-[90%] sm:overflow-y-auto overflow-y-scroll"
      >
        <DialogHeader className="sm:mt-0 mt-5">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span>{weapon.weaponName}</span>
            <Link
              target="_blank"
              className={cn(buttonVariants({ variant: "link" }), "p-0 m-0")}
              href={weapon.url ?? "#"}
            >
              <Icons.externalLink className="w-6 h-6 ml-2" />
            </Link>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col justify-center">
          <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Weapon Name</strong>
              <span>{weapon.name}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Weapon Type</strong>
              <span>{weaponTypeLabels.get(weapon.weaponType)}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>DLC</strong>
              <span>{weapon.dlc ? "Yes" : "No"}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Physical damage</strong>
              <span>{weapon.physicalAttackAttributes["1h R1 1"]}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Affinity</strong>

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
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong className="flex items-center">
                <span>Hyper Armor Poise</span>
                <Tooltip text="Inherent poise of the weapon, only used during hyper armor frames; some hyper armor events will use a fraction of this value." />
              </strong>
              <span>{weapon.hyperArmorPoise}</span>
            </DialogDescription>
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
              max={weapon.attack.length - 1}
              onValueChange={([value]) => setWeaponLevel(value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
