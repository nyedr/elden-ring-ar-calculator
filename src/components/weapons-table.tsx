import { Weapon } from "@/lib/data/weapon";
import { Checkbox } from "./ui/checkbox";
import { Character } from "@/hooks/useCharacter";
import { DataTable } from "./ui/data-table";
import { scalingRating } from "@/lib/calc/scaling";
import { AttackRating } from "@/lib/data/attackRating";
import Image from "next/image";
import {
  damageAttributeKeys,
  DamageType,
  damageTypeToImageName,
  statusEffectToImageName,
} from "@/lib/data/weapon-data";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  calculateWeaponDamage,
  isDamageTypeAffectedByUnmetRequirements,
} from "@/lib/calc/damage";
import { SortByOption } from "@/lib/calc/filter";

interface WeaponsTableProps {
  character: Character;
  weapons: Weapon[];
  sortWeaponsTable: (sortByOption: SortByOption) => void;
  selectedWeapons: Weapon[];
  setSelectedWeapons: React.Dispatch<React.SetStateAction<Weapon[]>>;
}

export default function WeaponsTable({
  character,
  weapons,
  sortWeaponsTable,
  setSelectedWeapons,
  selectedWeapons,
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
              checked={
                row.getIsSelected() ||
                !!selectedWeapons.find(
                  (weapon) =>
                    weapon.weaponName === row.original.weapon.weaponName
                )
              }
              onCheckedChange={(value) => {
                if (value) {
                  setSelectedWeapons((prev) => [...prev, row.original.weapon]);
                } else {
                  setSelectedWeapons((prev) =>
                    prev.filter((weapon) => weapon !== row.original.weapon)
                  );
                }
                row.toggleSelected(!!value);
              }}
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
            return (
              <Button
                variant="ghost"
                onClick={() => sortWeaponsTable("weaponName")}
                size="sm"
                className="px-2"
              >
                Name
              </Button>
            );
          },
          cell: ({ row }) => <span>{row.original.weapon.weaponName}</span>,
          meta: {
            cellClassName: "border border-secondary",
            headerClassName: "text-start px-2",
          },
        },
        // TODO: Move level to select
        // TODO: Make the display of spell scaling dependent on if there is any with it in the weapons array
        {
          accessorKey: "spellScaling",
          header: () => (
            <Button
              variant="ghost"
              onClick={() => sortWeaponsTable("Spell Scaling")}
              size="sm"
              title="Spell Scaling"
              className="px-2"
            >
              SS
            </Button>
          ),
          cell: ({ row }) => (
            <span>
              {Math.floor(row.original.spellScaling) || (
                <Icons.minus className="text-secondary w-4 h-4 mx-auto" />
              )}
            </span>
          ),
          meta: {
            cellClassName: "border border-secondary text-center",
            headerClassName: "py-0 px-2",
          },
        },
        {
          accessorKey: "weight",
          header: () => (
            <Button
              variant="ghost"
              onClick={() => sortWeaponsTable("weight")}
              size="sm"
              className="px-2"
            >
              Wt
            </Button>
          ),
          cell: ({ row }) => <span>{row.original.weapon.weight}</span>,
          meta: {
            cellClassName: "border border-secondary text-center",
            headerClassName: "py-0 px-2",
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
                <Button
                  variant="ghost"
                  onClick={() => sortWeaponsTable(damageType as SortByOption)}
                  size="sm"
                  title={`${damageType} Attack`}
                  className="px-2"
                >
                  <Image
                    alt={damageType}
                    width={24}
                    height={24}
                    src={`/${imageName}.webp`}
                    className="mx-auto"
                  />
                </Button>
              ),
              cell: ({ row }) => (
                <span
                  className={
                    isDamageTypeAffectedByUnmetRequirements(
                      row.original,
                      damageType as DamageType
                    )
                      ? "text-red-500"
                      : ""
                  }
                >
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
                headerClassName: "py-0 px-2",
              },
            } as ColumnDef<AttackRating>;
          }
        ),
        {
          accessorKey: "attackRating",
          header: () => (
            <Button
              variant="ghost"
              onClick={() => sortWeaponsTable("AR")}
              size="sm"
              className="px-2"
            >
              Total
            </Button>
          ),
          cell: ({ row }) => (
            <span
              className={cn(
                "font-semibold",
                Object.values(row.original.requirementsMet).filter(Boolean)
                  .length !== 5
                  ? "text-red-500"
                  : ""
              )}
            >
              {Math.floor(row.original.getAr)}
            </span>
          ),
          meta: {
            cellClassName: "text-center border-r border-secondary",
            headerClassName: "py-0 px-2",
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
            header: () => (
              <Button
                variant="ghost"
                onClick={() => sortWeaponsTable(attribute as SortByOption)}
                size="sm"
                className="px-2"
              >
                {attribute}
              </Button>
            ),
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
              headerClassName: "py-0 px-2",
            },
          } as ColumnDef<AttackRating>;
        }),
      ],
    },

    {
      accessorKey: "statusEffects",
      header: () => <span>Status Effects</span>,
      columns: [
        ...Object.keys(statusEffectToImageName).map((statusEffect, index) => {
          return {
            accessorKey: statusEffect,
            header: () => (
              <Button
                variant="ghost"
                onClick={() => sortWeaponsTable(statusEffect as SortByOption)}
                size="sm"
                title={statusEffect}
                className="p-2"
              >
                <Image
                  alt={statusEffect}
                  width={24}
                  height={24}
                  src={`/${
                    statusEffectToImageName[
                      statusEffect as keyof typeof statusEffectToImageName
                    ]
                  }.webp`}
                  className="mx-auto"
                />
              </Button>
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
              headerClassName: "py-0 px-2",
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
    <div className="w-full py-10">
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
