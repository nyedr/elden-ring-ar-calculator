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
import { Button, buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import {
  calculateWeaponDamage,
  isDamageTypeAffectedByUnmetRequirements,
} from "@/lib/calc/damage";
import { allNewGames, NewGame } from "@/lib/data/enemy-data";

interface WeaponsTableProps {
  character: Character;
  weaponAttackRatings: AttackRating[];
  selectedWeapons: Weapon[];
  setSelectedWeapons: (func: (prev: Weapon[]) => Weapon[]) => void;
  updateWeaponInfo: (weaponName: string) => void;
  setSelectedChartWeapon: (weapon: Weapon) => void;
  isDamageOnEnemy: boolean;
  setNewGame: React.Dispatch<React.SetStateAction<NewGame>>;
}

// TODO: Sort secondarily by weapon AR

export default function WeaponsTable({
  character,
  weaponAttackRatings,
  setSelectedWeapons,
  selectedWeapons,
  updateWeaponInfo,
  setSelectedChartWeapon,
  isDamageOnEnemy,
  setNewGame,
}: WeaponsTableProps) {
  const weaponsColumns: ColumnDef<AttackRating>[] = [
    {
      header: "General Info",
      accessorKey: "weapon",
      enableSorting: false,
      columns: [
        {
          id: "select",
          cell: ({ row }) => (
            <Checkbox
              checked={
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
          invertSorting: true,
          accessorFn: ({ weapon }) => weapon.weaponName,
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                size="sm"
                className="px-2"
              >
                Name
              </Button>
            );
          },
          cell: ({ row }) => (
            <span
              onClick={() => updateWeaponInfo(row.original.weapon.weaponName)}
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "px-0 h-auto cursor-pointer",
              })}
            >
              {row.original.weapon.weaponName}
            </span>
          ),
          meta: {
            cellClassName: "border border-secondary px-0",
            headerClassName: "text-start px-2",
          },
        },
        {
          accessorKey: "spellScaling",
          invertSorting: true,
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
          accessorFn: ({ weapon }) => weapon.weight,
          invertSorting: true,
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              accessorFn: ({ damages }) =>
                damages[damageType as DamageType].total,
              invertSorting: true,
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  title={`${damageType} Attack`}
                  size="sm"
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
                  {(isDamageOnEnemy
                    ? Math.floor(
                        row.original.enemyDamages[
                          damageType as keyof typeof damageTypeToImageName
                        ] ?? 0
                      )
                    : Math.floor(
                        row.original.damages[
                          damageType as keyof typeof damageTypeToImageName
                        ].total
                      )) || (
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
          accessorKey: isDamageOnEnemy ? "enemyAR" : "getAr",
          invertSorting: true,
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              {Math.floor(
                isDamageOnEnemy
                  ? Math.floor(row.original.enemyAR ?? 0)
                  : row.original.getAr
              )}
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
            accessorFn: ({ weapon }) =>
              weapon.levels[weapon.maxUpgradeLevel][attribute],
            invertSorting: true,
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
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
            accessorFn: ({ statusEffects }) =>
              statusEffects[
                statusEffect as keyof typeof statusEffectToImageName
              ],
            invertSorting: true,
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
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
    {
      id: "info",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => setSelectedChartWeapon(row.original.weapon)}
          size="sm"
          className="px-2"
        >
          <Icons.chart className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
      enableGrouping: true,
      meta: {
        cellClassName: "p-1 text-center border border-secondary",
      },
    },
  ];

  return (
    <div className="w-full py-10">
      <DataTable
        columns={weaponsColumns}
        data={weaponAttackRatings}
        filterBy={{
          accessorKey: "weaponName",
          label: "Weapon",
        }}
        isSelectable={true}
        selectedItems={selectedWeapons.map((weapon) => {
          return calculateWeaponDamage(
            character,
            weapon,
            weapon.maxUpgradeLevel
          );
        })}
        customSelect={
          isDamageOnEnemy
            ? {
                options: allNewGames,
                triggerClassName: "max-w-28",
                defaultValue: NewGame.NG,
                onChange: (newGame) => setNewGame(newGame as NewGame),
              }
            : undefined
        }
      />
    </div>
  );
}
