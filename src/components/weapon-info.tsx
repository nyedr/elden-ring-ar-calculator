import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Weapon } from "@/lib/data/weapon";
import { calculateWeaponDamage } from "@/lib/calc/damage";
import { Character } from "@/hooks/useCharacter";
import { createArrayFromNumber } from "@/lib/utils";
import { Button } from "./ui/button";

export interface WeaponInfoTriggerProps {
  weapon: Weapon;
  character: Character;
  isWeaponInfoOpen: boolean;
  setIsWeaponInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WeaponInfo({
  weapon,
  character,
  setIsWeaponInfoOpen,
  isWeaponInfoOpen,
}: WeaponInfoTriggerProps) {
  // const levelsArray = createArrayFromNumber(weapon.maxUpgradeLevel + 1);

  // const weaponDamageByLevel = levelsArray.map((level) =>
  //   calculateWeaponDamage(character, weapon, level)
  // );

  return (
    <Dialog open={isWeaponInfoOpen}>
      <DialogContent
        onXClick={() => setIsWeaponInfoOpen(false)}
        className="flex flex-col gap-4 max-w-[850px] w-full max-[800px]:px-[calc(10vw/2)]"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{weapon.name} Details</DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-3 justify-center">
          <div className="grid md:grid-cols-2 md:gap-x-10 gap-y-5">
            <DialogDescription className="flex w-full items-center justify-between">
              <strong>Weapon Name</strong>
              <span>{weapon.name}</span>
            </DialogDescription>
            <DialogDescription className="flex w-full items-center justify-between">
              <strong>Weapon Type</strong>
              <span>{weapon.weaponType}</span>
            </DialogDescription>
            <DialogDescription className="flex w-full items-center justify-between">
              <strong>Weight</strong>
              <span>{weapon.weight}</span>
            </DialogDescription>
            <DialogDescription className="flex w-full items-center justify-between">
              <strong>Physical damage</strong>
              <span>{weapon.physicalDamageType}</span>
            </DialogDescription>
            <DialogDescription className="flex w-full items-center justify-between">
              <strong>Affinity</strong>
              <span>{weapon.affinity}</span>
            </DialogDescription>
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={() => setIsWeaponInfoOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
