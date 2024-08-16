import {
  allStatusEffects,
  weaponAffinities,
  weaponTypes,
} from "@/lib/data/weapon-data";
import { WeaponSearch, WeaponSearchProps } from "./weapon-search";
import { Button } from "./ui/button";
import { Weapon } from "@/lib/data/weapon";
import { Dispatch, SetStateAction } from "react";

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
import { Switch } from "./ui/switch";
import { specialAndRegularLevelsDict } from "@/lib/utils";
import { WeaponState } from "@/app/page";
import { ComboboxItem } from "./ui/combobox";
import { WeaponFilter } from "@/lib/calc/weapons-filter";

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
}: WeaponsTableControlProps) {
  const weaponTypeDropdownOptions = weaponTypes.map(({ name }) => ({
    label: name,
    value: name,
  }));

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
    <div className="w-full flex flex-col gap-2 justify-start">
      <WeaponSearch
        {...{
          updateWeaponInfo,
          findWeapon,
          items: weaponSearchOptions,
          setSelectedWeapons,
          setSelectedChartWeapon,
        }}
      />

      <Label
        id="weaponTypesLabel"
        htmlFor="weaponTypes"
        className="text-sm font-semibold mb-0 mt-2"
      >
        Weapon Types
      </Label>
      <MultiSelect
        options={weaponTypeDropdownOptions}
        onValueChange={setSelectedWeaponTypes}
        defaultValue={weaponFilter.selectedWeaponTypes}
        placeholder="Weapon Types"
      />

      <Label
        id="statusEffectsLabel"
        htmlFor="statusEffects"
        className="text-sm font-semibold mt-1 mb-0"
      >
        Status Effects
      </Label>
      <MultiSelect
        id="statusEffects"
        options={[...allStatusEffects.slice(), "None"].map((statusEffect) => ({
          value: statusEffect,
          label: statusEffect,
        }))}
        onValueChange={setSelectedStatusEffects}
        defaultValue={weaponFilter.selectedStatusEffects}
        placeholder="Status Effects"
      />

      <Label
        id="weaponAffinitiesLabel"
        htmlFor="weaponAffinities"
        className="text-sm font-semibold mt-1 mb-0"
      >
        Weapon Affinities
      </Label>

      <MultiSelect
        options={[...weaponAffinities].map((affinity) => ({
          value: affinity,
          label: affinity,
        }))}
        onValueChange={setSelectedWeaponAffinities}
        defaultValue={weaponFilter.selectedWeaponAffinities}
        placeholder="Affinities"
      />

      <div className="w-full flex items-center justify-evenly gap-4 mt-1">
        <div className="flex items-center space-x-2">
          <Label className="whitespace-nowrap" htmlFor="isTwoHanding">
            Two Handing
          </Label>
          <Switch
            checked={isTwoHanding}
            onCheckedChange={() => setIsTwoHanding(!isTwoHanding)}
            id="isTwoHanding"
          />
        </div>
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
          <SelectTrigger className="w-[140px]">
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

      <Button onClick={setFilteredWeapons} size="lg" className="w-full mt-4">
        Filter weapons
      </Button>
    </div>
  );
}
