import { useState } from "react";

export const attributesData = [
  { id: "Vig", min: 9, damage: false, name: "Vigor" },
  { id: "Min", min: 9, damage: false, name: "Mind" },
  { id: "End", min: 8, damage: false, name: "Endurance" },
  { id: "Str", min: 8, damage: true, name: "Strength" },
  { id: "Dex", min: 10, damage: true, name: "Dexterity" },
  { id: "Int", min: 7, damage: true, name: "Intelligence" },
  { id: "Fai", min: 6, damage: true, name: "Faith" },
  { id: "Arc", min: 7, damage: true, name: "Arcane" },
];

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

export type Attributes = {
  [key in (typeof attributes)[number]]: number;
};

export interface CharacterProps {
  attributes: Attributes;
}

export interface Character {
  attributes: Attributes;
  level: number;
}

export default function useCharacter({ attributes }: CharacterProps) {
  const [character, setCharacter] = useState<Character>({
    attributes,
    level: 1,
  });

  function getCharacterLevel(attributes: Attributes): number {
    let statSum = Object.values(attributes).reduce((acc, val) => acc + val, 0);

    return statSum - 79;
  }

  function setCharacterAttribute(attribute: keyof Attributes, value: number) {
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
  };
}
