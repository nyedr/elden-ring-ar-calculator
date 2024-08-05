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

export interface Character {
  attributes: Attributes;
  level: number;
}

export function getCharacterLevel(attributes: Attributes): number {
  let statSum = Object.values(attributes).reduce((acc, val) => acc + val, 0);
  return statSum - 79;
}

const defaultAttributes: Attributes = {
  Vig: 10,
  Min: 10,
  End: 10,
  Str: 10,
  Dex: 10,
  Int: 10,
  Fai: 10,
  Arc: 10,
};

const defaultCharacter: Character = {
  attributes: defaultAttributes,
  level: getCharacterLevel(defaultAttributes),
};

export default function useCharacter() {
  const [character, setCharacter] = useState<Character>(() => {
    if (typeof window === "undefined") {
      return defaultCharacter;
    }
    const savedAttributes = localStorage.getItem("characterAttributes");
    if (savedAttributes) {
      const parsedAttributes: Attributes = JSON.parse(savedAttributes);
      return {
        attributes: parsedAttributes,
        level: getCharacterLevel(parsedAttributes),
      };
    }
    return defaultCharacter;
  });

  useEffect(() => {
    localStorage.setItem(
      "characterAttributes",
      JSON.stringify(character.attributes)
    );
  }, [character.attributes]);

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
