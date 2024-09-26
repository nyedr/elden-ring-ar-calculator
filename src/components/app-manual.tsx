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
import { WeaponSearch } from "./weapon-search";
import { Weapon } from "@/lib/data/weapon";
import SelectedWeaponsChart from "./selected-weapons-chart";
import { EnemySearch } from "./enemy-search";
import { Button } from "./ui/button";
import WeaponsTable from "./weapons-table";
import useWeapons from "@/hooks/useWeapons";
import { getWeaponAttack, WeaponAttackResult } from "@/lib/calc/calculator";
import { Character, getAttackAttributes } from "@/hooks/useCharacter";
import { AttributeInput } from "./character-stats";

interface AppManualProps {
  isOpen: boolean;
  closeManual: () => void;
}

export default function AppManual({ isOpen, closeManual }: AppManualProps) {
  const weaponsData = useWeapons();

  const dummyCharacter: Character = {
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

  const getWeaponAttackRating = (weapon: Weapon): WeaponAttackResult => {
    return getWeaponAttack({
      weapon,
      attributes: getAttackAttributes(dummyCharacter.attributes),
      twoHanding: dummyCharacter.isTwoHanding,
      upgradeLevel: Math.min(weapon.attack.length - 1),
    });
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
        <DialogHeader className="mt-5 sm:mt-0">
          <DialogTitle className="text-2xl">Calculator Manual</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full gap-3 text-primary">
          <DialogDescription className="text-primary">
            <h2 className="text-lg font-semibold">
              How to use this application
            </h2>
            <p className="text-primary dark:text-muted-foreground">
              This calculator is designed to help you compare the attack ratings
              of different weapons in Elden Ring. You can:
              <ul className="mt-1 ml-3 leading-6 list-disc list-inside">
                <li>
                  Filter weapons by weapon type, status effects, and affinities.
                </li>
                <li>
                  Compare weapons against different enemies to see how their
                  attack damage changes.
                </li>
              </ul>
            </p>
          </DialogDescription>
          <Separator />
          <DialogDescription className="flex flex-col text-primary">
            <h2 className="text-lg font-semibold">Character Stats</h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              Start by inputting your character{"'"}s stats:
              <ul className="mt-1 ml-3 leading-6 list-disc list-inside">
                <li>Use the sliders or number inputs to change attributes.</li>
                <li>
                  Indicate if you are two-handing your weapon to increase the
                  strength attribute by 50%.
                </li>
              </ul>
            </p>
            <AttributeInput
              metadata={{
                name: "Strength",
                description: "str",
              }}
              value={10}
              attribute="Str"
              onAttributeChanged={() => console.log("Strength changed!")}
            />
            <span className="mt-4 text-muted-foreground">
              Note: The two-handing strength bonus only applies to non-paired
              weapons. So, if you use a paired weapon, you will not get the
              bonus. However, there will be damage changes due to a difference
              in motion values.
            </span>
          </DialogDescription>
          <Separator className="mt-1" />
          <DialogDescription className="text-primary">
            <h2 className="text-lg font-semibold">Select A Weapon By Name</h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              Select a weapon by name:
              <ul className="mt-1 ml-3 leading-6 list-disc list-inside">
                <li>
                  Click the <strong>Select weapon</strong> searchable select to
                  filter weapons by name.
                </li>
                <li>
                  Once selected, you can:
                  <ul className="mt-1 ml-6 leading-6 list-disc list-inside">
                    <li>
                      Add it to the weapon attack rating comparison chart
                      (Plus).
                    </li>
                    <li>View its attribute scaling chart (Chart).</li>
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
            <h2 className="mb-1 text-lg font-semibold text-primary">
              Select An Enemy By Name
            </h2>
            <p className="mb-2 text-primary dark:text-muted-foreground">
              If you have selected an enemy and switched on the{" "}
              <strong>Enemy Damage</strong> switch, the effects of the weapon
              info button (Book) will change, you can now:
              <ul className="mt-1 ml-3 leading-6 list-disc list-inside">
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
                  selected enemy (To the right of the table weapon search input,
                  caps at New Game 7).
                </li>
              </ul>
            </p>

            <p className="mb-4 text-primary">
              <strong>Note:</strong> The weapon AR comparison chart will now
              display enemy damage instead of AR.
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
            <h2 className="mb-1 text-lg font-semibold text-primary">
              Compare Weapons
            </h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              Compare weapons by adding them to the weapon attack rating
              comparison chart:
              <ul className="mt-1 mb-2 ml-3 leading-6 list-disc list-inside">
                <li>
                  See how the weapon{"'"}s attack rating changes at different
                  weapon levels.
                </li>
                <li>
                  Check a weapon{"'"}s information by clicking on its name at
                  the chart{"'"}s top.
                </li>
                <li>
                  Clear the graph by pressing the X button in the top right
                  corner.
                </li>
              </ul>
              <span className="text-muted-foreground">
                Note: Staff and Seals will chart their Spell Scaling values
                instead of their AR.
              </span>
            </p>
            <div className="relative w-full mx-auto"></div>
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
            <h2 className="mb-1 text-lg font-semibold text-primary">
              Weapons Table
            </h2>
            <p className="mb-4 text-primary dark:text-muted-foreground">
              View all weapons in a table format:
              <ul className="mt-1 ml-3 leading-6 list-disc list-inside">
                <li>
                  Filter weapons by name, weapon types, weapon level,
                  affinities, and status effects.
                </li>
                <li>
                  Sort weapons by all attributes, every column is sortable by
                  clicking on the column header.
                </li>
                <li>
                  Click on a weapon{"'"}s name to view its information (Book).
                </li>
                <li>
                  Add a weapon to the comparison chart by selecting it with the
                  checkbox in the first column (Plus).
                </li>
                <li>
                  See a weapon{"'"}s scaling chart by pressing the chart button
                  in the last column (Chart).
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
