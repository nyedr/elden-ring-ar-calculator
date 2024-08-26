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

export interface EnemyInfoProps {
  attackRating?: AttackRating;
  enemy: Enemy;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EnemyInfo({
  enemy,
  attackRating,
  isOpen,
  setIsOpen,
}: EnemyInfoProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        onXClick={() => setIsOpen(false)}
        className="flex flex-col max-w-[850px] sm:max-h-[90%] max-[800px]:px-[calc(10vw/2)] h-full sm:overflow-y-auto overflow-y-scroll"
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
              <strong>Poise regen delay</strong>
              <span>{enemy.poise.regenDelay}s</span>
            </DialogDescription>
            <DialogDescription className="text-primary flex w-full items-center justify-between">
              <strong>DLC Clear Health</strong>
              <span>
                {enemy.dlcClearHealthPoints
                  ? numberWithCommas(enemy.dlcClearHealthPoints)
                  : ""}
              </span>
            </DialogDescription>
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
        <DialogFooter>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
