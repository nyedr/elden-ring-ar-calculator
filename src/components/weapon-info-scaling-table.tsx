import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "./icons";
import { damageAttributeKeys } from "@/lib/data/weapon-data";
import { Weapon } from "@/lib/data/weapon";
import { scalingRating } from "@/lib/calc/scaling";
import { Attributes } from "@/hooks/useCharacter";
import { meetsWeaponRequirement } from "@/lib/calc/damage";

interface WeaponScalingTableProps {
  weapon: Weapon;
  level: number;
  characterAttributes: Attributes;
}

export default function WeaponScalingTable({
  weapon,
  level,
  characterAttributes,
}: WeaponScalingTableProps) {
  const weaponRequirements = damageAttributeKeys.map(
    (key) => weapon.requirements[key]
  );
  const weaponScaling = damageAttributeKeys.map((key) => ({
    key,
    scaling: weapon.levels[level][key],
  }));

  return (
    <Table className="mt-5">
      <TableHeader className="border-b-2 border-secondary">
        <TableRow>
          <TableHead className="sm:w-32"></TableHead>
          {damageAttributeKeys.map((key, index) => (
            <TableHead key={index}>{key}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Scaling</TableCell>
          {weaponScaling.map(({ key, scaling }, index) => (
            <TableCell
              className={
                meetsWeaponRequirement(weapon, key, characterAttributes) ===
                false
                  ? "text-red-500"
                  : ""
              }
              key={index}
            >
              {scaling ? (
                `${scalingRating(scaling)} (${Math.floor(
                  +scaling.toFixed(2) * 100
                )})`
              ) : (
                <Icons.minus className="text-secondary w-4 h-4" />
              )}
            </TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Required</TableCell>
          {weaponRequirements.map((value, index) => (
            <TableCell key={index}>
              {value || <Icons.minus className="text-secondary w-4 h-4" />}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
