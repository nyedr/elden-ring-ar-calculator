"use client";

import { useState } from "react";
import { Sword, Shield, Target } from "lucide-react";
import EnemyDamageInfo from "@/components/enemy-damage-info";
import { BuffSelection } from "./buffs-dialog";
import { Enemy } from "@/lib/data/enemy-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WeaponAttackResult } from "@/lib/calc/calculator";
import WeaponInfo from "./weapon-info";
import { Character } from "@/hooks/useCharacter";
import Link from "next/link";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import EnemyInfo from "./enemy-info";

type ExtraInfoProps = {
  enemy?: Enemy;
  weaponAttackRating: WeaponAttackResult;
  isDamageOnEnemy: boolean;
  setWeaponInfo: (info: any) => void;
  weaponAffinityOptions: any[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  buffSelection: BuffSelection;
  character: Character;
};

export default function ExtraInfo({
  enemy,
  weaponAttackRating,
  isDamageOnEnemy,
  setWeaponInfo,
  weaponAffinityOptions,
  isOpen,
  setIsOpen,
  buffSelection,
  character,
}: ExtraInfoProps) {
  const [activeTab, setActiveTab] = useState<string>(
    isDamageOnEnemy ? "damage" : "weapon"
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full h-screen max-w-full p-0 m-0 sm:h-[90vh] sm:max-w-[850px] sm:rounded-md flex flex-col">
        <DialogHeader className="flex-shrink-0 p-4">
          <DialogTitle className="flex items-center text-2xl font-medium">
            <span className="mr-2 truncate">
              {weaponAttackRating.weapon.weaponName} Information
            </span>
            <Link
              target="_blank"
              className={cn(
                buttonVariants({ variant: "link" }),
                "p-0 m-0 shrink-0"
              )}
              href={weaponAttackRating.weapon.url ?? "#"}
            >
              <Icons.externalLink className="w-4 h-4" />
            </Link>
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-grow px-1 overflow-hidden sm:px-4"
        >
          <TabsList className="grid flex-shrink-0 w-full h-10 grid-cols-3">
            <TabsTrigger
              value="weapon"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 h-full flex items-center justify-center"
            >
              <Sword className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Weapon</span>
              <span className="sm:hidden">Wpn</span>
            </TabsTrigger>
            <TabsTrigger
              value="damage"
              disabled={enemy === undefined}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 h-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Target className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Damage</span>
              <span className="sm:hidden">Dmg</span>
            </TabsTrigger>
            <TabsTrigger
              value="enemy"
              disabled={enemy === undefined}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2 h-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Enemy</span>
              <span className="sm:hidden">Enm</span>
            </TabsTrigger>
          </TabsList>
          <div className="flex-grow overflow-hidden">
            <ScrollArea className="w-full h-full p-4">
              <div className="min-w-[300px]">
                <TabsContent
                  value="weapon"
                  className="mt-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  <WeaponInfo
                    buffSelection={buffSelection}
                    setWeaponInfo={setWeaponInfo}
                    weaponAffinityOptions={weaponAffinityOptions}
                    weapon={weaponAttackRating.weapon}
                    character={character}
                  />
                </TabsContent>
                <TabsContent
                  value="damage"
                  className="mt-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  {enemy !== undefined && (
                    <EnemyDamageInfo
                      attackRating={weaponAttackRating}
                      enemy={enemy}
                      setWeaponInfo={setWeaponInfo}
                      weaponAffinityOptions={weaponAffinityOptions}
                      buffSelection={buffSelection}
                    />
                  )}
                </TabsContent>
                <TabsContent
                  value="enemy"
                  className="mt-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                  {enemy !== undefined && <EnemyInfo enemy={enemy} />}
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
        <div className="flex justify-end flex-shrink-0 p-4">
          <Button
            onClick={() => setIsOpen(false)}
            className="px-2 py-1 text-xs sm:text-sm sm:px-4 sm:py-2"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
