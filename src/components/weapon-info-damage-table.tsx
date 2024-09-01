import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "./icons";
import { WeaponAttackResult } from "@/lib/calc/calculator";
import { allDamageTypes } from "@/lib/data/attackPowerTypes";

interface WeaponTableProps {
  attackRating: WeaponAttackResult;
}

export default function WeaponDamageTable({ attackRating }: WeaponTableProps) {
  const weaponDamages = allDamageTypes.map(
    (type) => attackRating.attackPower[type]?.weapon
  );
  const weaponScaled = allDamageTypes.map(
    (type) => attackRating.attackPower[type]?.scaled
  );
  const weaponTotal = allDamageTypes.map(
    (type) => attackRating.attackPower[type]?.total
  );

  return (
    <Table className="mt-5">
      <TableHeader className="border-b-2 border-secondary">
        <TableRow>
          <TableHead className="sm:w-32"></TableHead>
          <TableHead>Physical</TableHead>
          <TableHead>Magic</TableHead>
          <TableHead>Fire</TableHead>
          <TableHead>Lightning</TableHead>
          <TableHead>Holy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Attack</TableCell>
          {weaponDamages.map((damage, index) => (
            <TableCell key={index}>
              {damage ? (
                Math.floor(damage)
              ) : (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Scaled</TableCell>
          {weaponScaled.map((damage, index) => (
            <TableCell
              className={(damage ?? -1) < 0 ? "text-red-500" : ""}
              key={index}
            >
              {damage ? (
                Math.floor(damage)
              ) : (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Total</TableCell>
          {weaponTotal.map((damage, index) => (
            <TableCell key={index}>
              {damage ? (
                Math.floor(damage)
              ) : (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
