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
import { CharacterAttributes } from "@/hooks/useCharacter";
import { Buff } from "@/lib/data/buffs";

// Dummy data
const attributesData = [
  { id: "vig", name: "Vigor", description: "Affects HP and Fire defense" },
  { id: "min", name: "Mind", description: "Affects FP and Focus" },
  {
    id: "end",
    name: "Endurance",
    description: "Affects Stamina and Robustness",
  },
  {
    id: "str",
    name: "Strength",
    description: "Affects physical attack power",
  },
  {
    id: "dex",
    name: "Dexterity",
    description: "Affects attack power and reduces casting time",
  },
  {
    id: "int",
    name: "Intelligence",
    description: "Required to perform glintstone sorceries",
  },
  {
    id: "fai",
    name: "Faith",
    description: "Required to perform sacred incantations",
  },
  {
    id: "arc",
    name: "Arcane",
    description: "Affects Discovery and some sorceries/incantations",
  },
];

export const defaultCharacter: {
  attributes: CharacterAttributes;
  level: number;
} = {
  attributes: {
    Vig: 10,
    Min: 10,
    End: 10,
    Str: 10,
    Dex: 10,
    Int: 10,
    Fai: 10,
    Arc: 10,
  },
  level: 1,
};

export interface CharacterStatsProps {
  character?: typeof defaultCharacter;
  setCharacterAttribute: (
    attribute: keyof typeof defaultCharacter.attributes,
    value: number
  ) => void;
  setIsTwoHanding: (isTwoHanding: boolean) => void;
  isTwoHanding: boolean;
  setBuffs: Dispatch<SetStateAction<BuffSelection>>;
  buffs: BuffSelection;
}

interface AttributeInputProps {
  attribute: keyof typeof defaultCharacter.attributes;
  value: number;
  onAttributeChanged(
    attribute: keyof typeof defaultCharacter.attributes,
    value: number
  ): void;
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
        {/* <Badge variant="secondary">{internalValue}</Badge> */}
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
  character = defaultCharacter,
  isTwoHanding,
  setIsTwoHanding,
  setBuffs,
  buffs,
}: CharacterStatsProps) {
  return (
    <div className="flex flex-col w-full gap-4">
      <h2 className="flex items-center justify-between text-2xl font-semibold leading-none tracking-tight">
        <span>Character Stats</span>
        <Badge variant="secondary" className="text-lg">
          Level: {character.level}
        </Badge>
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {(
          Object.entries(character.attributes) as [
            keyof typeof defaultCharacter.attributes,
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
            checked={isTwoHanding}
            onCheckedChange={() => setIsTwoHanding(!isTwoHanding)}
          />
          <Label htmlFor="isTwoHanding">Two Handing</Label>
        </div>
        <BuffsDialog setBuffs={setBuffs} buffs={buffs} />
      </div>
    </div>
  );
}
