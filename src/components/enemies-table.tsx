"use client";

import { Enemy } from "@/lib/data/enemy-data";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./ui/data-table";
import {
  allDamageTypes,
  allStatusEffects,
  StatusEffect,
} from "@/lib/data/weapon-data";
import {
  damageAttributeKeys,
  DamageType,
  damageTypeToImageName,
  statusEffectToImageName,
} from "@/lib/data/weapon-data";
import Image from "next/image";
import { cn, numberWithCommas } from "@/lib/utils";
import { Icons } from "./icons";

interface EnemiesTableProps {
  enemiesData: Enemy[];
}

export default function EnemiesTable({ enemiesData }: EnemiesTableProps) {
  const enemiesColumns: ColumnDef<Enemy>[] = [
    {
      header: "General Info",
      accessorKey: "id",
      enableSorting: false,
      columns: [
        {
          header: "Name",
          accessorKey: "name",
          cell: ({ row }) => <div>{row.original.name}</div>,
          meta: {
            cellClassName: "border border-secondary",
            headerClassName: "text-start px-2",
          },
        },
        // {
        //   header: "Location",
        //   accessorKey: "location",
        //   cell: ({ row }) => <div>{row.original.location}</div>,
        //   meta: {
        //     cellClassName: "border border-secondary",
        //     headerClassName: "text-start px-2",
        //   },
        // },
        {
          header: "Health",
          accessorKey: "healthPoints",
          cell: ({ row }) => (
            <div>{numberWithCommas(row.original.healthPoints)}</div>
          ),
          meta: {
            cellClassName: "border border-secondary",
            headerClassName: "text-start px-2",
          },
        },
        {
          header: "Poise",
          accessorKey: "poise",
          cell: ({ row }) => <div>{row.original.poise.effective}</div>,
          meta: {
            cellClassName: "border border-secondary",
            headerClassName: "text-start px-2",
          },
        },
        {
          header: "Flat Def",
          accessorKey: "defence",
          cell: ({ row }) => <div>{row.original.defence.Physical}</div>,
          meta: {
            cellClassName: "border border-secondary",
            headerClassName: "text-start px-2",
          },
        },
      ],
      meta: {
        headerClassName: "text-start px-2",
      },
    },

    {
      header: "Negations",
      accessorKey: "damageNegation",
      columns: [
        ...allDamageTypes.map(
          (damageType, index) =>
            ({
              header: damageType,
              accessorKey: damageType,
              cell: ({ row }) => (
                <div>{row.original.damageNegation[damageType]}</div>
              ),
              meta: {
                cellClassName: cn(
                  "text-center",
                  index === 0 ? "border-l border-secondary" : ""
                ),
                headerClassName: "py-0",
              },
            } as ColumnDef<Enemy>)
        ),
      ],
    },
    {
      header: "Resistances",
      accessorKey: "resistances",
      columns: [
        ...Object.keys(statusEffectToImageName).map((statusEffect, index) => {
          const status = statusEffect as StatusEffect;
          return {
            accessorKey: statusEffect,
            header: () => (
              <Image
                alt={statusEffect}
                width={24}
                height={24}
                title={statusEffect}
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
                {row.original.resistances[status] === "Immune" ? (
                  <Icons.infinity className="text-primary mx-auto w-4 h-4" />
                ) : (
                  row.original.resistances[status]
                )}
              </span>
            ),
            meta: {
              cellClassName: cn(
                "text-center",
                index === 0 ? "border-l border-secondary" : ""
              ),
              headerClassName: "py-0",
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
