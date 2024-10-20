"use client";

import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Dna, Droplet } from "lucide-react";
import { Enemy } from "@/lib/data/enemy-data";
import EnemyInfoTables from "./enemy-info-tables";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Icons } from "./icons";
import { capitalize } from "@/lib/utils";

export default function EnemyInfo({ enemy }: { enemy: Enemy }) {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <div className="flex flex-col items-start w-full gap-1 mb-5">
        <span className="text-xl font-bold text-primary">{enemy.name}</span>
        <p className="text-sm text-muted-foreground">{enemy.location}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <InfoItem
            icon={<Heart className="w-5 h-5" />}
            label="Health"
            value={enemy.healthPoints.toLocaleString()}
          />
          <InfoItem
            icon={<Shield className="w-5 h-5" />}
            label="Poise"
            value={enemy.poise.base}
          />
          <InfoItem
            icon={<Shield className="w-5 h-5" />}
            label="Poise regen delay"
            value={`${enemy.poise.regenDelay}s`}
            tooltip={`Enemy poice will start regenerating at a rate of 13 per
                    second after ${enemy.poise.regenDelay} seconds of not being
                    hit.`}
          />
        </div>
        <div className="space-y-4">
          <InfoItem
            icon={<Heart className="w-5 h-5" />}
            label="DLC Clear Health"
            value={(enemy.dlcClearHealthPoints ?? "").toLocaleString()}
            tooltip={
              "Health value used if Promised Consort Radahn was killed in a previous NG cycle."
            }
          />
          <InfoItem
            icon={<Dna className="w-5 h-5" />}
            label="Types"
            value={Object.entries(enemy.types)
              .filter(([, value]) => value)
              .map(([key]) => capitalize(key))
              .join(", ")}
          />
        </div>
      </div>

      <EnemyInfoTables enemy={enemy} />

      <div className="mt-6">
        <h3 className="flex items-center mb-3 text-lg font-semibold">
          <Droplet className="w-5 h-5 mr-2" />
          Drops
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {enemy.drops.map((drop) => (
            <Badge
              key={drop.drop}
              variant="outline"
              className="justify-between p-2 px-3"
            >
              <span>{drop.drop}</span>
              <span className="text-xs">
                {drop.quantity && `x${drop.quantity}`} ({drop.baseDropChance}
                %)
                {drop.isAffectedByDiscovery && " (Discovery)"}
              </span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InfoItem({
  icon,
  label,
  value,
  tooltip,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  tooltip?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="relative flex items-center font-medium">
          <span>{label}</span>
          {tooltip && (
            <Tooltip defaultOpen={false} delayDuration={400}>
              <TooltipTrigger>
                <Icons.circleHelp className="w-4 h-4 ml-2 text-primary" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="p-1 font-medium">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </span>
      </div>
      <span>{value}</span>
    </div>
  );
}
