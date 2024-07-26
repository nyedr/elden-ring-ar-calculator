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
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

interface BaseMultiSelectDropdownProps {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  title: string;
}

interface ItemsDefinedProps extends BaseMultiSelectDropdownProps {
  items: string[];
  sections?: never;
}

interface SectionsDefinedProps extends BaseMultiSelectDropdownProps {
  sections: Record<string, string[]>;
  items?: never;
}

type MultiSelectDropdownProps = ItemsDefinedProps | SectionsDefinedProps;

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

export default function MultiSelectDropdown({
  sections,
  selectedItems,
  setSelectedItems,
  title,
  items,
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const selectContentRef = useRef(null);

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

  const WeaponTypeBadge = ({ type }: { type: string }) => {
    return (
      <Badge className="flex bg-secondary text-primary hover:opacity-70 hover:bg-secondary items-center gap-2 py-1">
        {type}
      </Badge>
    );
  };

  const SelectControl = () => (
    <div className="ml-auto flex gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="p-2 w-8 h-8"
        onClick={() => setSelectedItems([])}
      >
        <Icons.x className="h-full w-full" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="p-2 w-8 h-8"
        onClick={() => {
          if (sections) {
            const allItems = Object.values(sections).flat();
            setSelectedItems(allItems);
          } else {
            setSelectedItems(items);
          }
        }}
      >
        <Icons.check className="h-3 w-3" />
      </Button>
    </div>
  );

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger onClick={() => setOpen(true)} asChild>
        <Button
          variant="outline"
          size="default"
          onClick={(e) => e.stopPropagation()}
          className="w-full flex flex-wrap h-auto text-start items-center justify-start gap-1"
        >
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
        className="w-full max-h-80 overflow-y-scroll "
      >
        {sections
          ? Object.entries(sections).map(([section, items]) => {
              return (
                <div key={section}>
                  {section !== Object.entries(sections)[0][0] && (
                    <DropdownMenuSeparator />
                  )}
                  <DropdownMenuLabel className="capitalize flex items-center">
                    {section}
                    {section === Object.entries(sections)[0][0] && (
                      <SelectControl />
                    )}
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
                  key={item}
                  item={item}
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
