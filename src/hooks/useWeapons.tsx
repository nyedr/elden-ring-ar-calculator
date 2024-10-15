import regulationData from "@/public/data/regulation-vanilla-v1.14.json";
import { useEffect, useState, useMemo, useCallback } from "react";
import { updateWeaponData } from "@/lib/data/extraWeaponData";
import {
  decodeRegulationData,
  EncodedRegulationDataJson,
} from "@/lib/data/regulationData";
import { Weapon } from "@/lib/data/weapon";

export default function useWeapons() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const setWeaponData = async () => {
      setIsLoading(true);
      try {
        const decodedWeaponData = decodeRegulationData(
          regulationData as unknown as EncodedRegulationDataJson
        );

        const updatedWeaponData = await updateWeaponData(decodedWeaponData);

        if (isMounted) {
          // Update state only if the component is still mounted
          setWeapons(updatedWeaponData);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load weapon data");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setWeaponData();

    return () => {
      isMounted = false; // Cleanup to avoid setting state after unmount
    };
  }, []);

  const weaponsMap = useMemo(
    () => new Map(weapons.map((weapon) => [weapon.name, weapon])),
    [weapons]
  );

  const findWeapon = useCallback(
    (name: string) => weaponsMap.get(name),
    [weaponsMap]
  );

  return { weapons, findWeapon, error, isLoading };
}
