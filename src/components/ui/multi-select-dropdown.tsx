import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { Icons } from "../icons";
import { Badge } from "./badge";
import { useEffect, useRef, useState } from "react";

export interface MultiSelectDropdownItem {
  label: string;
  value: string;
  group?: string;
}

interface MultiSelectDropdownProps {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  title: string;
  items: MultiSelectDropdownItem[];
  label: string;
}

// TODO: Modify the MultiSelectDropdown component to have a toggle button that selects/deselects all items in the dropdown
// The dropdown items should also be able to accept icon names to be extracted from the Icons component
// Remove the complicated conditional type logic and create a singular union type for the props

const MultiSelectDropdownItem = ({
  item,
  selectedItems,
  setSelectedItems,
}: {
  item: string;
  selectedItems: string[];
  setSelectedItems: (item: string[]) => void;
}) => (
  <DropdownMenuCheckboxItem
    key={item}
    className="capitalize"
    checked={selectedItems.includes(item)}
    onCheckedChange={(value) => {
      if (value) {
        setSelectedItems([...selectedItems, item]);
      } else {
        setSelectedItems(
          selectedItems.filter((selectedItem) => selectedItem !== item)
        );
      }
    }}
  >
    {item}
  </DropdownMenuCheckboxItem>
);

const WeaponTypeBadge = ({ type }: { type: string }) => {
  return (
    <Badge className="flex bg-secondary text-primary hover:opacity-70 hover:bg-secondary items-center gap-2 py-1">
      {type}
    </Badge>
  );
};

export default function MultiSelectDropdown({
  selectedItems,
  setSelectedItems,
  title,
  items,
  label,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectContentRef = useRef(null);

  const isAnyItemGrouped = items.some((item) => item.group);

  // group items by their group property
  const sections = items.reduce((acc, item) => {
    if (item.group) {
      acc[item.group] = acc[item.group] || [];
      acc[item.group].push(item.value);
    }
    return acc;
  }, {} as Record<string, string[]>);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */

    function handleClickOutside(event: MouseEvent) {
      if (!selectContentRef.current) return;
      // @ts-ignore
      setOpen(selectContentRef.current.contains(event.target));
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectContentRef]);

  const SelectControl = () => (
    <Button
      variant="ghost"
      size="icon"
      className="p-2 w-full h-8"
      onClick={() =>
        setSelectedItems(
          selectedItems.length ? [] : items.map((item) => item.value)
        )
      }
    >
      Toggle All
    </Button>
  );

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger onClick={() => setOpen(true)} asChild>
        <Button
          variant="outline"
          size="default"
          onClick={(e) => e.stopPropagation()}
          className="w-full hover:shadow-lg hover:bg-background flex flex-wrap h-auto text-start items-center justify-start gap-1"
        >
          {label}
          {selectedItems.length
            ? selectedItems.map((selectedItem) => (
                <WeaponTypeBadge type={selectedItem} key={selectedItem} />
              ))
            : title}{" "}
          {selectedItems.length > 0 && `(${selectedItems.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        ref={selectContentRef}
        className="w-full max-h-80 overflow-y-scroll"
        style={{
          minWidth: "200px",
        }}
      >
        <SelectControl />

        {isAnyItemGrouped
          ? Object.entries(sections).map(([section, items]) => {
              return (
                <div key={section}>
                  {section !== Object.entries(sections)[0][0] && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuLabel className="capitalize flex items-center">
                    {section}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {items.map((item) => (
                    <MultiSelectDropdownItem
                      key={item}
                      item={item}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                    />
                  ))}
                </div>
              );
            })
          : items.map((item, i) => {
              return (
                <MultiSelectDropdownItem
                  key={item.label}
                  item={item.label}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
              );
            })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="capitalize flex items-center">
          {items && <SelectControl />}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
