import {
  statusEffects,
  weaponAffinities,
  weaponTypesObject,
} from "@/lib/data/weapon-data";
import MultiSelectDropdown from "./ui/multi-select-dropdown";
import { WeaponSearch, WeaponSearchProps } from "./weapon-search";
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
        // labelId="upgradeLevelLabel"
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

export interface WeaponsFilterControlProps extends WeaponSearchProps {
  selectedWeaponTypes: string[];
  setSelectedWeaponTypes: (selectedWeaponTypes: string[]) => void;
  selectedStatusEffects: string[];
  setSelectedStatusEffects: (selectedStatusEffects: string[]) => void;
  selectedWeaponAffinities: string[];
  setSelectedWeaponAffinities: (selectedWeaponAffinities: string[]) => void;
  setSelectedChartWeapon: (selectedChartWeapon: Weapon | null) => void;
  setFilteredWeapons: () => void;
  updateWeaponInfo: (weaponName: string) => void;
}

export default function WeaponsFilterControl({
  findWeapon,
  items,
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
    <div className="w-full flex flex-col gap-4 justify-start">
      <WeaponSearch
        {...{
          updateWeaponInfo,
          findWeapon,
          items,
          setSelectedWeapons,
          setSelectedChartWeapon,
        }}
      />
      <MultiSelectDropdown
        title="Weapon types filter"
        selectedItems={selectedWeaponTypes}
        setSelectedItems={setSelectedWeaponTypes}
        sections={weaponTypesObject}
      />

      <MultiSelectDropdown
        title="Status effects filter"
        selectedItems={selectedStatusEffects}
        setSelectedItems={setSelectedStatusEffects}
        items={[...statusEffects.slice(), "None"]}
      />

      <MultiSelectDropdown
        title="Affinities filter"
        selectedItems={selectedWeaponAffinities}
        setSelectedItems={setSelectedWeaponAffinities}
        items={weaponAffinities.slice()}
      />

      <Button onClick={setFilteredWeapons} size="lg" className="w-full">
        Filter weapons
      </Button>
    </div>
  );
}
