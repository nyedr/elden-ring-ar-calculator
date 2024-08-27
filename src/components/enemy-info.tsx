import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { AttackRating } from "@/lib/data/attackRating";
import { Enemy } from "@/lib/data/enemy-data";
import { numberWithCommas } from "@/lib/utils";
import EnemyInfoTables from "./enemy-info-tables";
import EnemyDamage from "./enemy-damage";
import Tooltip from "./ui/tooltip";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Weapon } from "@/lib/data/weapon";

export interface EnemyInfoProps {
  attackRating?: AttackRating;
  enemy: Enemy;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  affinityOptions?: Weapon[];
  setWeaponInfo?: (weapon: Weapon) => void;
}

export default function EnemyInfo({
  enemy,
  attackRating,
  isOpen,
  setIsOpen,
  affinityOptions,
  setWeaponInfo,
}: EnemyInfoProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        onXClick={() => setIsOpen(false)}
        className="flex flex-col max-w-[850px] sm:max-h-[90%] max-[800px]:px-[calc(10vw/2)] h-full sm:h-auto sm:overflow-y-auto overflow-y-scroll"
      >
        <DialogHeader className="sm:mt-0 mt-5">
          <DialogTitle className="text-2xl">{enemy.name}</DialogTitle>
          {attackRating && (
            <span className="text-xl font-semibold">
              {attackRating?.weapon.weaponName}
            </span>
          )}{" "}
        </DialogHeader>
        <div className="w-full flex flex-col justify-center">
          <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
            <DialogDescription className="text-primary flex w-full  justify-between">
              <strong>Location</strong>
              <span className="text-right">{enemy.location}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Health</strong>
              <span>{numberWithCommas(enemy.healthPoints)}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>Poise</strong>
              <span>{Math.floor(enemy.poise.effective)}</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong className="flex items-center">
                <span>Poise regen delay</span>
                <Tooltip
                  text={`Enemy poice will start regenerating at a rate of 13 per
                      second after ${enemy.poise.regenDelay} seconds of not being
                      hit.`}
                />
              </strong>
              <span>{enemy.poise.regenDelay}s</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong className="flex items-center relative">
                <span>DLC Clear Health</span>
                <Tooltip
                  text="Health value used if Promised Consort Radahn was killed in
                      a previous NG cycle."
                />
              </strong>
              <span>
                {enemy.dlcClearHealthPoints
                  ? numberWithCommas(enemy.dlcClearHealthPoints)
                  : ""}
              </span>
            </DialogDescription>
            {attackRating && affinityOptions && setWeaponInfo && (
              <DialogDescription className="text-primary flex w-full items-center justify-between">
                <strong>Affinity</strong>

                <Select
                  disabled={affinityOptions.length === 1}
                  onValueChange={(value) => {
                    setWeaponInfo(
                      affinityOptions.find(
                        (weapon) =>
                          weapon.affinity === (value === "Default" ? "" : value)
                      ) ?? attackRating.weapon
                    );
                  }}
                  defaultValue={attackRating.weapon.affinity || "Default"}
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
            )}
          </div>
        </div>

        <EnemyInfoTables attackRating={attackRating} enemy={enemy} />

        {attackRating?.enemyAR && (
          <EnemyDamage attackRating={attackRating} enemy={enemy} />
        )}

        <h2 className="font-semibold text-xl">Drops</h2>
        <div className="flex flex-wrap items-center w-full gap-3">
          {enemy.drops.length > 0 &&
            enemy.drops.map((drop) => (
              <div
                key={drop.drop}
                className="p-2 px-3 bg-secondary rounded-md flex flex-col"
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
