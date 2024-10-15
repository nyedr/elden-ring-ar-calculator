import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Icons } from "./icons";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full gap-5">
      <Link href="/">
        <h1 className="flex items-center gap-2 text-3xl font-bold sm:hidden whitespace-nowrap">
          ER v1.15
        </h1>
        <h1 className="items-center hidden gap-2 text-3xl font-bold sm:flex whitespace-nowrap">
          Elden Ring v1.15
        </h1>
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/enemies">
        Enemies
      </Link>
      <div className="flex items-center gap-5">
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
      </div>
    </header>
  );
}
