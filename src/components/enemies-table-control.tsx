import { EmemyFilterData } from "@/app/enemies/page";
import {
  allEnemyDrops,
  allEnemyLocations,
  EnemyType,
  enemyTypes,
} from "@/lib/data/enemy-data";
import { Label } from "./ui/label";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";
import { CustomSelect } from "./ui/select";
import { enemyTypeLabels } from "@/lib/uiUtils";

interface EnemiesTableControlProps {
  enemiesFilterData: EmemyFilterData;
  setEnemiesFilterData: React.Dispatch<React.SetStateAction<EmemyFilterData>>;
  filterEnemies: (enemiesFilterData: EmemyFilterData) => void;
  clearFilters: () => void;
}

export default function EnemiesTableControl({
  enemiesFilterData,
  setEnemiesFilterData,
  filterEnemies,
  clearFilters,
}: EnemiesTableControlProps) {
  return (
    <div className="flex flex-col justify-start w-full gap-2">
      <Label
        id="weaponTypesLabel"
        htmlFor="weaponTypes"
        className="mt-3 mb-0 space-y-2 text-sm font-semibold"
      >
        Location
      </Label>
      <Combobox
        hasLabel={false}
        items={allEnemyLocations.map((location) => ({
          label: location,
          value: location,
        }))}
        label="Location"
        maxItemsShown={allEnemyLocations.length}
        onValueChange={(location: string) =>
          setEnemiesFilterData((prev) => ({ ...prev, location }))
        }
      />

      <Label
        id="weaponTypesLabel"
        htmlFor="weaponTypes"
        className="mt-3 mb-0 space-y-2 text-sm font-semibold"
      >
        Drop
      </Label>
      <Combobox
        hasLabel={false}
        items={allEnemyDrops.map((drop) => ({
          label: drop,
          value: drop,
        }))}
        label="Drop"
        maxItemsShown={allEnemyDrops.length}
        onValueChange={(drop: string) =>
          setEnemiesFilterData((prev) => ({ ...prev, drop }))
        }
      />

      <CustomSelect
        containerClassName="mt-3"
        label="Enemy Type"
        items={[
          ...enemyTypes.map((type) => ({
            label: enemyTypeLabels.get(type)!,
            value: type,
          })),
          {
            label: "None",
            value: "None",
          },
        ]}
        onChange={(type: string) =>
          setEnemiesFilterData((prev) => ({ ...prev, type: type as EnemyType }))
        }
        value={enemiesFilterData.type}
        id="enemyTypes"
      />

      <div className="flex items-center w-full gap-3 mt-2">
        <Button onClick={() => filterEnemies(enemiesFilterData)}>
          Filter enemies
        </Button>
        <Button variant="outline" onClick={() => clearFilters()}>
          Clear
        </Button>
      </div>
    </div>
  );
}
