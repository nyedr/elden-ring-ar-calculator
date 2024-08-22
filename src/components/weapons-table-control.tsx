import {
  allStatusEffects,
  weaponAffinities,
  weaponTypes,
} from "@/lib/data/weapon-data";
import { WeaponSearch, WeaponSearchProps } from "./weapon-search";
import { Button } from "./ui/button";
import { Weapon } from "@/lib/data/weapon";
import { Dispatch, SetStateAction, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./ui/multi-select";
import { Label } from "./ui/label";
import { specialAndRegularLevelsDict } from "@/lib/utils";
import { WeaponState } from "@/app/page";
import { ComboboxItem } from "./ui/combobox";
import { WeaponFilter } from "@/lib/calc/weapons-filter";
import { EnemySearch } from "./enemy-search";
import AppManual from "./app-manual";

export interface WeaponsTableControlProps
  extends Omit<WeaponSearchProps, "items"> {
  setWeaponFilter: Dispatch<SetStateAction<WeaponFilter>>;
  weaponFilter: WeaponFilter;
  setSelectedChartWeapon: (selectedChartWeapon: Weapon | null) => void;
  setFilteredWeapons: () => void;
  updateWeaponInfo: (weaponName: string) => void;
  weaponSearchOptions: ComboboxItem[];
  weaponState: WeaponState;
  setWeaponState: Dispatch<SetStateAction<WeaponState>>;
  isTwoHanding: boolean;
  setIsTwoHanding: (isTwoHanding: boolean) => void;
  isDamageOnEnemy: boolean;
  setIsDamageOnEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  enemySearchOptions: ComboboxItem[];
  setSelectedEnemy: (enemy: string) => void;
}

export default function WeaponsTableControl({
  findWeapon,
  weaponSearchOptions,
  setSelectedWeapons,
  setSelectedChartWeapon,
  setFilteredWeapons,
  updateWeaponInfo,
  setWeaponFilter,
  weaponFilter,
  setWeaponState,
  weaponState,
  isTwoHanding,
  setIsTwoHanding,
  isDamageOnEnemy,
  setIsDamageOnEnemy,
  enemySearchOptions,
  setSelectedEnemy,
}: WeaponsTableControlProps) {
  const weaponTypeDropdownOptions = weaponTypes.map(({ name }) => ({
    label: name,
    value: name,
  }));
  const [isManualOpen, setIsManualOpen] = useState(false);

  const setSelectedWeaponTypes = (selectedWeaponTypes: string[]) =>
    setWeaponFilter((prev) => ({ ...prev, selectedWeaponTypes }));
  const setSelectedStatusEffects = (selectedStatusEffects: string[]) =>
    setWeaponFilter((prev) => ({
      ...prev,
      selectedStatusEffects,
    }));
  const setSelectedWeaponAffinities = (selectedWeaponAffinities: string[]) =>
    setWeaponFilter((prev) => ({
      ...prev,
      selectedWeaponAffinities,
    }));

  return (
    <div className="w-full flex flex-col gap-3 justify-start">
      <WeaponSearch
        {...{
          updateWeaponInfo,
          findWeapon,
          items: weaponSearchOptions,
          setSelectedWeapons,
          setSelectedChartWeapon,
        }}
      />

      <div className="flex items-start flex-col gap-2">
        <Label htmlFor="weaponTypes" className="text-sm font-semibold mb-0">
          Weapon Types
        </Label>
        <MultiSelect
          id="weaponTypes"
          options={weaponTypeDropdownOptions}
          onValueChange={setSelectedWeaponTypes}
          defaultValue={weaponFilter.selectedWeaponTypes}
          placeholder="Weapon Types"
        />
      </div>

      <div className="flex items-start flex-col gap-2">
        <Label htmlFor="statusEffects" className="text-sm font-semibold mb-0">
          Status Effects
        </Label>
        <MultiSelect
          id="statusEffects"
          options={[...allStatusEffects.slice(), "None"].map(
            (statusEffect) => ({
              value: statusEffect,
              label: statusEffect,
            })
          )}
          onValueChange={setSelectedStatusEffects}
          defaultValue={weaponFilter.selectedStatusEffects}
          placeholder="Status Effects"
        />
      </div>

      <div className="flex items-start flex-col gap-2">
        <Label
          htmlFor="weaponAffinities"
          className="text-sm font-semibold mb-0"
        >
          Weapon Affinities
        </Label>

        <MultiSelect
          id="weaponAffinities"
          options={[...weaponAffinities].map((affinity) => ({
            value: affinity,
            label: affinity,
          }))}
          onValueChange={setSelectedWeaponAffinities}
          defaultValue={weaponFilter.selectedWeaponAffinities}
          placeholder="Affinities"
        />
      </div>

      <div className="flex items-start flex-col gap-2 mb-1">
        <Label htmlFor="weaponLevel" className="text-sm font-semibold mb-0">
          Weapon Level
        </Label>
        <Select
          value={weaponState.selectedWeaponLevel[2]}
          onValueChange={(e) => {
            const level = specialAndRegularLevelsDict.find(
              (level) => level[2] === e
            );
            if (level) {
              setWeaponState((prev) => {
                return {
                  ...prev,
                  selectedWeaponLevel: level,
                };
              });
            }
          }}
        >
          <SelectTrigger id="weaponLevel" className="w-full">
            <SelectValue placeholder="Weapons Level" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              {specialAndRegularLevelsDict.map((level) => (
                <SelectItem key={level[2]} value={level[2]}>
                  {level[2]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <EnemySearch
        isDamageOnEnemy={isDamageOnEnemy}
        items={enemySearchOptions}
        setIsDamageOnEnemy={setIsDamageOnEnemy}
        setSelectedEnemy={setSelectedEnemy}
      />

      <div className="flex items-center gap-3 mt-2">
        <Button onClick={setFilteredWeapons} size="lg" className="w-full">
          Filter weapons
        </Button>
        <Button
          onClick={() => setIsManualOpen((prev) => !prev)}
          variant="outline"
          size="lg"
        >
          Help
        </Button>
        <AppManual
          closeManual={() => setIsManualOpen(false)}
          isOpen={isManualOpen}
        />
      </div>
    </div>
  );
}
