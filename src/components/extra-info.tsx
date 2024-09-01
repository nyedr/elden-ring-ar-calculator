"use client";

import EnemyInfo, { EnemyInfoProps } from "@/components/enemy-info";
import WeaponInfo, { WeaponInfoProps } from "@/components/weapon-info";

interface EnemyExtraInfoProps {
  enemy?: Omit<EnemyInfoProps, "isOpen" | "setIsOpen">;
}

interface WeaponExtraInfoProps {
  weapon?: Omit<WeaponInfoProps, "isOpen" | "setIsOpen">;
}

type ExtraInfoProps = (EnemyExtraInfoProps & WeaponExtraInfoProps) & {
  isDamageOnEnemy: boolean;
  setWeaponInfo: (info: any) => void;
  weaponAffinityOptions: any[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function ExtraInfo(props: ExtraInfoProps) {
  const {
    enemy,
    weapon,
    isDamageOnEnemy,
    setWeaponInfo,
    weaponAffinityOptions,
    isOpen,
    setIsOpen,
  } = props;

  if (enemy && isDamageOnEnemy) {
    return (
      <EnemyInfo
        {...enemy}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setWeaponInfo={setWeaponInfo}
        weaponAffinityOptions={weaponAffinityOptions}
      />
    );
  } else if (weapon && !isDamageOnEnemy) {
    return (
      <WeaponInfo
        {...weapon}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setWeaponInfo={setWeaponInfo}
        weaponAffinityOptions={weaponAffinityOptions}
      />
    );
  }

  return null;
}
