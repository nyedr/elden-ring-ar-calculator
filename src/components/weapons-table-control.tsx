import { WeaponSearch, WeaponSearchProps } from "./weapon-search";
import { Button } from "./ui/button";
import { Weapon } from "@/lib/data/weapon";
import { Dispatch, SetStateAction, useState } from "react";

import { CustomSelectItem, CustomSelect } from "@/components/ui/select";
import { MultiSelect, MultiSelectOption } from "./ui/multi-select";
import { Label } from "./ui/label";
import { mapToEntries, specialAndRegularLevelsDict } from "@/lib/utils";
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
  weaponSearchOptions: CustomSelectItem[];
  selectedWeaponLevel: [number, number, string];
  setSelectedWeaponLevel: Dispatch<SetStateAction<[number, number, string]>>;
  isDamageOnEnemy: boolean;
  setIsDamageOnEnemy: React.Dispatch<React.SetStateAction<boolean>>;
  enemySearchOptions: CustomSelectItem[];
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
  selectedWeaponLevel,
  setSelectedWeaponLevel,
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

  const setSelectedStatusEffects = (selectedEffects: string[]) => {
    const selectedStatusEffects = new Set(
      selectedEffects.map((type) =>
        type === "None" ? type : (+type as AttackPowerType)
      )
    );

    setLocalWeaponFilter((prev) => ({
      ...prev,
      selectedStatusEffects,
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
    <div className="flex flex-col justify-start w-full gap-3">
      <WeaponSearch
        {...{
          updateWeaponInfo,
          findWeapon,
          items: weaponSearchOptions,
          setSelectedWeapons,
          setSelectedChartWeapon,
        }}
      />

      <div className="flex flex-col items-start gap-2">
        <Label htmlFor="weaponTypes" className="mb-0 text-sm font-semibold">
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

      <div className="flex flex-col items-start gap-2">
        <Label htmlFor="statusEffects" className="mb-0 text-sm font-semibold">
          Status Effects
        </Label>
        <MultiSelect
          id="statusEffects"
          options={statusTypeDropDownOptions}
          onValueChange={(selectedStatusEffects) =>
            setSelectedStatusEffects(selectedStatusEffects)
          }
          defaultValue={Array.from(localWeaponFilter.selectedStatusEffects).map(
            String
          )}
          placeholder="Status Effects"
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        <Label
          htmlFor="weaponAffinities"
          className="mb-0 text-sm font-semibold"
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

      <CustomSelect
        id="weaponLevel"
        label="Weapon Level"
        onChange={(e) => {
          const selectedWeaponLevel = specialAndRegularLevelsDict.find(
            (level) => level[2] === e
          );

          if (selectedWeaponLevel) {
            setSelectedWeaponLevel(selectedWeaponLevel);
          }
        }}
        value={selectedWeaponLevel[2]}
        items={specialAndRegularLevelsDict.map(([, , level]) => ({
          value: level,
          label: level,
        }))}
      />

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
