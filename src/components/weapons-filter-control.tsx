import {
  statusEffects,
  weaponAffinities,
  weaponTypeDropdownItems,
} from "@/lib/data/weapon-data";
import { ComboboxItem, WeaponSearch, WeaponSearchProps } from "./weapon-search";
import { Button } from "./ui/button";
import { Weapon } from "@/lib/data/weapon";
import { memo } from "react";
import { maxRegularUpgradeLevel, toSpecialUpgradeLevel } from "@/lib/uiUtils";

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

interface WeaponLevelInputProps {
  upgradeLevel: number;
  maxUpgradeLevel?: number;
  onUpgradeLevelChanged(upgradeLevel: number): void;
}

/**
 * Form control for picking the weapon upgrade level (+1, +2, etc.)
 */
const WeaponLevelInput = memo(function WeaponLevelInput({
  upgradeLevel,
  maxUpgradeLevel = maxRegularUpgradeLevel,
  onUpgradeLevelChanged,
}: WeaponLevelInputProps) {
  return (
    <div>
      <Select
        value={String(Math.min(upgradeLevel, maxUpgradeLevel))}
        onValueChange={(val) => onUpgradeLevelChanged(+val)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Weapon Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.from(
              { length: maxUpgradeLevel + 1 },
              (_, upgradeLevelOption) => (
                <SelectItem
                  key={upgradeLevelOption}
                  value={String(upgradeLevelOption)}
                >
                  {maxUpgradeLevel === maxRegularUpgradeLevel
                    ? `+${upgradeLevelOption} / +${toSpecialUpgradeLevel(
                        upgradeLevelOption
                      )}`
                    : `+${upgradeLevelOption}`}
                </SelectItem>
              )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});

export interface WeaponsFilterControlProps
  extends Omit<WeaponSearchProps, "items"> {
  selectedWeaponTypes: string[];
  setSelectedWeaponTypes: (selectedWeaponTypes: string[]) => void;
  selectedStatusEffects: string[];
  setSelectedStatusEffects: (selectedStatusEffects: string[]) => void;
  selectedWeaponAffinities: string[];
  setSelectedWeaponAffinities: (selectedWeaponAffinities: string[]) => void;
  setSelectedChartWeapon: (selectedChartWeapon: Weapon | null) => void;
  setFilteredWeapons: () => void;
  updateWeaponInfo: (weaponName: string) => void;
  weaponSearchOptions: ComboboxItem[];
}

export default function WeaponsFilterControl({
  findWeapon,
  weaponSearchOptions,
  setSelectedWeapons,
  selectedWeaponTypes,
  setSelectedWeaponTypes,
  selectedWeaponAffinities,
  setSelectedWeaponAffinities,
  selectedStatusEffects,
  setSelectedChartWeapon,
  setSelectedStatusEffects,
  setFilteredWeapons,
  updateWeaponInfo,
}: WeaponsFilterControlProps) {
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
        options={weaponTypeDropdownItems}
        onValueChange={setSelectedWeaponTypes}
        defaultValue={selectedWeaponTypes}
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
        options={[...statusEffects.slice(), "None"].map((statusEffect) => ({
          value: statusEffect,
          label: statusEffect,
        }))}
        onValueChange={setSelectedStatusEffects}
        defaultValue={selectedStatusEffects}
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
        defaultValue={selectedWeaponAffinities}
        placeholder="Affinities"
      />
      <Button onClick={setFilteredWeapons} size="lg" className="w-full mt-4">
        Filter weapons
      </Button>
    </div>
  );
}
