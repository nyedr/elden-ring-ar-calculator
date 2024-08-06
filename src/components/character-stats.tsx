import { Attributes, attributesData, Character } from "@/hooks/useCharacter";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import NumberTextField from "./ui/number-input";
import { memo, useCallback, useEffect, useState, useRef } from "react";

interface CharacterStatsProps {
  character: Character;
  setCharacterAttribute: (attribute: keyof Attributes, value: number) => void;
}

interface AttributeInputProps {
  attribute: keyof Attributes;
  value: number;
  onAttributeChanged(attribute: keyof Attributes, value: number): void;
}

const AttributeInput = memo(function AttributeInput({
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

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function CharacterStats({
  setCharacterAttribute,
  character,
}: CharacterStatsProps) {
  const [sliderValues, setSliderValues] = useState(character.attributes);

  useEffect(() => {
    setSliderValues(character.attributes);
  }, [character.attributes]);

  const debouncedSetCharacterAttribute = useCallback(
    debounce((key: keyof Attributes, value: number) => {
      setCharacterAttribute(key, value);
    }, 100),
    []
  );

  const handleSliderChange = (key: keyof Attributes, value: number) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));

    debouncedSetCharacterAttribute(key, value);
  };

  return (
    <form className="flex flex-col w-full gap-4">
      {(
        Object.entries(character.attributes) as [keyof Attributes, number][]
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
      <h1 className="text-2xl font-medium">Level: {character.level}</h1>
    </form>
  );
}
