import { Weapon } from "@/lib/data/weapon";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "./ui/checkbox";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { Character } from "@/hooks/useCharacter";
import { DataTable } from "./ui/data-table";
import { scalingRating } from "@/lib/calc/scaling";
import { AttackRating } from "@/lib/data/attackRating";
import Image from "next/image";
import {
  damageAttributeKeys,
  damageTypeToImageName,
  statusEffectToImageName,
} from "@/lib/data/weapon-data";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./icons";

interface WeaponsTableProps {
  character: Character;
  weapons: Weapon[];
}

export default function WeaponsTable({
  character,
  weapons,
}: WeaponsTableProps) {
  const weaponsColumns: ColumnDef<AttackRating>[] = [
    {
      header: () => <span></span>,
      accessorKey: "weapon",
      enableSorting: false,
      columns: [
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
          enableGrouping: true,
          meta: {
            cellClassName: "p-0 text-center border border-secondary",
          },
        },
        {
          accessorKey: "weaponName",
          header: () => {
            return <span>Name</span>;
          },
          cell: ({ row }) => <span>{row.original.weapon.weaponName}</span>,
          meta: {
            cellClassName: "border border-secondary",
            headerClassName: "text-start",
          },
        },
        // TODO: Move level to select
        // TODO: Make the display of spell scaling dependent on if there is any with it in the weapons array
        {
          accessorKey: "spellScaling",
          header: () => <span title="Spell Scaling">SS</span>,
          cell: ({ row }) => (
            <span>
              {Math.floor(row.original.spellScaling) || (
                <Icons.minus className="text-secondary w-4 h-4 mx-auto" />
              )}
            </span>
          ),
          meta: {
            cellClassName: "border border-secondary text-center",
          },
        },
        {
          accessorKey: "weight",
          header: ({ column, table, header }) => (
            // TODO: Fix table sorting
            <Button
              variant="ghost"
              onClick={() => {
                console.log(column.getSortIndex(), column.getIsSorted());
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
              size="sm"
            >
              Wt
            </Button>
          ),
          cell: ({ row }) => <span>{row.original.weapon.weight}</span>,
          meta: {
            cellClassName: "border border-secondary text-center",
          },
        },
      ],
    },
    {
      header: () => <span>Attack Power</span>,
      accessorKey: "damages",
      columns: [
        ...Object.entries(damageTypeToImageName).map(
          ([damageType, imageName]) => {
            return {
              accessorKey: damageType,
              header: () => (
                <Image
                  alt={damageType}
                  title={`${damageType} Attack`}
                  width={24}
                  height={24}
                  src={`/${imageName}.webp`}
                  className="mx-auto"
                />
              ),
              cell: ({ row }) => (
                <span>
                  {Math.floor(
                    row.original.damages[
                      damageType as keyof typeof damageTypeToImageName
                    ].total
                  ) || (
                    <Icons.minus className="text-secondary w-4 h-4 mx-auto" />
                  )}
                </span>
              ),
              meta: {
                cellClassName: "text-center",
              },
            } as ColumnDef<AttackRating>;
          }
        ),
        {
          accessorKey: "attackRating",
          header: () => <span>Total</span>,
          cell: ({ row }) => (
            <span className="font-bold">{Math.floor(row.original.getAr)}</span>
          ),
          meta: {
            cellClassName: "text-center border-r border-secondary",
          },
        },
      ],
      enableColumnFilter: true,
    },
    {
      header: () => <span>Scaling</span>,
      accessorKey: "weapon",
      columns: [
        ...damageAttributeKeys.map((attribute) => {
          return {
            accessorKey: attribute,
            header: () => <span>{attribute}</span>,
            cell: ({ row }) => {
              const scaling =
                row.original.weapon.levels[row.original.weapon.maxUpgradeLevel][
                  attribute
                ];
              return (
                <span
                  className={
                    row.original.requirementsMet[attribute] === false
                      ? "text-red-500"
                      : ""
                  }
                >
                  {scaling > 0 ? (
                    scalingRating(scaling)
                  ) : (
                    <Icons.minus className="text-secondary w-4 h-4 mx-auto" />
                  )}
                </span>
              );
            },
            meta: {
              cellClassName: cn("text-center"),
            },
          } as ColumnDef<AttackRating>;
        }),
      ],
    },

    {
      accessorKey: "statusEffects",
      // TODO: Change to icons with hover tooltip, each effect should have its own column
      header: () => <span>Status Effects</span>,
      columns: [
        ...Object.keys(statusEffectToImageName).map((statusEffect, index) => {
          return {
            accessorKey: statusEffect,
            header: () => (
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
            ),
            cell: ({ row }) => (
              <span>
                {Math.floor(
                  row.original.statusEffects[
                    statusEffect as keyof typeof statusEffectToImageName
                  ]
                ) || <Icons.minus className="text-secondary mx-auto w-4 h-4" />}
              </span>
            ),
            meta: {
              cellClassName: cn(
                "text-center",
                index === 0 ? "border-l border-secondary" : ""
              ),
            },
          } as ColumnDef<AttackRating>;
        }),
      ],
    },
  ];

  const weaponAttackRatings: AttackRating[] = weapons.map((weapon) => {
    return calculateWeaponDamage(character, weapon, weapon.maxUpgradeLevel);
  });

  return (
    <div className="w-full  py-10">
      <DataTable
        filterBy={{
          accessorKey: "weaponName",
          label: "weapon name",
          depth: 1,
        }}
        columns={weaponsColumns}
        data={weaponAttackRatings}
        isSelectable={true}
      />
    </div>
  );
}
