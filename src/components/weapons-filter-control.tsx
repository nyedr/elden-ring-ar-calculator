import {
  damageTypes,
  passiveTypes,
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
  selectedPassiveEffects: string[];
  setSelectedPassiveEffects: (selectedPassiveEffects: string[]) => void;
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
  selectedPassiveEffects,
  setSelectedPassiveEffects,
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
        title="Passive effects filter"
        selectedItems={selectedPassiveEffects}
        setSelectedItems={setSelectedPassiveEffects}
        items={[...passiveTypes.slice(), "None"]}
      />

      <Label>Sort by</Label>
      <Select onValueChange={setSortBy} defaultValue="AR">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {[
              ...passiveTypes.slice(),
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
