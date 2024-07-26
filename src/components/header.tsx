import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-end gap-5">
      <ThemeToggle />
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "lg",
          }),
          "rounded-full p-2 w-14 h-14"
        )}
        target="_blank"
        href="https://github.com/nyedr/elden-ring-ar-calculator"
      >
        <Icons.gitHub className="w-9 h-9" />
      </Link>
    </header>
  );
}
