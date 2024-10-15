import {
  useState,
  useRef,
  useEffect,
  memo,
  Dispatch,
  SetStateAction,
} from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import NumberTextField from "@/components/ui/number-input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BuffsDialog, BuffSelection } from "./buffs-dialog";
import {
  Character,
  CharacterAttributes,
  getCharacterLevel,
  attributesData,
} from "@/hooks/useCharacter";

export interface CharacterStatsProps {
  character: Character;
  setCharacterAttribute: (
    attribute: keyof CharacterAttributes,
    value: number
  ) => void;
  setIsTwoHanding: (isTwoHanding: boolean) => void;
  setBuffs: Dispatch<SetStateAction<BuffSelection>>;
  buffs: BuffSelection;
}

interface AttributeInputProps {
  attribute: keyof CharacterAttributes;
  value: number;
  onAttributeChanged(attribute: keyof CharacterAttributes, value: number): void;
  metadata: { name: string; description: string };
}

export const AttributeInput = memo(function AttributeInput({
  attribute,
  value,
  onAttributeChanged,
  metadata,
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
    }, 300);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={attribute} className="flex gap-3 text-sm font-medium">
          {metadata.name}
          <p className="text-sm text-muted-foreground">
            {metadata.description}
          </p>
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <NumberTextField
          id={attribute}
          className="w-16 text-center"
          value={internalValue}
          min={1}
          max={99}
          onChange={handleChange}
        />
        <Slider
          value={[internalValue]}
          min={1}
          max={99}
          step={1}
          className="flex-grow"
          onValueChange={([val]) => handleChange(val)}
        />
      </div>
    </div>
  );
});

export default function CharacterStats({
  setCharacterAttribute,
  character,
  setIsTwoHanding,
  setBuffs,
  buffs,
}: CharacterStatsProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="flex items-center justify-between text-2xl font-semibold leading-none tracking-tight">
        <span>Character Stats</span>
        <Badge variant="secondary" className="text-lg">
          Level: {getCharacterLevel(character.attributes)}
        </Badge>
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {(
          Object.entries(character.attributes) as [
            keyof CharacterAttributes,
            number
          ][]
        ).map(([key, value]) => {
          const attributeMetadata = attributesData.find(
            (attr) => attr.id.toLowerCase() === key.toLowerCase()
          )!;

          return (
            <AttributeInput
              key={key}
              attribute={key}
              value={value}
              onAttributeChanged={setCharacterAttribute}
              metadata={{
                name: attributeMetadata.name,
                description: attributeMetadata.id,
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isTwoHanding"
            checked={character.isTwoHanding}
            onCheckedChange={() => setIsTwoHanding(!character.isTwoHanding)}
          />
          <Label htmlFor="isTwoHanding">Two Handing</Label>
        </div>
        <BuffsDialog setBuffs={setBuffs} buffs={buffs} />
      </div>
    </div>
  );
}
