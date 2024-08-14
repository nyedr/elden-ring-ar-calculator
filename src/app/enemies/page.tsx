import EnemiesTable from "@/components/enemies-table";
import Header from "@/components/header";
import enemiesNG from "@/lib/data/csv/enemies/enemiesNG.json";
import { Enemy } from "@/lib/data/enemy-data";

export default function Enemies() {
  // TODO: Should be sortable
  // TODO: Should have a search bar
  // TODO: Should be able to select an enemy and see more detailed information
  // Ex: Like items drops, location, etc.
  // TODO: Should have a filter for enemy type?
  // TODO: Should have a filter for enemy location?
  // TODO: Should have a filter for enemy drops?
  // TODO: Should be able to interact with the AR calculator to see how much damage you do to the enemy

  return (
    <main className="flex flex-col gap-4 items-center max-w-[1420px] px-5 lg:px-0 mx-auto w-full py-4 max-[800px]:px-[calc(10vw/2)]">
      <Header />
      <EnemiesTable enemiesData={enemiesNG as Enemy[]} />
    </main>
  );
}
