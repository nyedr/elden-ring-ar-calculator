import { Weapon } from "@/lib/data/weapon";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { Character } from "@/hooks/useCharacter";
import { DataTable } from "./ui/data-table";
import { scalingRating } from "@/lib/calc/scaling";

interface WeaponsTableProps {
  character: Character;
  weapons: Weapon[];
}

export default function WeaponsTable({
  character,
  weapons,
}: WeaponsTableProps) {
  const weaponsColumns: ColumnDef<Weapon>[] = [
    {
      id: "select",
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: () => {
        return <span>Name</span>;
      },
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "affinity",
      header: () => <span>Affinity</span>,
      cell: ({ row }) => <span>{row.original.affinity}</span>,
    },
    {
      accessorKey: "weaponType",
      header: () => <span>Type</span>,
      cell: ({ row }) => <span>{row.original.weaponType}</span>,
    },
    {
      accessorKey: "maxUpgradeLevel",
      header: () => <span>Lvl</span>,
      cell: ({ row }) => <span>{row.original.maxUpgradeLevel}</span>,
    },
    {
      accessorKey: "attackRating",
      header: () => <span>AR</span>,
      cell: ({ row }) => (
        <span className="font-bold">
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).getAr
          )}
        </span>
      ),
    },
    {
      accessorKey: "spellScaling",
      header: () => <span>SS</span>,
      cell: ({ row }) => (
        <span>
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).spellScaling
          )}
        </span>
      ),
    },
    {
      accessorKey: "weight",
      header: () => <span>Wt</span>,
      cell: ({ row }) => <span>{row.original.weight}</span>,
    },
    {
      accessorKey: "Physical",
      header: () => <span>Phys</span>,
      cell: ({ row }) => (
        <span>
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).damages["Physical"].total
          ) || ""}
        </span>
      ),
    },
    {
      accessorKey: "Magic",
      header: () => <span>Mag</span>,
      cell: ({ row }) => (
        <span>
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).damages["Magic"].total
          ) || ""}
        </span>
      ),
    },
    {
      accessorKey: "Fire",
      header: () => <span>Fire</span>,
      cell: ({ row }) => (
        <span>
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).damages["Fire"].total
          ) || ""}
        </span>
      ),
    },
    {
      accessorKey: "Lightning",
      header: () => <span>Ligh</span>,
      cell: ({ row }) => (
        <span>
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).damages["Lightning"].total
          ) || ""}
        </span>
      ),
    },
    {
      accessorKey: "Holy",
      header: () => <span>Holy</span>,
      cell: ({ row }) => (
        <span>
          {Math.floor(
            calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).damages["Holy"].total
          ) || ""}
        </span>
      ),
    },
    {
      accessorKey: "Str",
      header: () => <span>Str</span>,
      cell: ({ row }) => {
        const scaling = row.original.levels[row.original.maxUpgradeLevel].Str;
        return <span>{scaling > 0 ? scalingRating(scaling) : ""}</span>;
      },
    },
    {
      accessorKey: "Dex",
      header: () => <span>Dex</span>,
      cell: ({ row }) => {
        const scaling = row.original.levels[row.original.maxUpgradeLevel].Dex;
        return <span>{scaling > 0 ? scalingRating(scaling) : ""}</span>;
      },
    },
    {
      accessorKey: "Int",
      header: () => <span>Int</span>,
      cell: ({ row }) => {
        const scaling = row.original.levels[row.original.maxUpgradeLevel].Int;
        return <span>{scaling > 0 ? scalingRating(scaling) : ""}</span>;
      },
    },
    {
      accessorKey: "Fai",
      header: () => <span>Fai</span>,
      cell: ({ row }) => {
        const scaling = row.original.levels[row.original.maxUpgradeLevel].Fai;
        return <span>{scaling > 0 ? scalingRating(scaling) : ""}</span>;
      },
    },
    {
      accessorKey: "Arc",
      header: () => <span>Arc</span>,
      cell: ({ row }) => {
        const scaling = row.original.levels[row.original.maxUpgradeLevel].Arc;
        return <span>{scaling > 0 ? scalingRating(scaling) : ""}</span>;
      },
    },
    {
      accessorKey: "passiveEffects",
      header: () => <span>Passives</span>,
      cell: ({ row }) => {
        return (
          <span>
            {calculateWeaponDamage(
              character,
              row.original,
              row.original.maxUpgradeLevel
            ).formatPassives()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="w-full space-y-10">
      <DataTable
        filterBy={{
          accessorKey: "name",
          label: "weapon name",
        }}
        columns={weaponsColumns}
        data={weapons}
        isSelectable={true}
      />
    </div>
  );
}
