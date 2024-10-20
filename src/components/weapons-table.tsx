import { Weapon } from "@/lib/data/weapon";
import { Checkbox } from "./ui/checkbox";
import { Character, getAttackAttributes } from "@/hooks/useCharacter";
import { DataTable } from "./ui/data-table";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { ColumnDef } from "@tanstack/react-table";
import { capitalize, cn } from "@/lib/utils";
import { allNewGames, NewGame } from "@/lib/data/enemy-data";
import { getWeaponAttack, WeaponAttackResult } from "@/lib/calc/calculator";
import {
  damageTypeIcons,
  damageTypeLabels,
  getAttributeScalingTier,
  getSpellScaling,
  getTotalDamageAttackPower,
  getTotalEnemyDamage,
} from "@/lib/uiUtils";
import {
  allDamageTypes,
  allStatusTypes,
  AttackPowerType,
  getDamageTypeKey,
} from "@/lib/data/attackPowerTypes";
import { allAttributes } from "@/lib/data/attributes";
import { memo } from "react";

interface WeaponsTableProps {
  character: Character;
  weaponAttackRatings: WeaponAttackResult[];
  selectedWeapons: Weapon[];
  setSelectedWeapons: (func: (prev: Weapon[]) => Weapon[]) => void;
  updateWeaponInfo: (name: string) => void;
  setSelectedChartWeapon: (weapon: Weapon) => void;
  isDamageOnEnemy: boolean;
  setNewGame: React.Dispatch<React.SetStateAction<NewGame>>;
  isLoading?: boolean;
}

// TODO?: Sort secondarily by weapon AR

