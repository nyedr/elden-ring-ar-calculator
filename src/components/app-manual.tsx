"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { AttributeInput } from "./character-stats";
import { WeaponSearch } from "./weapon-search";
import { Weapon } from "@/lib/data/weapon";
import SelectedWeaponsChart from "./selected-weapons-chart";
import { EnemySearch } from "./enemy-search";
import { Button } from "./ui/button";
import WeaponsTable from "./weapons-table";
import { AttackRating } from "@/lib/data/attackRating";
import getWeapons from "@/lib/data/getWeapons";
import { useMemo } from "react";
import { calculateWeaponDamage } from "@/lib/calc/damage";

interface AppManualProps {
  isOpen: boolean;
  closeManual: () => void;
}

export default function AppManual({ isOpen, closeManual }: AppManualProps) {
  const weaponsData = useMemo(() => getWeapons(), []);

  const dummyCharacter = {
    attributes: {
      Str: 10,
      Dex: 10,
      Int: 10,
      Fai: 10,
      Arc: 10,
      Vig: 10,
      End: 10,
      Min: 10,
    },
    isTwoHanding: false,
    level: 1,
  };

  const getWeaponAttackRating = (weapon: Weapon): AttackRating => {
    return calculateWeaponDamage(
      dummyCharacter,
      weapon,
      weapon.maxUpgradeLevel
    );
  };

  const dummyWeaponData = [
    {
      label: "Weapon 1",
      data: [
        {
          primary: 1,
          secondary: 1,
        },
        {
          primary: 2,
          secondary: 3,
        },
        {
          primary: 3,
          secondary: 5,
        },
        {
          primary: 4,
          secondary: 7,
        },
        {
          primary: 5,
          secondary: 9,
        },
        {
          primary: 6,
          secondary: 11,
        },
      ],
    },
    {
      label: "Weapon 2",
      data: [
        {
          primary: 1,
          secondary: 1,
        },
        {
          primary: 2,
          secondary: 2,
        },
        {
          primary: 3,
          secondary: 3,
        },
        {
          primary: 4,
          secondary: 4,
        },
        {
          primary: 5,
          secondary: 5,
        },
        {
          primary: 6,
          secondary: 6,
        },
      ],
    },
  ];

  const dummyEnemyData = [
    {
      label: "Enemy 1",
      value: "Enemy 1",
    },
    {
      label: "Enemy 2",
      value: "Enemy 2",
    },
    {
      label: "Enemy 3",
      value: "Enemy 3",
    },
  ];

  return (
    <Dialog open={isOpen}>
      <DialogContent
        onXClick={closeManual}
        className="flex flex-col max-h- max-w-[850px] max-[800px]:px-[calc(10vw/2)] sm:max-h-[90%] h-full sm:overflow-y-auto overflow-y-scroll"
      >
        <DialogHeader className="sm:mt-0 mt-5">
          <DialogTitle className="text-2xl">App Manual</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-3 text-primary">
          <DialogDescription className="text-primary">
            <h2 className="text-lg font-semibold">How to use this app</h2>
            <p className="text-primary dark:text-muted-foreground">
              This app is designed to help you compare the attack ratings of
              different weapons in Elden Ring. You can:
              <ul className="list-disc list-inside leading-6 mt-1 ml-3">
                <li>
                  Filter weapons by weapon type, scaling, and weapon level.
                </li>
                <li>
                  Compare weapons against different enemies to see how their
                  attack ratings change.
                </li>
              </ul>
            </p>
          </DialogDescription>
          <Separator />
          <DialogDescription className="text-primary">
            <h2 className="text-lg font-semibold">Character Stats</h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              Start by inputting your character{"'"}s stats:
              <ul className="list-disc list-inside leading-6 mt-1 ml-3">
                <li>Use the sliders or number inputs to change attributes.</li>
                <li>
                  Indicate if you are two-handing your weapon to increase the
                  strength attribute by 50%.
                </li>
              </ul>
            </p>
            <AttributeInput
              attribute="Str"
              value={10}
              onAttributeChanged={() => console.log("Strength changed!")}
            />
          </DialogDescription>
          <Separator className="mt-1" />
          <DialogDescription className="text-primary">
            <h2 className="text-lg font-semibold">Select A Weapon By Name</h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              Select a weapon by name:
              <ul className="list-disc list-inside leading-6 mt-1 ml-3">
                <li>
                  Click the <strong>Select weapon</strong> searchable select to
                  filter weapons by name.
                </li>
                <li>
                  Once selected, you can:
                  <ul className="list-disc list-inside leading-6 mt-1 ml-6">
                    <li>
                      Add it to the weapon attack rating comparison chart
                      (Plus).
                    </li>
                    <li>View its damage breakdown chart (Chart).</li>
                    <li>See additional weapon information (Book).</li>
                  </ul>
                </li>
              </ul>
            </p>
            <WeaponSearch
              findWeapon={(name: string) => undefined}
              items={[
                {
                  label: "Weapon 1",
                  value: "Weapon 1",
                },
                {
                  label: "Weapon 2",
                  value: "Weapon 2",
                },
                {
                  label: "Weapon 3",
                  value: "Weapon 3",
                },
              ]}
              setSelectedChartWeapon={(w: Weapon | null) => console.log(w)}
              updateWeaponInfo={(n: string) => console.log(n)}
              setSelectedWeapons={() =>
                console.log("Selected weapons changed!")
              }
            />
          </DialogDescription>
          <Separator className="mt-1" />

          <DialogDescription>
            <h2 className="text-lg font-semibold text-primary mb-1">
              Select An Enemy By Name
            </h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              If you have selected an enemy and switched on the{" "}
              <strong>Enemy Damage</strong> switch, you can:
              <ul className="list-disc list-inside ml-3 leading-6 mt-1">
                <li>
                  View the enemy{"'"}s information and how the weapon will fare
                  against the enemy.
                </li>
                <li>
                  See damage dealt for a chosen weapon attack, efficient poise
                  break attack sequence, and hits to trigger a status effect.
                </li>
                <li>
                  Change the New Game version to see damage dealt on the
                  selected enemy.
                </li>
              </ul>
            </p>

            <EnemySearch
              isDamageOnEnemy={true}
              setSelectedEnemy={() => {}}
              items={dummyEnemyData}
              setIsDamageOnEnemy={() => {}}
            />
          </DialogDescription>
          <Separator className="mt-1" />

          <DialogDescription>
            <h2 className="text-lg font-semibold text-primary mb-1">
              Compare Weapons
            </h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              Compare weapons by adding them to the weapon attack rating
              comparison chart:
              <ul className="list-disc list-inside leading-6 mt-1 mb-2 ml-3">
                <li>
                  See how the weapon{"'"}s attack rating changes at different
                  weapon levels.
                </li>
                <li>
                  Check a weapons information by clicking on its name at the top
                  of the chart.
                </li>
                <li>
                  Clear the graph by pressing the X button in the top right
                  corner.
                </li>
              </ul>
              <span className="text-muted-foreground">
                Note: Staffs and Seals will chart their Spell Scaling values
                instead of their AR.
              </span>
            </p>
            <div className="w-full relative mx-auto"></div>
            <SelectedWeaponsChart
              updateWeaponInfo={() => console.log("Clearing selected weapons!")}
              clearSelectedWeapons={() =>
                console.log("Clearing selected weapons!")
              }
              data={dummyWeaponData}
            />
          </DialogDescription>
          <Separator className="mt-8" />

          <DialogDescription>
            <h2 className="text-lg font-semibold text-primary mb-1">
              Weapons Table
            </h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              View all weapons in a table format:
              <ul className="list-disc list-inside leading-6 mt-1 ml-3">
                <li>
                  Filter weapons by name, weapon types, weapon level,
                  affinities, and status effects.
                </li>
                <li>
                  Sort weapons by all attributes, every column is sortable by
                  clicking on the column header.
                </li>
                <li>Click on a weapon{"'"}s name to view its information.</li>
                <li>
                  Add a weapon to the comparison chart by selecting it with the
                  checkbox in the first column.
                </li>
                <li>
                  See a weapons damage breakdown by pressing the chart button in
                  the last column.
                </li>
              </ul>
            </p>
            <div className="w-full">
              <WeaponsTable
                character={dummyCharacter}
                isDamageOnEnemy={false}
                selectedWeapons={[]}
                setSelectedWeapons={() => {}}
                updateWeaponInfo={() => {}}
                setSelectedChartWeapon={() => {}}
                setNewGame={() => {}}
                weaponAttackRatings={weaponsData.weapons
                  .map((weapon) => getWeaponAttackRating(weapon))
                  .slice(0, 9)}
              />
            </div>
          </DialogDescription>
          <Separator />
        </div>
        <DialogFooter>
          <Button size="sm" onClick={closeManual}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
