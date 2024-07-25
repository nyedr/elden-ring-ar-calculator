"use client";

import useCharacter from "@/hooks/useCharacter";
import CharacterStats from "@/components/character-stats";
import getWeapons from "@/lib/data/getWeapons";
import { useMemo, useState } from "react";
import { Weapon } from "@/lib/data/weapon";
import { ComboboxItem, WeaponSearch } from "@/components/weapon-search";

export default function Home() {
  const { character, setCharacterAttribute } = useCharacter();
  const weaponsData = useMemo(() => getWeapons(), []);
  const [selectedWeapons, setSelectedWeapons] = useState<Weapon[] | null>([]);

  const weaponOptions: ComboboxItem[] = weaponsData.weapons.map((weapon) => ({
    value: weapon.weaponName,
    label: weapon.weaponName,
  }));

  return (
    <main className="max-w-[1420px] px-5 lg:px-0 mx-auto w-full py-4 max-[800px]:px-[calc(10vw/2)]">
      <div className="flex sm:flex-row flex-col justify-center w-full px-5 gap-5 items-center sm:justify-between">
        <CharacterStats {...{ character, setCharacterAttribute }} />
        <WeaponSearch
          findWeapon={weaponsData.findWeapon}
          items={weaponOptions}
          setSelectedWeapons={setSelectedWeapons}
        />
      </div>
    </main>
  );
}
