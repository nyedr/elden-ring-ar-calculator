"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  allEnemyDamageTypes,
  damageTypeToImageName,
  Enemy,
} from "@/lib/data/enemy-data";
import { WeaponAttackResult } from "@/lib/calc/calculator";
import { allStatusTypes, getDamageTypeKey } from "@/lib/data/attackPowerTypes";
import { Icons } from "./icons";
import { damageTypeIcons } from "@/lib/uiUtils";

interface DamageNegationDefenceTableProps {
  enemy: Enemy;
}

export function DamageNegationDefenceTable({
  enemy,
}: DamageNegationDefenceTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-2xl font-semibold">Damage Negation & Defence</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32"></TableHead>
            {allEnemyDamageTypes.map((damageType, index) => (
              <TableHead key={index} className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    {damageTypeToImageName.hasOwnProperty(damageType) ? (
                      <Image
                        alt={damageType}
                        width={24}
                        height={24}
                        src={`/${
                          damageTypeToImageName[
                            damageType as keyof typeof damageTypeToImageName
                          ]
                        }.webp`}
                        className="mx-auto"
                      />
                    ) : (
                      String(damageType)
                    )}
                  </TooltipTrigger>
                  <TooltipContent>{damageType}</TooltipContent>
                </Tooltip>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Dmg Negation</TableCell>
            {allEnemyDamageTypes.map((damage, index) => (
              <TableCell key={index} className="text-center">
                {Math.floor(enemy.damageNegation[damage])}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Flat Defence</TableCell>
            {allEnemyDamageTypes.map((damage, index) => (
              <TableCell key={index} className="text-center">
                {Math.floor(+enemy.defence[damage])}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

interface StatusEffectsTableProps {
  enemy: Enemy;
  attackRating?: WeaponAttackResult;
}

export function StatusEffectsTable({
  enemy,
  attackRating,
}: StatusEffectsTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-2xl font-semibold">Status Effects</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32"></TableHead>
            {allStatusTypes.map((statusEffect, index) => (
              <TableHead key={index} className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    <Image
                      alt={getDamageTypeKey(statusEffect)}
                      width={24}
                      height={24}
                      src={damageTypeIcons.get(statusEffect) ?? ""}
                      className="mx-auto"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {getDamageTypeKey(statusEffect)}
                  </TooltipContent>
                </Tooltip>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Resistances</TableCell>
            {allStatusTypes.map((statusEffect, index) => {
              const statusEffectKey = getDamageTypeKey(statusEffect);
              const enemyResistance =
                enemy.resistances[
                  statusEffectKey as keyof typeof enemy.resistances
                ];

              return (
                <TableCell key={index} className="text-center">
                  {enemyResistance === "Immune" ? "Inf" : enemyResistance}
                </TableCell>
              );
            })}
          </TableRow>
          {!!attackRating && (
            <TableRow>
              <TableCell className="font-medium">Min hits</TableCell>
              {allStatusTypes.map((statusEffect, index) => {
                const statusEffectKey = getDamageTypeKey(statusEffect);
                const enemyResistance =
                  enemy.resistances[
                    statusEffectKey as keyof typeof enemy.resistances
                  ];
                const passive =
                  attackRating.attackPower[statusEffect]?.total || 0;

                return (
                  <TableCell key={index} className="text-center">
                    {enemyResistance === "Immune" || !passive ? (
                      <Icons.minus className="w-4 h-4 mx-auto text-muted-foreground" />
                    ) : (
                      Math.ceil(enemyResistance / passive)
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface EnemyInfoTablesProps {
  enemy: Enemy;
  attackRating?: WeaponAttackResult;
}

export default function EnemyInfoTables({
  enemy,
  attackRating,
}: EnemyInfoTablesProps) {
  return (
    <div className="flex flex-col w-full gap-3 my-5 space-y-6">
      <DamageNegationDefenceTable enemy={enemy} />
      <StatusEffectsTable enemy={enemy} attackRating={attackRating} />
    </div>
  );
}
