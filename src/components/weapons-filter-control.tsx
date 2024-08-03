import {
  damageTypes,
  statusEffects,
  weaponTypesObject,
} from "@/lib/data/weapon-data";
import MultiSelectDropdown from "./ui/multi-select-dropdown";
import { WeaponSearch, WeaponSearchProps } from "./weapon-search";
import {
  SelectTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { SortByOption } from "@/app/page";

export interface WeaponsFilterControlProps extends WeaponSearchProps {
  selectedWeaponTypes: string[];
  setSelectedWeaponTypes: (selectedWeaponTypes: string[]) => void;
  selectedDamageTypes: string[];
  setSelectedDamageTypes: (selectedDamageTypes: string[]) => void;
  selectedStatusEffects: string[];
  setSelectedStatusEffects: (selectedStatusEffects: string[]) => void;
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

      <MultiSelectDropdown
        title="Damage types filter"
        selectedItems={selectedDamageTypes}
        setSelectedItems={setSelectedDamageTypes}
        items={damageTypes.slice()}
      />

      <MultiSelectDropdown
        title="Status effects filter"
        selectedItems={selectedStatusEffects}
        setSelectedItems={setSelectedStatusEffects}
        items={[...statusEffects.slice(), "None"]}
      />

      {/* TODO: Remove sort by select by directly implementing the sorting to the table component. */}
      <Label>Sort by</Label>
      <Select onValueChange={setSortBy} defaultValue="AR">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {[
              ...statusEffects.slice(),
              ...damageTypes.slice(),
              "AR",
              "Spell Scaling",
            ].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button onClick={filterAndSortWeapons} size="lg" className="w-full">
        Search weapons
      </Button>
    </div>
  );
}
