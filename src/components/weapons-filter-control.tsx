import {
  statusEffects,
  weaponAffinities,
  weaponTypesObject,
} from "@/lib/data/weapon-data";
import MultiSelectDropdown from "./ui/multi-select-dropdown";
import { WeaponSearch, WeaponSearchProps } from "./weapon-search";
import { Button } from "./ui/button";
import { SortByOption } from "@/lib/calc/filter";

export interface WeaponsFilterControlProps extends WeaponSearchProps {
  selectedWeaponTypes: string[];
  setSelectedWeaponTypes: (selectedWeaponTypes: string[]) => void;
  selectedDamageTypes: string[];
  setSelectedDamageTypes: (selectedDamageTypes: string[]) => void;
  selectedStatusEffects: string[];
  setSelectedStatusEffects: (selectedStatusEffects: string[]) => void;
  selectedWeaponAffinities: string[];
  setSelectedWeaponAffinities: (selectedWeaponAffinities: string[]) => void;
  filterAndSortWeapons: () => void;
  setSortBy: (sortBy: SortByOption) => void;
}

export default function WeaponsFilterControl({
  findWeapon,
  items,
  setSelectedWeapons,
  selectedWeaponTypes,
  setSelectedWeaponTypes,
  selectedDamageTypes,
  setSelectedDamageTypes,
  selectedWeaponAffinities,
  setSelectedWeaponAffinities,
  selectedStatusEffects,
  setSelectedStatusEffects,
  filterAndSortWeapons,
  setSortBy,
}: WeaponsFilterControlProps) {
  return (
    <div className="w-full flex flex-col gap-4 justify-start">
      <WeaponSearch {...{ findWeapon, items, setSelectedWeapons }} />
      <MultiSelectDropdown
        title="Weapon types filter"
        selectedItems={selectedWeaponTypes}
        setSelectedItems={setSelectedWeaponTypes}
        sections={weaponTypesObject}
      />

      {/* <MultiSelectDropdown
        title="Damage types filter"
        selectedItems={selectedDamageTypes}
        setSelectedItems={setSelectedDamageTypes}
        items={damageTypes.slice()}
      /> */}

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

      <Button onClick={filterAndSortWeapons} size="lg" className="w-full">
        Filter weapons
      </Button>
    </div>
  );
}
