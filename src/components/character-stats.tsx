import { Attributes, attributesData, Character } from "@/hooks/useCharacter";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Icons } from "./icons";

interface CharacterStatsProps {
  character: Character;
  setCharacterAttribute: (attribute: keyof Attributes, value: number) => void;
}

export default function CharacterStats({
  setCharacterAttribute,
  character,
}: CharacterStatsProps) {
  const handleCharacterStatChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    let value = Number(e.target.value);
    setCharacterAttribute(e.target.name as keyof Attributes, value);
  };

  return (
    <form className="flex flex-col w-full gap-4">
      {Object.entries(character.attributes).map(([key, value]) => {
        const attributeMetadata = attributesData.find(
          (attr) => attr.id === key
        )!;

        return (
          <div
            key={key}
            className="w-full flex items-center justify-between gap-3"
          >
            <Label className="w-24" htmlFor={key}>
              {attributeMetadata.name}
            </Label>
            <div className="flex items-center gap-3 w-full">
              <Input
                type="number"
                name={key}
                defaultValue={value}
                value={value}
                onChange={handleCharacterStatChange}
                className="w-12 text-center appearance-none"
                max={99}
                min={attributeMetadata.min}
              />
              <Button
                variant="ghost"
                type="button"
                size="icon"
                onClick={() => {
                  const value = character.attributes[key as keyof Attributes];
                  setCharacterAttribute(key as keyof Attributes, value - 1);
                }}
              >
                <Icons.minus className="h-5 w-5" />
              </Button>

              {/* TODO: Fix input's trailing zero */}
              <Slider
                name={key}
                onValueChange={(value) => {
                  setCharacterAttribute(key as keyof Attributes, value[0]);
                }}
                defaultValue={[value]}
                value={[value]}
                max={99}
                min={attributeMetadata.min}
                step={1}
                className={`w-full after:content-[${99}] after:text-xs after:absolute after:right-0 after:mr-2 after:block`}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  const value = character.attributes[key as keyof Attributes];
                  setCharacterAttribute(key as keyof Attributes, value + 1);
                }}
              >
                <Icons.plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      })}
      <h1 className="text-2xl font-medium">Level: {character.level}</h1>
    </form>
  );
}
