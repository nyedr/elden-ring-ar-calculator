"use client";

import { useState, useEffect } from "react";

export const attributesData = [
  { id: "Vig", min: 9, damage: false, name: "Vigor" },
  { id: "Min", min: 9, damage: false, name: "Mind" },
  { id: "End", min: 8, damage: false, name: "Endurance" },
  { id: "Str", min: 8, damage: true, name: "Strength" },
  { id: "Dex", min: 8, damage: true, name: "Dexterity" },
  { id: "Int", min: 7, damage: true, name: "Intelligence" },
  { id: "Fai", min: 6, damage: true, name: "Faith" },
  { id: "Arc", min: 7, damage: true, name: "Arcane" },
];

import type { Attributes as AttackAttributes } from "@/lib/data/attributes";

const attributes = [
  "Vig",
  "Min",
  "End",
  "Str",
  "Dex",
  "Int",
  "Fai",
  "Arc",
] as const;

export type CharacterAttributes = {
  [key in (typeof attributes)[number]]: number;
};

export const getAttackAttributes = (
  attributes: CharacterAttributes
): AttackAttributes => {
  return {
    arc: attributes.Arc,
    dex: attributes.Dex,
    str: attributes.Str,
    int: attributes.Int,
    fai: attributes.Fai,
  } satisfies AttackAttributes;
};

export interface Character {
  attributes: CharacterAttributes;
  level: number;
  isTwoHanding: boolean;
}

export function getCharacterLevel(attributes: CharacterAttributes): number {
  let statSum = Object.values(attributes).reduce((acc, val) => acc + val, 0);
  return statSum - 79;
}

const defaultAttributes: CharacterAttributes = {
  Vig: 10,
  Min: 10,
  End: 10,
  Str: 10,
  Dex: 10,
  Int: 10,
  Fai: 10,
  Arc: 10,
};

export default function useCharacter() {
  const [character, setCharacter] = useState<Character>({
    attributes: defaultAttributes,
    level: getCharacterLevel(defaultAttributes),
    isTwoHanding: false,
  });

  useEffect(() => {
    localStorage.setItem(
      "characterAttributes",
      JSON.stringify(character.attributes)
    );
  }, [character.attributes]);

  function setCharacterAttribute(
    attribute: keyof CharacterAttributes,
    value: number
  ) {
    const newCharacterLevel = getCharacterLevel({
      ...character.attributes,
      [attribute]: value,
    });

    setCharacter({
      ...character,
      attributes: { ...character.attributes, [attribute]: value },
      level: newCharacterLevel,
    });
  }

  return {
    character,
    setCharacterAttribute,
    setIsTwoHanding: (isTwoHanding: boolean) =>
      setCharacter({ ...character, isTwoHanding }),
    getAttackAttributes,
  };
}
