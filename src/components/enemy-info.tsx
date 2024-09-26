import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { Enemy } from "@/lib/data/enemy-data";
import { cn, numberWithCommas } from "@/lib/utils";
import EnemyInfoTables from "./enemy-info-tables";
import EnemyDamage from "./enemy-damage";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Weapon } from "@/lib/data/weapon";
import { affinityOptions } from "@/lib/uiUtils";
import { WeaponAttackResult } from "@/lib/calc/calculator";
import Link from "next/link";
import { Icons } from "./icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { BuffSelection } from "./buffs-dialog";

export interface EnemyInfoProps {
  attackRating?: WeaponAttackResult;
  enemy: Enemy;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  weaponAffinityOptions?: Weapon[];
  setWeaponInfo?: (weapon: Weapon) => void;
  buffSelection?: BuffSelection;
}

export default function EnemyInfo({
  enemy,
  attackRating,
  isOpen,
  setIsOpen,
  weaponAffinityOptions,
  setWeaponInfo,
  buffSelection,
}: EnemyInfoProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        onXClick={() => setIsOpen(false)}
        className="flex flex-col max-w-[850px] sm:max-h-[90%] max-[800px]:px-[calc(10vw/2)] h-full sm:h-auto sm:overflow-y-auto overflow-y-scroll"
      >
        <DialogHeader className="mt-5 sm:mt-0">
          <DialogTitle className="text-2xl">{enemy.name}</DialogTitle>
          {attackRating && (
            <span className="text-xl font-semibold">
              <span>{attackRating.weapon.weaponName}</span>
              <Link
                target="_blank"
                className={cn(buttonVariants({ variant: "link" }), "p-0 m-0")}
                href={attackRating.weapon.url ?? "#"}
              >
                <Icons.externalLink className="w-4 h-4 ml-2" />
              </Link>
            </span>
          )}
        </DialogHeader>
        <div className="flex flex-col justify-center w-full">
          <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
            <DialogDescription className="flex justify-between w-full text-primary">
              <strong>Location</strong>
              <span className="text-right">{enemy.location}</span>
            </DialogDescription>
            <DialogDescription className="flex items-center justify-between w-full text-primary">
              <strong>Health</strong>
              <span>{numberWithCommas(enemy.healthPoints)}</span>
            </DialogDescription>
            <DialogDescription className="flex items-center justify-between w-full text-primary">
              <strong>Poise</strong>
              <span>{Math.floor(enemy.poise.base)}</span>
            </DialogDescription>
            <DialogDescription className="flex items-center justify-between w-full text-primary">
              <strong className="flex items-center">
                <span>Poise regen delay</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.circleHelp className="w-4 h-4 ml-2 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>
                      Enemy poice will start regenerating at a rate of 13 per
                      second after {enemy.poise.regenDelay} seconds of not being
                      hit.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </strong>
              <span>{enemy.poise.regenDelay}s</span>
            </DialogDescription>
            <DialogDescription className="flex items-center justify-between w-full text-primary">
              <strong className="relative flex items-center">
                <span>DLC Clear Health</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Icons.circleHelp className="w-4 h-4 ml-2 text-primary" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>
                      Health value used if Promised Consort Radahn was killed in
                      a previous NG cycle.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </strong>
              <span>
                {enemy.dlcClearHealthPoints
                  ? numberWithCommas(enemy.dlcClearHealthPoints)
                  : ""}
              </span>
            </DialogDescription>
            {attackRating && weaponAffinityOptions && setWeaponInfo && (
              <DialogDescription className="flex items-center justify-between w-full text-primary">
                <strong>Affinity</strong>

                <Select
                  disabled={weaponAffinityOptions.length === 1}
                  onValueChange={(value) => {
                    setWeaponInfo(
                      weaponAffinityOptions.find(
                        (weapon) => weapon.affinityId === +value
                      ) ?? attackRating.weapon
                    );
                  }}
                  defaultValue={
                    String(attackRating.weapon.affinityId) || "Default"
                  }
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
            )}
          </div>
        </div>

        <EnemyInfoTables attackRating={attackRating} enemy={enemy} />

        {attackRating?.enemyDamages && buffSelection && (
          <EnemyDamage
            buffSelection={buffSelection}
            attackRating={attackRating}
            enemy={enemy}
          />
        )}

        <h2 className="text-xl font-semibold">Drops</h2>
        <div className="flex flex-wrap items-center w-full gap-3">
          {enemy.drops.length > 0 &&
            enemy.drops.map((drop) => (
              <div
                key={drop.drop}
                className="flex flex-col p-2 px-3 rounded-md bg-secondary"
              >
                {drop.drop} {drop.quantity && `x${drop.quantity}`} (
                {drop.baseDropChance}%){" "}
                {drop.isAffectedByDiscovery && "(Discovery)"}
              </div>
            ))}
        </div>
        <DialogFooter className="mt-auto">
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
