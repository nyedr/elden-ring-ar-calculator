import { Enemy } from "@/lib/data/enemy-data";
import { numberWithCommas } from "@/lib/utils";
import { StatusEffectsTable } from "./enemy-info-tables";
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
import { BuffSelection } from "./buffs-dialog";
import { InfoItem } from "./enemy-info";
import { Separator } from "./ui/separator";

export interface EnemyDamageInfoProps {
  attackRating: WeaponAttackResult;
  enemy: Enemy;
  weaponAffinityOptions?: Weapon[];
  setWeaponInfo: (weapon: Weapon) => void;
  buffSelection: BuffSelection;
}

export default function EnemyDamageInfo({
  enemy,
  attackRating,
  weaponAffinityOptions,
  setWeaponInfo,
  buffSelection,
}: EnemyDamageInfoProps) {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <span className="gap-1 mb-5 text-xl font-bold text-primary">
        {enemy.name}
      </span>
      <div className="flex flex-col justify-center w-full mb-2">
        <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
          <InfoItem label="Location" value={enemy.location} />
          <InfoItem
            label="Health"
            value={numberWithCommas(enemy.healthPoints)}
          />
          <InfoItem label="Poise" value={Math.floor(enemy.poise.base)} />
          <InfoItem
            label="Poise regen delay"
            value={`${enemy.poise.regenDelay}s`}
            tooltip={`Enemy poice will start regenerating at a rate of 13 per
                    second after ${enemy.poise.regenDelay} seconds of not being
                    hit.
                    `}
          />
          <InfoItem
            label="DLC Clear Health"
            value={
              enemy.dlcClearHealthPoints
                ? numberWithCommas(enemy.dlcClearHealthPoints)
                : ""
            }
            tooltip="Health value used if Promised Consort Radahn was killed in a previous NG cycle."
          />
          {weaponAffinityOptions && (
            <div className="flex items-center justify-between w-full text-sm text-primary">
              <span className="text-base font-medium leading-6">Affinity</span>

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
            </div>
          )}
        </div>
      </div>

      <StatusEffectsTable attackRating={attackRating} enemy={enemy} />

      <Separator className="w-full my-7 bg-secondary" />

      {attackRating?.enemyDamages && (
        <EnemyDamage
          buffSelection={buffSelection}
          attackRating={attackRating}
          enemy={enemy}
        />
      )}
      {/* <EnemyInfoTables attackRating={attackRating} enemy={enemy} /> */}
    </div>
  );
}
