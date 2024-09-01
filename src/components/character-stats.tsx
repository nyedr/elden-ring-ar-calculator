import {
  CharacterAttributes,
  attributesData,
  Character,
} from "@/hooks/useCharacter";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import NumberTextField from "./ui/number-input";
import { memo, useEffect, useState, useRef } from "react";
import { Switch } from "./ui/switch";

interface CharacterStatsProps {
  character: Character;
  setCharacterAttribute: (
    attribute: keyof CharacterAttributes,
    value: number
  ) => void;
  setIsTwoHanding: (isTwoHanding: boolean) => void;
  isTwoHanding: boolean;
}

interface AttributeInputProps {
  attribute: keyof CharacterAttributes;
  value: number;
  onAttributeChanged(attribute: keyof CharacterAttributes, value: number): void;
}

export const AttributeInput = memo(function AttributeInput({
  attribute,
  value,
  onAttributeChanged,
}: AttributeInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (newValue: number) => {
    setInternalValue(newValue);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onAttributeChanged(attribute, newValue);
    }, 300); // Adjust the delay as needed
  };

  return (
    <div className="flex align-center justify-start gap-4 w-full">
      <NumberTextField
        className="w-12 text-center appearance-none"
        value={internalValue}
        min={1}
        max={99}
        onChange={handleChange}
      />
      <Slider
        value={[internalValue]}
        min={1}
        className="min-w-14"
        max={99}
        onValueChange={([val]) => handleChange(val)}
      />
    </div>
  );
});

export default function CharacterStats({
  setCharacterAttribute,
  character,
  isTwoHanding,
  setIsTwoHanding,
}: CharacterStatsProps) {
  return (
    <form className="flex flex-col w-full gap-4">
      {(
        Object.entries(character.attributes) as [
          keyof CharacterAttributes,
          number
        ][]
      ).map(([key, value]) => {
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
              <AttributeInput
                value={value}
                key={key}
                onAttributeChanged={setCharacterAttribute}
                attribute={key}
              />
            </div>
          </div>
        );
      })}
      <div className="flex items-center w-full justify-between">
        <h1 className="text-2xl font-medium">Level: {character.level}</h1>
        <div className="flex items-center space-x-2">
          <Label className="whitespace-nowrap" htmlFor="isTwoHanding">
            Two Handing
          </Label>
          <Switch
            checked={isTwoHanding}
            onCheckedChange={() => setIsTwoHanding(!isTwoHanding)}
            id="isTwoHanding"
          />
        </div>
      </div>
    </form>
  );
}
