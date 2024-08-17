import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttackRating } from "@/lib/data/attackRating";
import { allStatusEffects, Enemy } from "@/lib/data/enemy-data";
import {
  allDamageTypes,
  damageTypeToImageName,
  statusEffectToImageName,
} from "@/lib/data/weapon-data";
import Image from "next/image";
import { Icons } from "./icons";

interface EnemyInfoTablesProps {
  enemy: Enemy;
  attackRating?: AttackRating;
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
            {allDamageTypes.map((damageType, index) => (
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
            {allDamageTypes.map((damage, index) => (
              <TableCell className="text-center" key={index}>
                {Math.floor(enemy.damageNegation[damage])}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Flat Defence</TableCell>
            {allDamageTypes.map((damage, index) => (
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
            {allStatusEffects.map((statusEffect, index) => (
              <TableHead className="text-center" key={index}>
                <Image
                  alt={statusEffect}
                  title={statusEffect}
                  width={24}
                  height={24}
                  src={`/${
                    statusEffectToImageName[
                      statusEffect as keyof typeof statusEffectToImageName
                    ]
                  }.webp`}
                  className="mx-auto"
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Resistances</TableCell>
            {allStatusEffects.map((statusEffect, index) => (
              <TableCell className="text-center" key={index}>
                {enemy.resistances[statusEffect] === "Immune"
                  ? "Inf"
                  : enemy.resistances[statusEffect]}
              </TableCell>
            ))}
          </TableRow>
          {!!attackRating && (
            <TableRow>
              <TableCell>Min hits</TableCell>
              {allStatusEffects.map((statusEffect, index) => (
                <TableCell className="text-center" key={index}>
                  {enemy.resistances[statusEffect] === "Immune" ||
                  attackRating.statusEffects[statusEffect] === 0 ? (
                    <Icons.minus className="text-secondary w-4 h-4 mx-auto" />
                  ) : (
                    Math.ceil(
                      enemy.resistances[statusEffect] /
                        attackRating.statusEffects[statusEffect]
                    )
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
