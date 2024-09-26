"use client";

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomSelect } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import {
  auraBuffs,
  bodyBuffs,
  debuffs,
  tears,
  uniqueBuffs,
  // weaponBuffs
} from "@/lib/data/buffs/activeBuffs";
import { MultiSelect } from "./ui/multi-select";
import {
  talismanBuffs,
  Armor,
  armsPiecesWithDamagePassives,
  bodyPiecesWithDamagePassives,
  headPiecesWithDamagePassives,
  legsPiecesWithDamagePassives,
} from "@/lib/data/buffs/passiveBuffs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Buff } from "@/lib/data/buffs";
import Combobox from "./ui/combobox";

const BuffSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="p-4 bg-primary/10">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </CardContent>
  </Card>
);

export interface BuffSelection {
  activeBuffs: {
    bodyBuff: Buff | null;
    auraBuff: Buff | null;
    uniqueBuffs: Buff[];
  };
  passiveBuffs: {
    headPiece: Buff | null;
    bodyPiece: Buff | null;
    armsPiece: Buff | null;
    legsPiece: Buff | null;
  };
  talismanBuffs: {
    talismanOne: Buff | null;
    talismanTwo: Buff | null;
    talismanThree: Buff | null;
    talismanFour: Buff | null;
  };
  tearsBuffs: {
    tearOne: Buff | null;
    tearTwo: Buff | null;
  };
  debuff: Buff | null;
}

export const defaultBuffSelection: BuffSelection = {
  activeBuffs: {
    bodyBuff: null,
    auraBuff: null,
    uniqueBuffs: [],
  },
  passiveBuffs: {
    headPiece: null,
    bodyPiece: null,
    armsPiece: null,
    legsPiece: null,
  },
  talismanBuffs: {
    talismanOne: null,
    talismanTwo: null,
    talismanThree: null,
    talismanFour: null,
  },
  tearsBuffs: {
    tearOne: null,
    tearTwo: null,
  },
  debuff: null,
};

interface BuffsDialogProps {
  setBuffs: Dispatch<SetStateAction<BuffSelection>>;
  buffs: BuffSelection;
}