const WeaponsTable = memo(function WeaponsTable({
  character,
  weaponAttackRatings,
  setSelectedWeapons,
  selectedWeapons,
  updateWeaponInfo,
  setSelectedChartWeapon,
  isDamageOnEnemy,
  setNewGame,
  isLoading,
}: WeaponsTableProps) {
  const weaponsColumns: ColumnDef<WeaponAttackResult>[] = [
    {
      header: "General Info",
      accessorKey: "upgradeLevel",
      enableSorting: false,
      columns: [
        {
          id: "select",
          cell: ({ row }) => (
            <Checkbox
              checked={
                !!selectedWeapons.find(
                  (weapon) => weapon.name === row.original.weapon.name
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
            cellClassName: "p-0 text-center border-2 border-secondary",
          },
        },
        {
          accessorKey: "name",
          invertSorting: true,
          accessorFn: ({ weapon }) => weapon.name,
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
              onClick={() => updateWeaponInfo(row.original.weapon.name)}
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "px-0 h-auto cursor-pointer",
              })}
            >
              {row.original.weapon.name}
            </span>
          ),
          meta: {
            cellClassName: "border-2 border-secondary px-0",
            headerClassName: "text-start px-2 border-2 border-secondary",
          },
        },
        {
          accessorKey: "spellScaling",
          accessorFn: ({ spellScaling, weapon }) =>
            getSpellScaling(weapon, spellScaling),
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
              {Math.floor(
                getSpellScaling(row.original.weapon, row.original.spellScaling)
              ) || (
                <Icons.minus className="w-4 h-4 mx-auto text-secondary-foreground opacity-15" />
              )}
            </span>
          ),
          meta: {
            cellClassName: "border-2 border-secondary text-center",
            headerClassName: "py-0 px-2 border-2 border-secondary",
          },
        },
      ],
    },
    {
      header: () => <span>Attack Power</span>,
      accessorKey: "attackPower",
      meta: {
        headerClassName: "py-0 px-2 border-2 border-secondary",
      },
      columns: [
        ...allDamageTypes.map((damageType) => {
          return {
            accessorKey: String(damageType),
            accessorFn: ({ enemyDamages, attackPower }) => {
              if (isDamageOnEnemy && enemyDamages) {
                return enemyDamages[damageType] ?? 0;
              }

              return attackPower[damageType as AttackPowerType]?.total ?? 0;
            },
            invertSorting: true,
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                title={`${getDamageTypeKey(damageType)} Attack`}
                size="sm"
                className="px-2 min-w-9"
              >
                <Image
                  alt={getDamageTypeKey(damageType)}
                  width={24}
                  height={24}
                  src={damageTypeIcons.get(damageType) ?? ""}
                  className="mx-auto"
                />
              </Button>
            ),
            cell: ({ row }) => (
              <span
                className={
                  row.original.ineffectiveAttackPowerTypes.includes(
                    damageType as AttackPowerType
                  )
                    ? "text-red-500"
                    : ""
                }
              >
                {Math.floor(
                  isDamageOnEnemy && row.original.enemyDamages
                    ? row.original.enemyDamages[damageType] ?? 0
                    : row.original.attackPower[damageType as AttackPowerType]
                        ?.total ?? 0
                ) || (
                  <Icons.minus className="w-4 h-4 mx-auto text-secondary-foreground opacity-15" />
                )}
              </span>
            ),
            meta: {
              cellClassName: "text-center",
              headerClassName: "py-0 px-2 border-2 border-secondary",
            },
          } as ColumnDef<WeaponAttackResult>;
        }),
        {
          accessorKey: isDamageOnEnemy ? "enemyDamages" : "attackPower",
          accessorFn: ({ enemyDamages, attackPower }) =>
            isDamageOnEnemy && enemyDamages
              ? getTotalEnemyDamage(enemyDamages)
              : getTotalDamageAttackPower(attackPower),
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
                row.original.ineffectiveAttackPowerTypes.length > 0
                  ? "text-red-500"
                  : ""
              )}
            >
              {Math.floor(
                isDamageOnEnemy && row.original.enemyDamages
                  ? getTotalEnemyDamage(row.original.enemyDamages)
                  : getTotalDamageAttackPower(row.original.attackPower)
              )}
            </span>
          ),
          meta: {
            cellClassName: "text-center border-r-2 border-secondary",
            headerClassName: "py-0 px-2 border-2 border-secondary",
          },
        },
      ],
      enableColumnFilter: true,
    },
    {
      header: () => <span>Scaling</span>,
      accessorKey: "ineffectiveAttributes",
      meta: {
        headerClassName: "py-0 px-2 border-2 border-secondary",
      },
      columns: [
        ...allAttributes.map((attribute) => {
          return {
            accessorKey: attribute,
            accessorFn: ({ upgradeLevel, weapon }) =>
              weapon.attributeScaling[upgradeLevel][attribute] ?? 0,
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
                {capitalize(attribute)}
              </Button>
            ),
            cell: ({ row }) => {
              const scaling = getAttributeScalingTier(
                row.original.weapon,
                attribute,
                row.original.upgradeLevel
              );

              const isAffected =
                row.original.ineffectiveAttributes.includes(attribute);

              return (
                <span className={isAffected ? "text-red-500" : ""}>
                  {scaling ?? (
                    <Icons.minus className="w-4 h-4 mx-auto text-secondary-foreground opacity-15" />
                  )}
                </span>
              );
            },
            meta: {
              cellClassName: cn("text-center"),
              headerClassName: "py-0 px-2 border-2 border-secondary",
            },
          } as ColumnDef<WeaponAttackResult>;
        }),
      ],
    },
    {
      accessorKey: "weapon",
      header: () => <span>Status Effects</span>,
      meta: {
        headerClassName: "py-0 px-2 border-2 border-secondary",
      },
      columns: [
        ...allStatusTypes
          // Exclude the last status effect - Death Blight
          .slice(0, allStatusTypes.length - 1)
          .map((statusEffect, index) => {
            return {
              accessorKey: String(statusEffect),
              accessorFn: ({ attackPower }) =>
                attackPower[statusEffect as AttackPowerType]?.total ?? 0,
              invertSorting: true,
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  size="sm"
                  title={damageTypeLabels.get(statusEffect)}
                  className="p-2 min-w-9"
                >
                  <Image
                    alt={
                      damageTypeLabels.get(statusEffect) ??
                      getDamageTypeKey(statusEffect)
                    }
                    width={24}
                    height={24}
                    src={damageTypeIcons.get(statusEffect) ?? ""}
                    className="mx-auto"
                  />
                </Button>
              ),
              cell: ({ row }) => (
                <span>
                  {Math.floor(
                    row.original.attackPower[statusEffect as AttackPowerType]
                      ?.total ?? 0
                  ) || (
                    <Icons.minus className="w-4 h-4 mx-auto text-secondary-foreground opacity-15" />
                  )}
                </span>
              ),
              meta: {
                cellClassName: cn(
                  "text-center",
                  index === 0 ? "border-l-2 border-secondary" : ""
                ),
                headerClassName: "py-0 px-2 border-2 border-secondary",
              },
            } as ColumnDef<WeaponAttackResult>;
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
          <Icons.chart className="w-4 h-4" />
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
      enableGrouping: true,
      meta: {
        cellClassName: "p-1 text-center border-2 border-secondary",
        headerClassName: "border-2 border-secondary",
      },
    },
  ];

  return (
    <div className="w-full py-10">
      <DataTable
        columns={weaponsColumns}
        data={weaponAttackRatings}
        isLoading={isLoading}
        filterBy={{
          accessorKey: "name",
          label: "Weapon",
        }}
        isSelectable={true}
        selectedItems={selectedWeapons.map((weapon) => {
          return getWeaponAttack({
            weapon,
            attributes: getAttackAttributes(character.attributes),
            twoHanding: character.isTwoHanding,
            upgradeLevel: weapon.attack.length - 1,
          });
        })}
        defaultSortBy={{
          id: isDamageOnEnemy ? "enemyDamages" : "attackPower",
          desc: false,
        }}
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
});

export default WeaponsTable;
