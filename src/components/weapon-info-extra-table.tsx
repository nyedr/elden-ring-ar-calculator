import { AttackRating } from "@/lib/data/attackRating";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icons } from "./icons";

export default function WeaponExtraTable({
  attackRating,
}: {
  attackRating: AttackRating;
}) {
  return (
    <Table>
      <TableBody className="border-t-2 border-secondary">
        <TableRow>
          <TableHead className="sm:w-32">AR</TableHead>
          <TableCell>{Math.floor(attackRating.getAr)}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Spell Scaling</TableHead>
          <TableCell>
            {Math.floor(attackRating.spellScaling) || (
              <Icons.minus className="text-secondary w-4 h-4" />
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Passives</TableHead>
          <TableCell>{attackRating.formatPassives()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
