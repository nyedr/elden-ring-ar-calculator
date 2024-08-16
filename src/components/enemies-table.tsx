"use client";

import { Enemy } from "@/lib/data/enemy-data";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import {
  allDamageTypes,
  damageTypeToImageName,
  StatusEffect,
} from "@/lib/data/weapon-data";
import { statusEffectToImageName } from "@/lib/data/weapon-data";
import Image from "next/image";
import { cn, numberWithCommas } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";

interface EnemiesTableProps {
  enemiesData: Enemy[];
  setSelectedEnemy: (enemy: Enemy) => void;
}

export default function EnemiesTable({
  enemiesData,
  setSelectedEnemy,
}: EnemiesTableProps) {
  const enemiesColumns: ColumnDef<Enemy>[] = [
    {
      header: "General Info",
      accessorKey: "id",
      enableSorting: false,
      columns: [
        {
          header: ({ column }) => (
            <Button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              variant="ghost"
              size="sm"
              className="px-2"
            >
              Name
            </Button>
          ),
          accessorKey: "name",
          cell: ({ row }) => (
            <span
              onClick={() => setSelectedEnemy(row.original)}
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "px-0 h-auto cursor-pointer",
              })}
            >
              {row.original.name}
            </span>
          ),
          meta: {
            cellClassName: "border border-secondary px-0",
            headerClassName: "text-start px-2",
          },
        },
        {
          header: ({ column }) => (
            <Button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              variant="ghost"
              size="sm"
              className="px-2"
            >
              Health
            </Button>
          ),
          accessorKey: "healthPoints",
          cell: ({ row }) => (
            <div>{numberWithCommas(row.original.healthPoints)}</div>
          ),
          meta: {
            cellClassName: "border border-secondary text-center",
            headerClassName: "px-2 text-center",
          },
        },
        {
          header: ({ column }) => (
            <Button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              variant="ghost"
              size="sm"
              className="px-2"
            >
              Poise
            </Button>
          ),
          accessorKey: "poise",
          accessorFn: ({ poise }) => poise.effective,
          cell: ({ row }) => (
            <div>{Math.floor(row.original.poise.effective)}</div>
          ),
          meta: {
            cellClassName: "border border-secondary text-center",
            headerClassName: "px-2 text-center",
          },
        },
        {
          header: ({ column }) => (
            <Button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              variant="ghost"
              size="sm"
              className="px-2"
            >
              Def
            </Button>
          ),
          accessorKey: "defence",
          accessorFn: ({ defence }) => defence.Physical,
          cell: ({ row }) => <div>{row.original.defence.Physical}</div>,
          meta: {
            cellClassName: "border border-secondary text-center",
            headerClassName: "px-2 text-center",
          },
        },
      ],
      meta: {
        headerClassName: "text-start px-4",
      },
    },

    {
      header: "Dmg Negations",
      accessorKey: "damageNegation",
      columns: [
        ...allDamageTypes.map(
          (damageType, index) =>
            ({
              header: ({ column }) => (
                <Button
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  title={damageType}
                >
                  {damageTypeToImageName.hasOwnProperty(damageType) ? (
                    <Image
                      alt={damageType}
                      width={24}
                      height={24}
                      src={`/${
                        damageTypeToImageName[
                          damageType as keyof typeof damageTypeToImageName
                        ]
                      }.webp`}
                      className="mx-auto"
                    />
                  ) : (
                    String(damageType)
                  )}
                </Button>
              ),
              accessorKey: damageType,
              accessorFn: ({ damageNegation }) => damageNegation[damageType],
              cell: ({ row }) => (
                <div>{row.original.damageNegation[damageType]}</div>
              ),
              meta: {
                cellClassName: cn(
                  "text-center",
                  index === 0 ? "border-l border-secondary" : ""
                ),
                headerClassName: "py-0 px-2",
              },
            } as ColumnDef<Enemy>)
        ),
      ],
    },
    {
      header: "Status Resistances",
      accessorKey: "resistances",
      columns: [
        ...Object.keys(statusEffectToImageName).map((statusEffect, index) => {
          const status = statusEffect as StatusEffect;
          return {
            accessorKey: statusEffect,
            accessorFn: ({ resistances }) => resistances[status],
            header: ({ column }) => (
              <Button
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                variant="ghost"
                className="px-2"
                title={statusEffect}
                size="sm"
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
                {row.original.resistances[status] === "Immune"
                  ? "Inf"
                  : row.original.resistances[status]}
              </span>
            ),
            meta: {
              cellClassName: "text-center",
              headerClassName: "py-0 px-2",
            },
          } as ColumnDef<Enemy>;
        }),
      ],
    },
  ];

  return (
    <div className="w-full py-10">
      <DataTable
        filterBy={{
          accessorKey: "name",
          label: "Name",
        }}
        columns={enemiesColumns}
        data={enemiesData}
      />
    </div>
  );
}
