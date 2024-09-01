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
import { MultiSelect, MultiSelectOption } from "./ui/multi-select";
import { Label } from "./ui/label";
import { mapToEntries, specialAndRegularLevelsDict } from "@/lib/utils";
import { WeaponState } from "@/app/page";
import { ComboboxItem } from "./ui/combobox";
import { EnemySearch } from "./enemy-search";
import AppManual from "./app-manual";
import { WeaponFilter } from "@/lib/filters/weapons-filter";
import {
  weaponTypeLabels,
  affinityOptions,
  damageTypeIcons,
} from "@/lib/uiUtils";
import { WeaponType } from "@/lib/data/weaponTypes";
import {
  allStatusTypes,
  AttackPowerType,
  getDamageTypeKey,
} from "@/lib/data/attackPowerTypes";
import Image from "next/image";

export interface WeaponsTableControlProps
  extends Omit<WeaponSearchProps, "items"> {
  setWeaponFilter: Dispatch<SetStateAction<WeaponFilter>>;
  weaponFilter: WeaponFilter;
  setSelectedChartWeapon: (selectedChartWeapon: Weapon | null) => void;
  updateWeaponInfo: (name: string) => void;
  weaponSearchOptions: ComboboxItem[];
  weaponState: WeaponState;
  setWeaponState: Dispatch<SetStateAction<WeaponState>>;
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
  updateWeaponInfo,
  setWeaponFilter,
  weaponFilter,
  setWeaponState,
  weaponState,
  isDamageOnEnemy,
  setIsDamageOnEnemy,
  enemySearchOptions,
  setSelectedEnemy,
}: WeaponsTableControlProps) {
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [localWeaponFilter, setLocalWeaponFilter] =
    useState<WeaponFilter>(weaponFilter);

  const weaponTypeDropdownOptions = mapToEntries(weaponTypeLabels).map(
    ([weaponType, label]: [WeaponType, string]) => ({
      label,
      value: weaponType.toString(),
    })
  );

  const setSelectedWeaponTypes = (selectedWeaponTypes: string[]) => {
    setLocalWeaponFilter((prev) => ({
      ...prev,
      selectedWeaponTypes: new Set(selectedWeaponTypes.map((type) => +type)),
    }));
  };

  const statusTypeDropDownOptions = [
    ...allStatusTypes.slice(0, allStatusTypes.length - 1).map((statusType) => ({
      label: getDamageTypeKey(statusType),
      value: statusType.toString(),
      icon: damageTypeIcons.get(statusType)
        ? ({ className }: { className: string }) => (
            <Image
              src={damageTypeIcons.get(statusType) ?? ""}
              alt={getDamageTypeKey(statusType)}
              width={24}
              height={24}
              className={className}
            />
          )
        : undefined,
    })),
    {
      label: "None",
      value: "None" as const,
    },
  ] as MultiSelectOption[];

  const setSelectedStatusEffects = (selectedStatusEffects: string[]) => {
    const selectedEffectsSet = new Set(
      selectedStatusEffects as (AttackPowerType | "None")[]
    );

    setLocalWeaponFilter((prev) => ({
      ...prev,
      selectedStatusEffects: selectedEffectsSet,
    }));
  };

  const weaponAffinityOptions = mapToEntries(affinityOptions).map(
    ([affinityId, affinityOption]) => ({
      label: affinityOption.text,
      value: affinityId.toString(),
      icon: affinityOption.icon
        ? ({ className }: { className: string }) => (
            <Image
              src={affinityOption.icon}
              alt={affinityOption.text}
              width={24}
              height={24}
              className={className}
            />
          )
        : undefined,
    })
  ) as MultiSelectOption[];

  const setSelectedWeaponAffinities = (selectedWeaponAffinities: string[]) => {
    setLocalWeaponFilter((prev) => ({
      ...prev,
      selectedWeaponAffinities: new Map(
        selectedWeaponAffinities.map((id) => [+id, affinityOptions.get(+id)!])
      ),
    }));
  };

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
          defaultValue={Array.from(localWeaponFilter.selectedWeaponTypes).map(
            String
          )}
          placeholder="Weapon Types"
        />
      </div>

      <div className="flex items-start flex-col gap-2">
        <Label htmlFor="statusEffects" className="text-sm font-semibold mb-0">
          Status Effects
        </Label>
        <MultiSelect
          id="statusEffects"
          options={statusTypeDropDownOptions}
          onValueChange={setSelectedStatusEffects}
          defaultValue={Array.from(localWeaponFilter.selectedStatusEffects).map(
            String
          )}
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
          options={weaponAffinityOptions}
          onValueChange={setSelectedWeaponAffinities}
          defaultValue={Array.from(
            localWeaponFilter.selectedWeaponAffinities.keys()
          ).map(String)}
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
              setWeaponState((prev) => ({
                ...prev,
                selectedWeaponLevel: level,
              }));
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
        <Button
          onClick={() => setWeaponFilter(localWeaponFilter)}
          size="lg"
          className="w-full"
        >
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
