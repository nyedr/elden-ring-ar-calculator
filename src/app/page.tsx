"use client";

import useWeapons from "@/hooks/useWeapons";
import { parseCSV } from "@/lib/utils";
import weaponCSVData from "@/lib/data/csv";
import useCharacter from "@/hooks/useCharacter";

export default function Home() {
  const character = useCharacter({
    attributes: {
      Str: 10,
      Dex: 10,
      Int: 10,
      Fai: 10,
      Arc: 10,
      End: 10,
      Min: 10,
      Vig: 10,
    },
  });
  const { weapons, find } = useWeapons();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <pre className="bg-secondary p-5 rounded-lg w-full">
        <code>{JSON.stringify(weapons[0], null, 2)}</code>
      </pre>
    </main>
  );
}
