import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "./icons";
import { Weapon } from "@/lib/data/weapon";
import { allAttributes, Attributes } from "@/lib/data/attributes";
import { capitalize } from "@/lib/utils";
import { getAttributeScalingTier } from "@/lib/uiUtils";

interface WeaponScalingTableProps {
  weapon: Weapon;
  level: number;
  attributes: Attributes;
}

export default function WeaponScalingTable({
  weapon,
  level,
  attributes,
}: WeaponScalingTableProps) {
  const weaponRequirements = allAttributes.map(
    (key) => weapon.requirements[key]
  );
  const weaponScaling = allAttributes.map((key) => ({
    key,
    scaling: weapon.attributeScaling[level][key],
  }));

  return (
    <Table className="mt-5">
      <TableHeader className="border-b-2 border-secondary">
        <TableRow>
          <TableHead className="sm:w-32"></TableHead>
          {allAttributes.map((key, index) => (
            <TableHead key={index}>{capitalize(key)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Scaling</TableCell>
          {weaponScaling.map(({ key, scaling }, index) => (
            <TableCell
              className={
                weapon.requirements[key]! <= attributes[key] === false
                  ? "text-red-500"
                  : ""
              }
              key={index}
            >
              {scaling ? (
                `${getAttributeScalingTier(weapon, key, level)} (${Math.floor(
                  scaling * 100
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