export function BuffsDialog({ setBuffs, buffs }: BuffsDialogProps) {
  const [open, setOpen] = useState(false);
  const [buffSelection, setBuffSelection] = useState<BuffSelection>(buffs);

  const onActiveBuffSelectionChange = (key: string, value: Buff | null) => {
    setBuffSelection((prev) => ({
      ...prev,
      activeBuffs: {
        ...prev.activeBuffs,
        [key]: value,
      },
    }));
  };

  const onArmorBuffSelectionChange = (key: string, armor: Armor | null) => {
    if (!armor) return;

    const buff: Buff = {
      name: armor?.name,
      effectType: armor?.effectType,
      multipliers: armor?.multipliers,
      id: armor?.id,
    };

    setBuffSelection((prev) => ({
      ...prev,
      passiveBuffs: {
        ...prev.passiveBuffs,
        [key]: buff,
      },
    }));
  };

  const onTearBuffSelectionChange = (key: string, value: string) => {
    const tear = tears.find((buff) => buff.name === value);
    setBuffSelection((prev) => ({
      ...prev,
      tearsBuffs: {
        ...prev.tearsBuffs,
        [key]: tear || null,
      },
    }));
  };

  const onTalismansBuffSelectionChange = (key: string, value: string) => {
    const talisman = talismanBuffs.find((buff) => buff.name === value);
    setBuffSelection((prev) => ({
      ...prev,
      talismanBuffs: {
        ...prev.talismanBuffs,
        [key]: talisman || null,
      },
    }));
  };

  const talismanOptions = talismanBuffs.map(({ name }) => ({
    label: name,
    value: name,
  }));

  const getAvailableTalismanOptions = (
    key: keyof BuffSelection["talismanBuffs"]
  ) => {
    const selectedTalismans = Object.values(buffSelection.talismanBuffs).filter(
      (talisman) => talisman !== null
    ) as Buff[];

    return talismanOptions
      .filter((option) => {
        const isSelected = selectedTalismans.some(
          (talisman) => talisman.name === option.value
        );
        const isCurrentSelection =
          option.value === buffSelection.talismanBuffs[key]?.name;
        return !isSelected || isCurrentSelection;
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const getAvailableTearOptions = (key: keyof BuffSelection["tearsBuffs"]) => {
    // Get the tears selected in other selects (excluding the current select)
    const selectedTearsInOtherSelects = Object.entries(buffSelection.tearsBuffs)
      .filter(([k, tear]) => k !== key && tear !== null)
      .map(([k, tear]) => tear as Buff);

    // Get the current selection for this select
    const currentSelection = buffSelection.tearsBuffs[key];

    return tears
      .filter((option) => {
        // Check if the option's id is selected in other selects
        const isSelectedInOtherSelects = selectedTearsInOtherSelects.some(
          (tear) => tear.id === option.id
        );

        // Check if the option is the current selection in this select
        const isCurrentSelection = option.id === currentSelection?.id;

        // Include the option if it's not selected in other selects or it's the current selection
        return !isSelectedInOtherSelects || isCurrentSelection;
      })
      .map(({ name }) => ({
        label: name,
        value: name,
      }));
  };

  const getAvailabelUniqueBuffOptions = () => {
    const isSelectedElseWhere = (id: number) => {
      const otherBuffIds = new Set(
        [
          buffSelection.activeBuffs.auraBuff?.id,
          buffSelection.activeBuffs.bodyBuff?.id,
          buffSelection.tearsBuffs.tearOne?.id,
          buffSelection.tearsBuffs.tearTwo?.id,
          buffSelection.debuff?.id,
          buffSelection.talismanBuffs.talismanOne?.id,
          buffSelection.talismanBuffs.talismanTwo?.id,
          buffSelection.talismanBuffs.talismanThree?.id,
          buffSelection.talismanBuffs.talismanFour?.id,
          buffSelection.passiveBuffs.armsPiece?.id,
          buffSelection.passiveBuffs.legsPiece?.id,
          buffSelection.passiveBuffs.headPiece?.id,
          buffSelection.passiveBuffs.bodyPiece?.id,
        ].filter((id) => id !== undefined)
      );

      return otherBuffIds.has(id);
    };

    const selectedUniqueBuffIds = new Set(
      buffSelection.activeBuffs.uniqueBuffs.map((buff) => buff.id)
    );

    return uniqueBuffs
      .filter((buff) => {
        const isSelectedElsewhere = isSelectedElseWhere(buff.id);

        if (buff.incompatible) {
          const hasIncompatibleBuff = buff.incompatible.some((id) =>
            selectedUniqueBuffIds.has(id)
          );

          return !isSelectedElsewhere && !hasIncompatibleBuff;
        }

        return !isSelectedElsewhere;
      })
      .map(({ name }) => ({
        label: name,
        value: name,
      }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Buffs</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-screen sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Buffs & Debuffs
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-4 max-h-[calc(90vh-10rem)]">
          <div className="space-y-6">
            <BuffSection title="Active Buffs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CustomSelect
                  hasBadge={true}
                  label="Body Buff"
                  id="bodyBuff"
                  items={bodyBuffs.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  value={buffSelection.activeBuffs.bodyBuff?.name}
                  placeholder="Select a Body buff"
                  onChange={(value) => {
                    const buff = bodyBuffs.find((buff) => buff.name === value);
                    onActiveBuffSelectionChange("bodyBuff", buff || null);
                  }}
                />
                <CustomSelect
                  hasBadge={true}
                  label="Aura Buff"
                  id="auraBuff"
                  items={auraBuffs.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  value={buffSelection.activeBuffs.auraBuff?.name}
                  placeholder="Select an Aura buff"
                  onChange={(value) => {
                    const buff = auraBuffs.find(
                      (buff) => buff.name === value
                    ) as Buff;
                    onActiveBuffSelectionChange("auraBuff", buff || null);
                  }}
                />
              </div>
              <div className="w-full space-y-2">
                <Label
                  htmlFor="uniqueBuffs"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Unique Buffs
                  <Badge variant="outline" className="font-normal">
                    {buffSelection.activeBuffs.uniqueBuffs.length}
                  </Badge>
                </Label>
                <MultiSelect
                  defaultValue={[
                    ...buffSelection.activeBuffs.uniqueBuffs.map(
                      ({ name }) => name
                    ),
                  ]}
                  id="uniqueBuffs"
                  options={getAvailabelUniqueBuffOptions()}
                  placeholder="Select Unique buffs"
                  onValueChange={(value) => {
                    const selectedBuffs = value.map((name) =>
                      uniqueBuffs.find((buff) => buff.name === name)
                    );
                    setBuffSelection((prev) => ({
                      ...prev,
                      activeBuffs: {
                        ...prev.activeBuffs,
                        uniqueBuffs: selectedBuffs as Buff[],
                      },
                    }));
                  }}
                />
              </div>
            </BuffSection>
            <BuffSection title="Passive Armor Buffs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Combobox
                  hasBadge={true}
                  label="Head Piece"
                  id="headPiece"
                  items={headPiecesWithDamagePassives.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  buttonProps={{ className: "font-normal" }}
                  defaultValue={buffSelection.passiveBuffs.headPiece?.name}
                  onValueChange={(value) => {
                    const name = headPiecesWithDamagePassives.find(
                      (armor) => armor.name === value
                    );
                    onArmorBuffSelectionChange("headPiece", name ?? null);
                  }}
                />
                <CustomSelect
                  hasBadge={true}
                  label="Body"
                  id="bodyPiece"
                  items={bodyPiecesWithDamagePassives.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  value={buffSelection.passiveBuffs.bodyPiece?.name}
                  placeholder="Select a body piece"
                  onChange={(value) => {
                    const name = bodyPiecesWithDamagePassives.find(
                      (armor) => armor.name === value
                    );
                    onArmorBuffSelectionChange("bodyPiece", name ?? null);
                  }}
                />
                <CustomSelect
                  hasBadge={true}
                  label="Arms"
                  id="armsPiece"
                  items={armsPiecesWithDamagePassives.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  value={buffSelection.passiveBuffs.armsPiece?.name}
                  placeholder="Select an arms piece"
                  onChange={(value) => {
                    const name = armsPiecesWithDamagePassives.find(
                      (armor) => armor.name === value
                    );
                    onArmorBuffSelectionChange("armsPiece", name ?? null);
                  }}
                />
                <CustomSelect
                  hasBadge={true}
                  label="Legs"
                  id="legsPiece"
                  items={legsPiecesWithDamagePassives.map(({ name }) => ({
                    label: name,
                    value: name,
                  }))}
                  value={buffSelection.passiveBuffs.legsPiece?.name}
                  placeholder="Select a legs piece"
                  onChange={(value) => {
                    const name = legsPiecesWithDamagePassives.find(
                      (armor) => armor.name === value
                    );
                    onArmorBuffSelectionChange("legsPiece", name ?? null);
                  }}
                />
              </div>
            </BuffSection>
            <BuffSection title="Tears Buffs">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CustomSelect
                  hasBadge={true}
                  label="Tear 1"
                  id="tearOne"
                  items={getAvailableTearOptions("tearOne")}
                  value={buffSelection.tearsBuffs.tearOne?.name}
                  placeholder="Select a tear"
                  onChange={(value) =>
                    onTearBuffSelectionChange("tearOne", value)
                  }
                />
                <CustomSelect
                  hasBadge={true}
                  label="Tear 2"
                  id="tearTwo"
                  items={getAvailableTearOptions("tearTwo")}
                  value={buffSelection.tearsBuffs.tearTwo?.name}
                  placeholder="Select a tear"
                  onChange={(value) =>
                    onTearBuffSelectionChange("tearTwo", value)
                  }
                />
              </div>
            </BuffSection>
            <BuffSection title="Talismans">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Combobox
                  hasBadge={true}
                  buttonProps={{ className: "font-normal" }}
                  label="Talisman"
                  id="talismanOne"
                  items={getAvailableTalismanOptions("talismanOne")}
                  defaultValue={buffSelection.talismanBuffs.talismanOne?.name}
                  onValueChange={(value) =>
                    onTalismansBuffSelectionChange("talismanOne", value)
                  }
                />
                <Combobox
                  hasBadge={true}
                  buttonProps={{ className: "font-normal" }}
                  label="Talisman"
                  id="talismanTwo"
                  items={getAvailableTalismanOptions("talismanTwo")}
                  defaultValue={buffSelection.talismanBuffs.talismanTwo?.name}
                  onValueChange={(value) =>
                    onTalismansBuffSelectionChange("talismanTwo", value)
                  }
                />
                <Combobox
                  hasBadge={true}
                  buttonProps={{ className: "font-normal" }}
                  label="Talisman"
                  id="talismanThree"
                  items={getAvailableTalismanOptions("talismanThree")}
                  defaultValue={buffSelection.talismanBuffs.talismanThree?.name}
                  onValueChange={(value) =>
                    onTalismansBuffSelectionChange("talismanThree", value)
                  }
                />
                <Combobox
                  hasBadge={true}
                  buttonProps={{ className: "font-normal" }}
                  label="Talisman"
                  id="talismanFour"
                  items={getAvailableTalismanOptions("talismanFour")}
                  defaultValue={buffSelection.talismanBuffs.talismanFour?.name}
                  onValueChange={(value) =>
                    onTalismansBuffSelectionChange("talismanFour", value)
                  }
                />
              </div>
            </BuffSection>
            <BuffSection title="Standard Debuff">
              <CustomSelect
                hasBadge={true}
                label="Debuff"
                id="debuff"
                placeholder="Select a debuff"
                items={debuffs.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
                value={buffSelection.debuff?.name}
                onChange={(value) =>
                  setBuffSelection((prev) => ({
                    ...prev,
                    debuff: debuffs.find((buff) => buff.name === value) || null,
                  }))
                }
              />
            </BuffSection>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-row items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={() => {
              setBuffSelection(defaultBuffSelection);
              setBuffs(defaultBuffSelection);
            }}
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              setBuffs(buffSelection);

              setOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
