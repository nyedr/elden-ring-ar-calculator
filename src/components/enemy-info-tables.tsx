import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  allEnemyDamageTypes,
  damageTypeToImageName,
  Enemy,
} from "@/lib/data/enemy-data";

import Image from "next/image";
import { WeaponAttackResult } from "@/lib/calc/calculator";
import { allStatusTypes, getDamageTypeKey } from "@/lib/data/attackPowerTypes";
import { Icons } from "./icons";
import { damageTypeIcons } from "@/lib/uiUtils";

interface EnemyInfoTablesProps {
  enemy: Enemy;
  attackRating?: WeaponAttackResult;
}

export default function EnemyInfoTables({
  enemy,
  attackRating,
}: EnemyInfoTablesProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <Table className="mt-5">
        <TableHeader className="border-b-2 border-secondary">
          <TableRow>
            <TableHead className="sm:w-32"></TableHead>
            {allEnemyDamageTypes.map((damageType, index) => (
              <TableHead className="text-center" key={index}>
                {damageTypeToImageName.hasOwnProperty(damageType) ? (
                  <Image
                    alt={damageType}
                    title={damageType}
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
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Dmg Negation</TableCell>
            {allEnemyDamageTypes.map((damage, index) => (
              <TableCell className="text-center" key={index}>
                {Math.floor(enemy.damageNegation[damage])}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Flat Defence</TableCell>
            {allEnemyDamageTypes.map((damage, index) => (
              <TableCell className="text-center" key={index}>
                {Math.floor(+enemy.defence[damage])}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableHeader className="border-b-2 border-secondary">
          <TableRow>
            <TableHead className="sm:w-32"></TableHead>
            {allStatusTypes.map((statusEffect, index) => (
              <TableHead className="text-center" key={index}>
                <Image
                  alt={getDamageTypeKey(statusEffect)}
                  title={getDamageTypeKey(statusEffect)}
                  width={24}
                  height={24}
                  src={damageTypeIcons.get(statusEffect) ?? ""}
                  className="mx-auto"
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Resistances</TableCell>
            {allStatusTypes.map((statusEffect, index) => {
              const statusEffectKey = getDamageTypeKey(statusEffect);
              const enemyResistance =
                enemy.resistances[
                  statusEffectKey as keyof typeof enemy.resistances
                ];

              return (
                <TableCell className="text-center" key={index}>
                  {enemyResistance === "Immune" ? "Inf" : enemyResistance}
                </TableCell>
              );
            })}
          </TableRow>
          {!!attackRating && (
            <TableRow>
              <TableCell>Min hits</TableCell>
              {allStatusTypes.map((statusEffect, index) => {
                const statusEffectKey = getDamageTypeKey(statusEffect);
                const enemyResistance =
                  enemy.resistances[
                    statusEffectKey as keyof typeof enemy.resistances
                  ];
                const passive =
                  attackRating.attackPower[statusEffect]?.total || 0;

                return (
                  <TableCell className="text-center" key={index}>
                    {enemyResistance === "Immune" || !passive ? (
                      <Icons.minus className="text-secondary w-4 h-4 mx-auto" />
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
