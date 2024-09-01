import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "./icons";
import { WeaponAttackResult } from "@/lib/calc/calculator";
import { getSpellScaling, getTotalDamageAttackPower } from "@/lib/uiUtils";
import { allStatusTypes, getDamageTypeKey } from "@/lib/data/attackPowerTypes";

export default function WeaponExtraTable({
  attackRating,
}: {
  attackRating: WeaponAttackResult;
}) {
  const weaponStatusTypes = allStatusTypes.filter((statusType) =>
    Boolean(attackRating.attackPower[statusType])
  );

  return (
    <Table>
      <TableBody className="border-t-2 border-secondary">
        <TableRow>
          <TableHead className="sm:w-32">AR</TableHead>
          <TableCell>
            {Math.floor(getTotalDamageAttackPower(attackRating.attackPower))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Spell Scaling</TableHead>
          <TableCell>
            {Math.floor(
              getSpellScaling(attackRating.weapon, attackRating.spellScaling)
            ) || <Icons.minus className="text-secondary w-4 h-4" />}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Passives</TableHead>
          <TableCell>
            {weaponStatusTypes.length ? (
              weaponStatusTypes
                .map(
                  (statusType) =>
                    `${getDamageTypeKey(statusType)} (${
                      attackRating.attackPower[statusType]
                    })`
                )
                .join(", ")
            ) : (
              <Icons.minus className="text-secondary w-4 h-4" />
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
