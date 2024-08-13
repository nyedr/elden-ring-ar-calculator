import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttackRating, Damage } from "@/lib/data/attackRating";
import { allDamageTypes } from "@/lib/data/weapon-data";
import { Icons } from "./icons";

export interface WeaponAttributes {
  Physical: Damage;
  Magic: Damage;
  Fire: Damage;
  Lightning: Damage;
  Holy: Damage;
}

interface WeaponTableProps {
  attackRating: AttackRating;
}

export default function WeaponDamageTable({ attackRating }: WeaponTableProps) {
  const weaponDamages = allDamageTypes
    .slice()
    .map((type) => attackRating.damages[type].weapon);
  const weaponScaled = allDamageTypes
    .slice()
    .map((type) => attackRating.damages[type].scaled);
  const weaponTotal = allDamageTypes
    .slice()
    .map((type) => attackRating.damages[type].total);

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
              {Math.floor(damage) || (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Scaled</TableCell>
          {weaponScaled.map((damage, index) => (
            <TableCell className={damage < 0 ? "text-red-500" : ""} key={index}>
              {Math.floor(damage) || (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Total</TableCell>
          {weaponTotal.map((damage, index) => (
            <TableCell key={index}>
              {Math.floor(damage) || (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
