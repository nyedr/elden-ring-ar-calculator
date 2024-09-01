import { EmemyFilterData } from "@/app/enemies/page";
import { allEnemyDrops, allEnemyLocations } from "@/lib/data/enemy-data";
import { Label } from "./ui/label";
import Combobox from "./ui/combobox";
import { Button } from "./ui/button";

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
    <div className="w-full flex flex-col gap-2 justify-start">
      <Label
        id="weaponTypesLabel"
        htmlFor="weaponTypes"
        className="text-sm font-semibold mb-0 mt-2"
      >
        Location
      </Label>
      <Combobox
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
        className="text-sm font-semibold mb-0 mt-2"
      >
        Drop
      </Label>
      <Combobox
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
      <div className="flex items-center gap-3 w-full mt-2">
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
